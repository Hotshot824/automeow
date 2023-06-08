#include "DHT.h"
#include "math.h"
#include "base.h"
#include "config.h"

#define DHTPIN A0     // what pin we're connected to
#define DHTTYPE DHT22 // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE);

#define LIGHT_SENSOR A2
float Rsensor;

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
}

void setup()
{
    initInfo();
    setupBase();
    temp_last_time = millis();
}

void loop()
{
    static float humidity, temperature;
    static long RangeInCentimeters;

    // Check MQTT broker connection status
    // If it is disconnected, reconnect to the broker
    if (!client.connected())
    {
        reconnect();
    }

    // Get temperature & humidity and publish them
    current_time = millis();
    if (PUB_INTERVAL < (current_time - temp_last_time))
    {
        if (device_info["device_status"])
        {
            humidity = dht.readHumidity();
            temperature = dht.readTemperature();
            device_info["data"]["humidity"] = humidity;
            device_info["data"]["temperature"] = temperature;
            // Serial.print("the sensor humidity is ");
            // Serial.println(humidity,DEC);
            // Serial.print("the sensor temperature is ");
            // Serial.println(temperature,DEC);

            int sensorValue = analogRead(LIGHT_SENSOR);
            Rsensor = (float)(1023 - sensorValue) * 10 / sensorValue;
            device_info["data"]["light"] = Rsensor;
            // Serial.print("the sensor resistance is ");
            // Serial.println(Rsensor, DEC);
        }
        else
        {
            device_info["data"]["humidity"] = undefined;
            device_info["data"]["temperature"] = undefined;
            device_info["data"]["light"] = undefined;
        }

        String jsonString = JSON.stringify(device_info);
        const char *jsonCharArray = jsonString.c_str();
        client.publish(TOPIC_INFO, jsonCharArray, strlen(jsonCharArray));
        Serial.print("Publish to ");
        Serial.println(TOPIC_INFO);
        // update last time value
        temp_last_time = current_time;
    }

    client.loop();
    deviceStatus();
}

void topicSubPub()
{
    // Once connected, publish an announcement...
    String jsonString = JSON.stringify(device_info);
    const char *jsonCharArray = jsonString.c_str();
    // ... and republish
    client.publish(TOPIC_INFO, jsonCharArray, strlen(jsonCharArray));
    // ... and resubscribe
    client.subscribe(TOPIC_CONTROL);
}

void handleCallback(char *topic, JSONVar payloadJSON)
{
    // If LED Control command is incoming, change LED status
    if (!strcmp(topic, TOPIC_CONTROL) && !strcmp(payloadJSON["device_name"], DEVICE_NAME))
    {
        if ((bool)payloadJSON["device_status"])
        {
            device_info["device_status"] = false;
        }
        else
        {
            device_info["device_status"] = true;
        }
    }
}
