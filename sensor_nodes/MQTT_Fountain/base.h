#ifndef BASE_H
#define BASE_H

#include <LWiFi.h>
#include <PubSubClient.h>
#include <Arduino_JSON.h>

void setupBase();
void deviceStatus();
void led_on();
void led_off();
void topicSubPub();
void reconnect();
void callback(char *topic, byte *payload, unsigned int length);
void handleCallback(char *topic, JSONVar payloadJSON);
void printWifiStatus();

// WiFi AP ssid / password variables
extern char ssid[];
extern char pass[];
extern char server[];
extern int port;

// Clients for MQTT
extern WiFiClient wifiClient;
extern PubSubClient client;
extern char client_id[];
extern JSONVar device_info;

// LED Control info
#define LED_PIN LED_BUILTIN

#endif // BASE_H
