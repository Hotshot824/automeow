const SensorModuleBase = require('./base');
const mqtt = require('mqtt');
const config = require('../config.json');

class environmentClient extends SensorModuleBase {
    constructor(name, type, postition, status) {
        super(name, type, postition, status);

        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._mqttClient = mqtt.connect(this._host, {
            port: this._port,
            client: 'automeow-backend',
        });

        this._temperature;
        this._humidity;
        this._light;

        this._average_queue = [];
        // Average unit =  average count * publish interval = total second (360 * 10 = 3600 sec).
        this._average_counter = 180;
        // Data storage in database max day, unit is hours (7 * 24 = 168 hours).
        this._database_storage_limit = 168;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));
    }

    _handleConnect() {
        console.log('Sensor module | New environment module ' + this._device_name + ' to mqtt server connected!');
        this._mqttClient.subscribe('automeow/info');
    }

    _handleMessage(topic, msg) {
        switch (topic) {
            case 'automeow/info':
                let info = JSON.parse(msg.toString())
                if (info.device_name == this._device_name && Object.keys(info.data).length > 0) {

                    // Storage this time subscribe data.
                    this._device_status = info.device_status;
                    this._temperature = parseFloat(info.data.temperature.toFixed(2));
                    this._humidity = parseFloat(info.data.humidity.toFixed(2));
                    this._light = parseFloat(info.data.light.toFixed(2));
                    this._lastupdate_time = this._updateCurrentTime();

                    // If device is on and queue is full insert data in database, Else push data in queue.
                    if (this._device_status && this._averageQueueIsFull()) {
                        const pool = this._pool;

                        // Declared value.
                        const device_name = this._device_name;
                        const average = this._averageCauculate();
                        const humidity = average.humidity;
                        const temperature = average.temperature;
                        const lastupdate = this._lastupdate_time;

                        pool.getConnection(function (err, conn) {
                            const sql = 'INSERT INTO environment_data (device_name, humidity, temperature, lastupdate) VALUES (?, ?, ?, ?)';
                            const values = [device_name, humidity, temperature, lastupdate];
                            // Do something with the connection
                            conn.query(sql, values);
                            // Don't forget to release the connection when finished!
                            pool.releaseConnection(conn);
                        })

                        this._cleanQueue()
                    }

                    this._average_queue.push([this._temperature, this._humidity]);
                }
                break;
            default:
                console.log('Error!');
                break;
        }
    }

    _averageQueueIsFull() {
        if (this._average_queue.length == this._average_counter) {
            return true;
        } else {
            return false;
        }
    }

    _cleanQueue() {
        // let lastData = this._average_queue[this._average_queue.length - 1]
        this._average_queue = []
        // this._average_queue.push(lastData)
    }

    _averageCauculate() {
        let length = this._average_queue.length
        let sum = this._average_queue.reduce((acc, curr) => {
            let t = curr[0], h = curr[1];
            // Does not count if sensor is wrong
            if (t == 0 || t > 40 || h == 0) {
                length--;
                return acc;
            }
            acc[0] += t;
            acc[1] += h;
            return acc
        }, [0, 0]);
        return {
            'temperature': parseFloat((sum[0] / length).toFixed(2)),
            'humidity': parseFloat((sum[1] / length).toFixed(2))
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
                "temperature": this._temperature,
                "humidity": this._humidity,
                "light": this._light,
            }
        }
    }

    async GetHistoryData() {
        ((device_name, database_storage_limit) => {
            const pool = this._pool;
            // Calculate timeout.
            const time_out = new Date();
            time_out.setHours(time_out.getHours() - database_storage_limit);
            pool.getConnection(function (err, conn) {
                const sql = "DELETE FROM `environment_data` WHERE `device_name` = ? AND lastupdate < ?;";
                const values = [device_name, time_out];
                // Do something with the connection
                conn.query(sql, values);
                // Don't forget to release the connection when finished!
                pool.releaseConnection(conn);
            })
        })(this._device_name, this._database_storage_limit);

        const sql = "SELECT * FROM `environment_data` WHERE `device_name` = ? ORDER BY `lastupdate` DESC LIMIT 24;";
        const values = [this._device_name]
        const promisePool = this._pool.promise();
        const [rows, fields] = await promisePool.query(sql, values);
        return {
            "history": rows
        }
    }

    Control(control_type) {
        switch (control_type) {
            case "toggle":
                // Here to flip status
                let pub = JSON.stringify({
                    "device_name": this._device_name,
                    "device_status": !this._device_status,
                })

                if (this._device_status) {
                    this._mqttClient.publish('automeow/control', pub);
                } else {
                    this._mqttClient.publish('automeow/control', pub);
                }
                this._device_status = !this._device_status;

                return {
                    "device_name": this._device_name,
                    "device_status": this._device_status
                }

            default:
                break;
        }
    }
}

module.exports = environmentClient;