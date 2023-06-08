#include <LWiFi.h>
#include <PubSubClient.h>
#include <Servo.h>
#include <Wire.h>
#include "vl53l0x.h"

Servo myservo; // create servo object to control a servo
// twelve servo objects can be created on most boards
#define SERVO_PIN 10

int pos = 0; // variable to store the servo position

// WiFi AP ssid / password here
char ssid[] = "SSID";    //  your network SSID (name)
char pass[] = "PASSWORD"; // your network password (use for WPA, or use as key for WEP)

// MQTT Broker info
// IPAddress server(192, 168, 1, 182);
char server[] = "MQTT SERVER";
int port = 1883;

// MQTT Client info
// Client ID.
// Note that a broker allows an individual client to create only on session.
// If a session is created by another client with same cliend ID, the former one will be disconnected.
// Thus, each sensor node's client must be different from each other.
#define DEVICE_NAME "Feeder-bedroom"
#define DEVICE_POSITION "bedroom"
char client_id[] = DEVICE_NAME;

// MQTT topics
#define TOPIC_INFO "automeow/feeder/info"
#define TOPIC_DISTANCE "automeow/feeder/distance"
#define TOPIC_CONTROL "automeow/feeder/control"

void buildInfo(char *info, char *status)
{
    strcpy(info, status);
    strcat(info, ",");
    strcat(info, DEVICE_NAME);
    strcat(info, ",");
    strcat(info, DEVICE_POSITION);
    strcat(info, ",");
}

// Clients for MQTT
WiFiClient wifiClient;
PubSubClient client(wifiClient);

// Timer info
#define DEVICE_Publish_interval 10000
unsigned long temp_last_time;

// LED Control info
#define LED_PIN LED_BUILTIN
typedef enum
{
    DEVICE_OFF = 0,
    DEVICE_ON,
} Control_Status;
Control_Status device_status = DEVICE_ON;

typedef enum
{
    FEEDER_OFF = 0,
    FEEDER_ON,
} Feeder_Status;
Feeder_Status to_feed = FEEDER_OFF;

void led_on()
{
    digitalWrite(LED_PIN, HIGH);
}

void led_off()
{
    digitalWrite(LED_PIN, LOW);
}

void callback(char *topic, byte *payload, unsigned int length)
{
    // Output incoming message to serial terminal
    Serial.print("Message arrived [");
    Serial.print(topic);
    Serial.print("] ");
    for (int i = 0; i < length; i++)
    {
        Serial.print((char)payload[i]);
    }
    Serial.println();

    // If LED Control command is incoming, change LED status
    if (!strcmp(topic, TOPIC_CONTROL))
    {
        switch (payload[0])
        {
        case '0':
            device_status = DEVICE_OFF;
            break;
        case '1':
            device_status = DEVICE_ON;
            break;
        case '2':
            to_feed = FEEDER_ON;
            break;
        default:
        {
        }
        }
    }
}

void reconnect()
{
    // Loop until we're reconnected
    while (!client.connected())
    {
        Serial.print("Attempting MQTT connection...");
        // Attempt to connect
        if (client.connect(client_id))
        {
            Serial.println("connected");
            // Once connected, publish an announcement...
            char info[50];
            buildInfo(info, "ON");
            client.publish(TOPIC_INFO, info);
            // ... and resubscribe
            client.subscribe(TOPIC_CONTROL);
            // ... and resubscribe
        }
        else
        {
            Serial.print("failed, rc=");
            Serial.print(client.state());
            Serial.println(" try again in 5 seconds");
            // Wait 5 seconds before retrying
            delay(5000);
        }
    }
}

void setup()
{
    Wire.begin(); 
    // setup Serial output at 9600
    Serial.begin(9600);

    // initialization servo
    initServo();

    // Set MQTT broker
    client.setServer(server, port);
    client.setCallback(callback);

    // setup Wifi connection
    while (WL_CONNECTED != WiFi.status())
    {
        Serial.print("WiFi.begin(");
        Serial.print(ssid);
        Serial.print(",");
        Serial.print(pass);
        Serial.println(")...");
        WiFi.begin(ssid, pass);
    }
    Serial.println("WiFi connected !!");
    printWifiStatus();

    temp_last_time = millis();
}

void loop()
{
    unsigned long current_time;

    if (!client.connected())
    {
        reconnect();
    }

    // Get temperature & humidity and publish them
    current_time = millis();
    if (DEVICE_Publish_interval < (current_time - temp_last_time))
    {
        if (device_status == DEVICE_OFF)
        {
            char info[50];
            buildInfo(info, "OFF");
            client.publish(TOPIC_INFO, info);
        }
        else
        {
            char dist[10];
            sprintf(dist, "%d", read_dist());
            Serial.println(dist);
            client.publish(TOPIC_DISTANCE, dist);
            char info[50];
            buildInfo(info, "ON");
            client.publish(TOPIC_INFO, info);
        }
        // update last time value
        temp_last_time = current_time;
    }

    if (to_feed == FEEDER_ON && device_status == DEVICE_ON)
    {
        myservo.attach(SERVO_PIN);
        for (pos = 0; pos <= 90; pos += 1)
        { // goes from 0 degrees to 180 degrees
            // in steps of 1 degree
            myservo.write(pos); // tell servo to go to position in variable 'pos'
            delay(15); // waits 15ms for the servo to reach the position
        }
        for (pos = 90; pos >= 0; pos -= 1)
        {                       // goes from 180 degrees to 0 degrees
            myservo.write(pos); // tell servo to go to position in variable 'pos'
            delay(15); // waits 15ms for the servo to reach the position
        }
        to_feed = FEEDER_OFF;
        delay(1000);
        myservo.detach();
    }

    // Control LED according to dht_status
    switch (device_status)
    {
    case DEVICE_OFF:
        led_off();
        break;
    case DEVICE_ON:
        led_on();
        break;
    default:
    {
    }
    }

    client.loop();
}

void initServo()
{
    myservo.attach(SERVO_PIN); // attaches the servo on pin 10 to the servo object
    myservo.write(pos); // tell servo to go to position in variable 'pos'
    delay(1000);
    myservo.detach();
}

void printWifiStatus()
{
    // print the SSID of the network you're attached to:
    Serial.print("SSID: ");
    Serial.println(WiFi.SSID());

    // print your WiFi shield's IP address:
    IPAddress ip = WiFi.localIP();
    Serial.print("IP Address: ");
    Serial.println(ip);

    // print the received signal strength:
    long rssi = WiFi.RSSI();
    Serial.print("signal strength (RSSI):");
    Serial.print(rssi);
    Serial.println(" dBm");
}
