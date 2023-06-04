const SensorModuleBase = require('./base');
const mqtt = require('mqtt');
const config = require('../config.json');

class FeederClient extends SensorModuleBase {
    constructor() {
        super();
        this._host = config.mqtt.host;
        this._port = config.mqtt.port;

        this._mqtt_opt = {
            port: this._port,
            client: 'automeow-server-Feeder',
        };

        this._mqttClient = mqtt.connect(this._host, this._mqtt_opt);
        this._online;
        this._time;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));

        this._startCheckDevice();
    }

    _handleConnect() {
        console.log('[Sensor module] Feeder module connection to mqtt server!');
        this._mqttClient.subscribe('automeow/Feeder/info');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/Feeder/info':
                const [online, device_name, device_position] = msg.toString().split(',');
                this._device_name = device_name;
                this._device_postition = device_position;
                this._online = online;
                this._time = this._updateCurrentTime();
                this._registerDevice(this._device_name);
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

}

module.exports = FeederClient;