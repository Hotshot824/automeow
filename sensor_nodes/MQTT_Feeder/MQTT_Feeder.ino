#include "base.h"
#include "config.h"
#include <Servo.h>
#include <Wire.h>
#include "vl53l0x.h"

Servo myservo; // create servo object to control a servo
// twelve servo objects can be created on most boards
#define SERVO_PIN 10
#define BUTTON_PIN 6
int pos = 0; // variable to store the servo position

// Set auto feeder diff, unit is mm.
#define AUTO_FEEDER_DIFF 15

// Timer info
#define PUB_INTERVAL 10000
unsigned long temp_last_time;
unsigned long current_time;

// Device init info and status
JSONVar device_info;
void initInfo()
{
  // Init a JSON Object
  device_info["device_type"] = DEVICE_TYPE;
  device_info["device_name"] = DEVICE_NAME;
  device_info["device_position"] = DEVICE_POSITION;
  device_info["device_status"] = true;
  device_info["feeder_status"] = false;
  device_info["data"]["mode"] = "manual";
}

void setup()
{
  // join i2c bus (address optional for master)
  Wire.begin();

  initInfo();
  setupBase();

  initServo();
  attachInterrupt(BUTTON_PIN, pin_change, RISING);

  device_info["data"]["init_distance"] = read_dist();
  Serial.print("the init distance is ");
  Serial.println(device_info["data"]["init_distance"]);

  temp_last_time = millis();
}

void loop()
{
  // Check MQTT broker connection status
  // If it is disconnected, reconnect to the broker
  if (!client.connected())
  {
    reconnect();
  }

  // Get info publish them ...
  current_time = millis();
  if (PUB_INTERVAL < (current_time - temp_last_time))
  {
    if (device_info["device_status"])
    {
      int distance = read_dist();
      device_info["data"]["distance"] = distance;
      Serial.print("the sensor distance is ");
      Serial.println(distance);
    }
    else
    {
      device_info["data"]["distance"] = undefined;
    }

    if (device_info["device_status"] && !strcmp(device_info["data"]["mode"], "auto"))
    {
      int init_dist = device_info["data"]["init_distance"];
      int current_dist = device_info["data"]["distance"];
      int diff = init_dist - current_dist;
      if (diff <= AUTO_FEEDER_DIFF)
      {
        device_info["feeder_status"] = true;
      }
    }

    String jsonString = JSON.stringify(device_info);
    const char *jsonCharArray = jsonString.c_str();
    client.publish(TOPIC_INFO, jsonCharArray, strlen(jsonCharArray));
    Serial.print("Publish to ");
    Serial.println(TOPIC_INFO);

    // update last time value
    temp_last_time = current_time;
  }

  if (device_info["device_status"] && device_info["feeder_status"])
  {
    myservo.attach(SERVO_PIN);
    for (pos = 0; pos <= 90; pos += 1)
    {
      // goes from 0 degrees to 90 degrees
      myservo.write(pos); // tell servo to go to position in variable 'pos'
      delay(5);           // waits for the servo to reach the position
    }
    for (pos = 90; pos >= 0; pos -= 1)
    {                     // goes from 90 degrees to 0 degrees
      myservo.write(pos); // tell servo to go to position in variable 'pos'
      delay(5);           // waits for the servo to reach the position
    }
    delay(100);
    device_info["feeder_status"] = !device_info["feeder_status"];
    myservo.detach();
  }

  client.loop();
  deviceStatus();
}

void topicSubPub()
{
  // Once connected, publish an announcement resubscribe
  client.subscribe(TOPIC_CONTROL);
}

void handleCallback(char *topic, JSONVar payloadJSON)
{
  // If LED Control command is incoming, change LED status
  if (!strcmp(topic, TOPIC_CONTROL) && !strcmp(payloadJSON["device_name"], DEVICE_NAME))
  {
    if ((bool)payloadJSON["device_status"])
    {
      device_info["device_status"] = true;
    }
    else
    {
      device_info["device_status"] = false;
    }

    if ((bool)payloadJSON["device_mode"])
    {
      device_info["data"]["mode"] = "manual";
    }
    else
    {
      device_info["data"]["mode"] = "auto";
    }

    if ((bool)payloadJSON["feeder_status"])
    {
      device_info["feeder_status"] = true;
    }
    else
    {
      device_info["feeder_status"] = false;
    }
  }
}

void initServo()
{
  myservo.attach(SERVO_PIN); // attaches the servo on pin 10 to the servo object
  myservo.write(pos);        // tell servo to go to position in variable 'pos'
  delay(1000);
  myservo.detach();
}

void pin_change(void)
{
  device_info["feeder_status"] = !device_info["feeder_status"];
}
