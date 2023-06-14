const pool = require('../mysql')
const mqtt = require('mqtt');
const config = require('../config.json');
const environmentClient = require('./environment.js');
const feederClient = require('./feeder.js');
const fountainClient = require('./fountain.js');
const fanClient = require('./fan.js')

class SensorModuleBase {
    constructor() {
        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._pool = pool;

        this._mqttClient = mqtt.connect(this._host, {
            port: this._port,
            client: 'automeow-backend',
        });

        this._modules = {};
        this._module_type = {
            "ENV": environmentClient,
            "feeder": feederClient,
            "fountain": fountainClient,
            "fan": fanClient,
        };

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));
    }

    _handleConnect() {
        console.log('Sensor module | Client module to mqtt server connected!');
        this._mqttClient.subscribe('automeow/info');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/info':
                let info = JSON.parse(msg.toString());
                if (!(info.device_name in this._modules)) {
                    // create a new nodes in modules list.
                    if (!(info.device_type in this._module_type)) { break; }
                    const new_node = new this._module_type[info.device_type](
                        info.device_name, info.device_type, info.device_position, info.device_status, info.data
                    );
                    this._modules[info.device_name] = new_node;
                }
                break;
            default:
                console.log('Error!');
                break;
        }
    }

    GetModuleList() {
        return Object.keys(this._modules);
    }

    GetModuleData(name) {
        if (!(name in this._modules)) {
            return false;
        }
        const Module = this._modules[name];
        return Module.GetData();
    }

    async GetModuleHistoryData(name) {
        if (!(name in this._modules)) {
            return false;
        }
        const Module = this._modules[name];
        return await Module.GetHistoryData();
    }

    ControlModule(name, control_type) {
        if (!(name in this._modules)) {
            return false;
        }
        const Module = this._modules[name];
        return Module.Control(control_type);
    }
}

module.exports = SensorModuleBase;