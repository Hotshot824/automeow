#include "base.h"
#include "config.h"

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
    device_info["data"]["fan_status"] = false;
    device_info["data"]["switch"] = false;
}

int val = 0;
#define TEST_PIN 15
#define CONTROL_PIN 10
#define BUTTON_PIN 6

void setup()
{
    initInfo();
    setupBase();

    pinMode(TEST_PIN, OUTPUT);
    digitalWrite(TEST_PIN, HIGH);

    pinMode(CONTROL_PIN, OUTPUT);
    attachInterrupt(BUTTON_PIN, pin_change, RISING);

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

    // Publish them ...
    current_time = millis();
    if (PUB_INTERVAL < (current_time - temp_last_time))
    {
        String jsonString = JSON.stringify(device_info);
        const char *jsonCharArray = jsonString.c_str();
        client.publish(TOPIC_INFO, jsonCharArray, false);
        Serial.print("Publish to ");
        Serial.println(TOPIC_INFO);
        // Update last time value
        temp_last_time = current_time;
    }

    if (device_info["device_status"])
    {
        // Set a flag to pulish first time info.
        static int switchflag = 0;
        if (device_info["data"]["fan_status"])
        {
            digitalWrite(CONTROL_PIN, HIGH);
            if (switchflag)
            {
                device_info["data"]["switch"] = true;
                String jsonString = JSON.stringify(device_info);
                const char *jsonCharArray = jsonString.c_str();
                client.publish(TOPIC_SWTICH, jsonCharArray, false);
                switchflag = !switchflag;
            }
        }
        else
        {
            digitalWrite(CONTROL_PIN, LOW);
            if (!switchflag)
            {
                device_info["data"]["switch"] = false;
                String jsonString = JSON.stringify(device_info);
                const char *jsonCharArray = jsonString.c_str();
                client.publish(TOPIC_SWTICH, jsonCharArray, false);
                switchflag = !switchflag;
            }
        }
    }

    client.loop();
    deviceStatus();
}

void topicSubPub()
{
    // Once connected, publish an announcement...
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
            device_info["device_status"] = true;
        }
        else
        {
            device_info["device_status"] = false;
        }

        if ((bool)payloadJSON["fan_status"])
        {
            device_info["data"]["fan_status"] = true;
        }
        else
        {
            device_info["data"]["fan_status"] = false;
        }
    }
}

void pin_change(void)
{
    device_info["data"]["fan_status"] = !device_info["data"]["fan_status"];
}
