### Auto-Meow

frontend template from : https://startbootstrap.com/template/sb-admin

### Listen at

-   80 nginx
-   1883 mosquitto
-   3306 mysql
-   9080 phpmyadmin
-   5000 & 3000 is for backend & frontend development mode.

### Archives

-   client: vue3 + vuex frontend.
-   server: koa2 backend.
-   mosquitto: MQTT server config.
-   nginx: Reverse proxy server config.
-   database: mysql database init file and config.
-   sensor_modules: physical sensor.

### Nodes

-   Nodes:
    -   Linkit 7697
    -   SubPubClient 2.6 : Must be changed in the library `PubSubClient.h` => `#define MQTT_MAX_PACKET_SIZE 256`

### How to run?

-   Start docker: `docker compose up -d`
-   Develoment mode backend and frontend: `npm run dev`