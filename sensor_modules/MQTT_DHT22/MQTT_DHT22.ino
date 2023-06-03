#include <LWiFi.h>
#include <PubSubClient.h>
#include "DHT.h"

#define DHTPIN A0     // what pin we're connected to
#define DHTTYPE DHT22 // DHT 22  (AM2302)
DHT dht(DHTPIN, DHTTYPE);

// WiFi AP ssid / password here
char ssid[] = "SSID";     //  your network SSID (name)
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
#define DEVICE_NAME = "DHT22-bedroom"
#define DEVICE_POSITION = "bedroom"
char client_id[] = DEVICE_NAME;

void buildINFO(char *info, char *status)
{
  strcpy(info, status);
  strcat(info, ",");
  strcat(info, DEVICE_NAME);
  strcat(info, ",");
  strcat(info, DEVICE_POSITION);
  strcat(info, ",");
}

// MQTT topics
#define TOPIC_INFO "automeow/DHT22/info"
#define TOPIC_HUMIDITY "automeow/DHT22/humidity"
#define TOPIC_TEMPERATURE "automeow/DHT22/temperature"
#define TOPIC_DHT_CONTROL "automeow/DHT22/controlDHT"

// Clients for MQTT
WiFiClient wifiClient;
PubSubClient client(wifiClient);

// Timer info
#define DHT_read_interval 10000
unsigned long temp_last_time;

// LED Control info
#define LED_PIN LED_BUILTIN
typedef enum
{
  DHT_OFF = 0,
  DHT_ON,
} LEDStatus;
LEDStatus dht_status = DHT_ON;

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
  if (!strcmp(topic, TOPIC_DHT_CONTROL))
  {
    switch (payload[0])
    {
    case '0':
      dht_status = DHT_OFF;
      break;
    case '1':
      dht_status = DHT_ON;
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
      client.subscribe(TOPIC_DHT_CONTROL);
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
  // setup Serial output at 9600
  Serial.begin(9600);

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
  float h, t;
  long RangeInCentimeters;

  // Check MQTT broker connection status
  // If it is disconnected, reconnect to the broker
  if (!client.connected())
  {
    reconnect();
  }

  // Get temperature & humidity and publish them
  current_time = millis();
  if (DHT_read_interval < (current_time - temp_last_time))
  {
    if (dht_status == DHT_OFF)
    {
      client.publish(TOPIC_INFO, "OFF");
    }
    else
    {
      digitalWrite(LED_BUILTIN, HIGH);
      delay(500);
      digitalWrite(LED_BUILTIN, LOW);
      h = dht.readHumidity();
      t = dht.readTemperature();
      char buffer[50];
      sprintf(buffer, "%f", h);
      client.publish(TOPIC_HUMIDITY, buffer);
      Serial.print("Humidity: ");
      Serial.println(buffer);
      sprintf(buffer, "%f", t);
      client.publish(TOPIC_TEMPERATURE, buffer);
      Serial.print("Temperature: ");
      Serial.println(buffer);
      char info[50];
      buildInfo(info, "ON");
      client.publish(TOPIC_INFO, info);
    }
    // update last time value
    temp_last_time = current_time;
  }

  // Control LED according to dht_status
  switch (dht_status)
  {
  case DHT_OFF:
    led_off();
    break;
  case DHT_ON:
    led_on();
    break;
  default:
  {
  }
  }

  client.loop();
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