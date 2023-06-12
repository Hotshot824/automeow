#include "base.h"
#include "config.h"

// Define the global variables
WiFiClient wifiClient;
PubSubClient client(wifiClient);

char client_id[] = DEVICE_NAME;

void setupBase()
{
  // setup Serial output at 9600
  Serial.begin(9600);

  // Set MQTT broker
  client.setServer(_SERVER_, _PORT_);
  client.setCallback(callback);

  // setup Wifi connection
  while (WL_CONNECTED != WiFi.status())
  {
    Serial.print("WiFi.begin(");
    Serial.print(_SSID_);
    Serial.print(",");
    Serial.print(_PASSWORD_);
    Serial.println(")...");
    WiFi.begin(_SSID_, _PASSWORD_);
  }
  Serial.println("WiFi connected !!");
  printWifiStatus();
}

void led_on()
{
  digitalWrite(LED_PIN, HIGH);
}

void led_off()
{
  digitalWrite(LED_PIN, LOW);
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
      topicSubPub();
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

  char payloadChar[length + 1];
  for (int i = 0; i < length; i++)
  {
    payloadChar[i] = (char)payload[i];
  }
  payloadChar[length] = '\0';
  JSONVar payloadJSON = JSON.parse(payloadChar);

  handleCallback(topic, payloadJSON);
}

void deviceStatus()
{
  // Control LED according to dht_status
  switch ((bool)device_info["device_status"])
  {
  case true:
    led_on();
    break;
  case false:
    led_off();
    break;
  default:
  {
  }
  }
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
