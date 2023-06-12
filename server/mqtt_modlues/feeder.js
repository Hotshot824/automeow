const SensorModuleBase = require('./base');
const mqtt = require('mqtt');
const config = require('../config.json');

class feederClient extends SensorModuleBase {
    constructor(name, type, postition, status, data) {
        super(name, type, postition, status);

        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._mqttClient = mqtt.connect(this._host, {
            port: this._port,
            client: 'automeow-server-Feeder',
        });

        this._init_distance = data.init_distance;
        this._distance = data.distance;
        this._mode = data.mode;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));
    }

    _handleConnect() {
        console.log('Sensor module | New feeder module ' + this._device_name + ' to mqtt server connected!');
        this._mqttClient.subscribe('automeow/info');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/info':
                let info = JSON.parse(msg.toString());
                if (info.device_name == this._device_name && info.data != undefined) {

                    // Storage this time subscribe data.
                    this._device_status = info.device_status;
                    if (this._device_status == false) {
                        break;
                    }

                    this._mode = info.data.mode;
                    this._init_distance = info.data.init_distance;
                    this._distance = info.data.distance;
                    this._lastupdate_time = this._updateCurrentTime();
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
                "mode": this._mode,
                "init_distance": this._init_distance,
                "distance": this._distance,
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
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "feeder_status": false,
                    "device_mode": (this._mode == "manual") ? true : false,
                })

                this._mqttClient.publish('automeow/control', pub, { retain: false });

                return {
                    "device_status": this._device_status
                }

            case "tofeed":
                // Change feeder status to feed.
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "feeder_status": true,
                    "device_mode": (this._mode == "manual") ? true : false,
                })

                this._mqttClient.publish('automeow/control', pub, { retain: false });

                return {
                    "device_status": this._device_status,
                    "control_result": "Success to feeder",
                }

            case "change_mode":
                // Flip current device mode. true : manual, false : auto.
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "feeder_status": false,
                    "device_mode": !(this._mode == "manual")
                })

                this._mqttClient.publish('automeow/control', pub, { retain: false });

                return {
                    "device_status": this._device_status,
                    "control_result": "Success to feeder",
                }

            default:
                break;
        }
    }
}

module.exports = feederClient;