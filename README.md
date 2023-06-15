### Auto-Meow

This is an IOT care system for my cat, using linkit 7697 MCU to develop a remote node, which has been implemented.

![](https://github.com/Hotshot824/automeow/blob/main/docs/image04.jpg?raw=true)

1. feeding device 
2. water fountain device 
3. ambient temperature and humidity sensing
4. smart fan

*Web pages can be used to control IoT nodes, and web pages support responsive design.*

![](https://github.com/Hotshot824/automeow/blob/main/docs/image01.jpg?raw=true)

*Prototype of IoT device:*

- *fountain-01*

![](https://github.com/Hotshot824/automeow/blob/main/docs/image02.jpg?raw=true)

- *feeder-01*

![](https://github.com/Hotshot824/automeow/blob/main/docs/image03.jpg?raw=true)

### How to run?

First install docker && docker compose, then install the nodejs dependency package `npm install`.

-   Start docker: `docker compose up -d`
-   Develoment mode backend and frontend: `npm run dev`

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

### Future

1. better design and integration of front and back-end api.
2. the frontend can have more visualization diagrams.
3. the backend is not fully integrated with the database.
4. front and backend fully into docker .

### Reference

frontend template from : https://startbootstrap.com/template/sb-admin