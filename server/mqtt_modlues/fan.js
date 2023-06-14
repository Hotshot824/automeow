const SensorModuleBase = require('./base');
const mqtt = require('mqtt');
const config = require('../config.json');

class fanClient extends SensorModuleBase {
    constructor(name, type, postition, status, data) {
        super(name, type, postition, status);

        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._mqttClient = mqtt.connect(this._host, {
            port: this._port,
            client: 'automeow-backend',
        });

        this._fan_status = data.fan_status;
        this._fan_run_time = data.fan_run_time;
        this._fan_end_time = data.fan_end_time;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));
    }

    _handleConnect() {
        console.log('Sensor module | New fan module ' + this._device_name + ' to mqtt server connected!');
        this._mqttClient.subscribe('automeow/info');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/info':
                let info = JSON.parse(msg.toString())
                if (info.device_name == this._device_name && info.data != undefined) {

                    // Storage this time subscribe data.
                    this._device_status = info.device_status;
                    if (this._device_status == false) {
                        break;
                    }

                    this._fan_status = info.data.fan_status;
                    this._fan_run_time = info.data.fan_run_time;
                    this._fan_end_time = info.data.fan_end_time;
                    this._lastupdate_time = this._updateCurrentTime();

                    if (this._fan_end_time > 0) {
                        console.log(this._fan_end_time);
                        this._fan_end_time = 0;
                    }
                }
                break;
            default:
                console.log('Error!');
                break;
        }
    }

    GetData() {
        return {
            "device_type": this._device_type,
            "device_name": this._device_name,
            "device_position": this._device_postition,
            "device_status": this._device_status,
            "lastupdate": this._lastupdate_time,
            "data": {
                "fan_status": this._fan_status,
                "fan_run_time": this._fan_run_time,
            }
        }
    }

    async GetHistoryData() {
        return {
            "history": NaN
        }
    }

    Control(control_type) {
        let pub;
        switch (control_type) {
            case "toggle":
                // Here to flip status
                this._device_status = !this._device_status;
                this._fan_status = false;
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "fan_status": this._fan_status,
                })
                break;
            case "toggle_fan":
                this._fan_status = !this._fan_status;
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "fan_status": this._fan_status,
                })
                break;
            default:
                break;
        }
        this._mqttClient.publish('automeow/control', pub, { retain: false });
        return this.GetData()
    }
}

module.exports = fanClient;