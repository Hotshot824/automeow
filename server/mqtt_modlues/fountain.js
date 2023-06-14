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

        this._fountain_status = data.fountain_status;
        this._fountain_run_time = data.fountain_run_time;
        this._fountain_end_time = data.fountain_end_time;
        this._mode = data.mode;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));
    }

    _handleConnect() {
        console.log('Sensor module | New fountain module ' + this._device_name + ' to mqtt server connected!');
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
                    this._fountain_status = info.data.fountain_status;
                    this._fountain_run_time = info.data.fountain_run_time;
                    this._fountain_end_time = info.data.fountain_end_time;
                    this._lastupdate_time = this._updateCurrentTime();

                    if (this._fountain_end_time > 0) {
                        console.log(this._fountain_end_time);
                        this._fountain_end_time = 0;
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
                "mode": this._mode,
                "fountain_status": this._fountain_status,
                "fountain_run_time": this._fountain_run_time,
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
                    "fountain_status": false,
                    "device_mode": (this._mode == "manual") ? true : false,
                })
                break;

            case "change_mode":
                // Flip current device mode. true : manual, false : auto ...
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "fountain_status": false,
                    "device_mode": !(this._mode == "manual")
                })
                // ... Here to filp class status
                this._mode = (this._mode == 'manual') ? 'auto' : 'manual';
                break;

            case "toggle_fountain":
                // Toggle fountain status to feed.
                this._fountain_status = !this._fountain_status,
                pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": this._device_status,
                    "fountain_status": this._fountain_status,
                    "device_mode": true,
                })
                break;

            default:
                break;
        }
        this._mqttClient.publish('automeow/control', pub, { retain: false });
        return this.GetData();
    }
}

module.exports = feederClient;