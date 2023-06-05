const SensorModuleBase = require('./base');
const mqtt = require('mqtt');
const config = require('../config.json');

class feederClient extends SensorModuleBase {
    constructor() {
        super();
        this._host = config.mqtt.host;
        this._port = config.mqtt.port;

        this._mqtt_opt = {
            port: this._port,
            client: 'automeow-server-Feeder',
        };

        this._mqttClient = mqtt.connect(this._host, this._mqtt_opt);
        this._distance
        this._online;
        this._time;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));

        this._startCheckDevice();
    }

    _handleConnect() {
        console.log('[Sensor module] Feeder module connection to mqtt server!');
        this._mqttClient.subscribe('automeow/feeder/info');
        this._mqttClient.subscribe('automeow/feeder/distance');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/feeder/info':
                const [online, device_name, device_position] = msg.toString().split(',');
                this._device_name = device_name;
                this._device_postition = device_position;
                this._online = online;
                this._time = this._updateCurrentTime();
                this._registerDevice(this._device_name);
                break;
            case 'automeow/feeder/distance':
                this._distance = msg.toString();
                break;
            default:
                console.log('Error!');
                break;
        }
    }

    // Check if the device is online every 30 seconds
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
            "device_name": this._device_name,
            "device_position": this._device_postition,
            "distance": this._distance,
            "online": this._online,
            "time": this._time,
        }
    }

    Toggle() {
        if (this._online == 'ON') {
            this._mqttClient.publish('automeow/feeder/control', "0");
            this._online = 'OFF';
        } else {
            this._mqttClient.publish('automeow/feeder/control', "1");
            this._online = 'ON';
        }
        return this._online
    }

    ToFeed() {
        this._mqttClient.publish('automeow/feeder/control', "2");
    }

}

module.exports = feederClient;