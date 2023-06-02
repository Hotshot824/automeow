const mqtt = require('mqtt');
const config = require('./config.json');

class DHT22Client {
    constructor() {
        this._host = config.mqtt.host;
        this._port = config.mqtt.port;

        this._mqtt_opt = {
            port: this._port,
            client: 'automeow-server-DHT',
        };

        this._mqttClient = mqtt.connect(this._host, this._mqtt_opt);
        this._temperature = "";
        this._humidity = "";
        this._online = "";
        this._time = "";

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));

        this._startCheckDevice();
    }

    _handleConnect() {
        console.log('DHT22 module connection to mqtt server!');
        this._mqttClient.subscribe('automeow/DHT22/temperature');
        this._mqttClient.subscribe('automeow/DHT22/humidity');
        this._mqttClient.subscribe('automeow/DHT22/info');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/DHT22/temperature':
                this._temperature = parseFloat(msg.toString());
                this._time = this._updateCurrentTime();
                break;
            case 'automeow/DHT22/humidity':
                this._humidity = parseFloat(msg.toString());
                this._time = this._updateCurrentTime();
                break;
            case 'automeow/DHT22/info':
                this._online = msg.toString();
                break;
            default:
                console.log('Error!');
                break;
        }
    }

    _updateCurrentTime() {
        const now = new Date();
        const year = now.getFullYear();
        const month = (now.getMonth() + 1).toString().padStart(2, '0');
        const day = now.getDate().toString().padStart(2, '0');
        const hours = now.getHours().toString().padStart(2, '0');
        const minutes = now.getMinutes().toString().padStart(2, '0');
        const seconds = now.getSeconds().toString().padStart(2, '0');
        return `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;
    }

    _startCheckDevice() {
        setInterval(() => {
            let currentTime = this._updateCurrentTime();
            let timeDiffInSeconds = Math.abs(new Date(currentTime) - new Date(this._time)) / 1000;
            if (timeDiffInSeconds >= 30) {
                this._online = 'OFF';
            }
        }, 30000);
    }

    GetData() {
        return {
            "online": this._online,
            "temperature": this._temperature,
            "humidity": this._humidity,
            "time": this._time,
        }
    }

    Toggle() {
        if (this._online == 'ON') {
            this._mqttClient.publish('automeow/DHT22/controlDHT', "0");
            this._online = 'OFF';
        } else {
            this._mqttClient.publish('automeow/DHT22/controlDHT', "1");
            this._online = 'ON';
        }
        return this._online
    }
}

module.exports = DHT22Client;