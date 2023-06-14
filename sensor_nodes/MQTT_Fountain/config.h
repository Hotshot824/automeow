#ifndef CONFIG_H
#define CONFIG_H

#define DEVICE_TYPE "fountain"
#define DEVICE_NAME "fountain-01"
#define DEVICE_POSITION "bedroom"

// MQTT connect and handle

// WiFi AP ssid / password here
#define _SSID_ "SSID"    //  your network SSID (name)
#define _PASSWORD_ "PASSWORD" // your network password (use for WPA, or use as key for WEP)

// MQTT Broker info
// IPAddress server(192, 168, 1, 182);
#define _SERVER_ "benson.hopto.org"
#define _PORT_ 20083

// MQTT topics
#define TOPIC_INFO "automeow/info"
#define TOPIC_CONTROL "automeow/control"

#endif // CONFIG_H
