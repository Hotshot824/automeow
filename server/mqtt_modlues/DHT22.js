const SensorModuleBase = require('./base');
const mqtt = require('mqtt');
const config = require('../config.json');

class DHT22Client extends SensorModuleBase {
    constructor() {
        super();
        this._device_name;
        this._device_postition;

        this._host = config.mqtt.host;
        this._port = config.mqtt.port;

        this._mqtt_opt = {
            port: this._port,
            client: 'automeow-server-DHT',
        };

        this._mqttClient = mqtt.connect(this._host, this._mqtt_opt);
        this._temperature;
        this._humidity;
        this._online;
        this._time;

        this._averageQueue = [];
        // Average unit =  average count * publish interval = total second (360 * 10 = 3600 sec).
        this._averageCounter = 360;
        // Data storage in database max day, unit is hours (7 * 24 = 168 hours).
        this._averageStorageHours = 168;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));

        this._startCheckDevice();
    }

    _averageQueueIsFull() {
        if (this._averageQueue.length == this._averageCounter) {
            return true;
        } else {
            return false;
        }
    }

    _cleanQueue() {
        let lastData = this._averageQueue[this._averageQueue.length - 1]
        this._averageQueue = []
        this._averageQueue.push(lastData)
    }

    _averageCauculate() {
        let length = this._averageQueue.length
        let sum = this._averageQueue.reduce((acc, curr) => {
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
            'ave_temperature': (sum[0] / length).toFixed(2),
            'ave_humidity': (sum[1] / length).toFixed(2)
        }
    }

    _handleConnect() {
        console.log('[Sensor module] DHT22 module connection to mqtt server!');
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
                const [online, device_name, device_position] = msg.toString().split(',');
                this._online = online;
                this._device_name = device_name;
                this._device_postition = device_position;
                this._registerDevice(this._device_name);
                // if drivce is live and queue is full, storage data to database.
                if (this._online == 'ON' && this._averageQueueIsFull()) {
                    const average = this._averageCauculate();
                    const devicename = this._device_name;
                    const humidity = average.ave_humidity;
                    const temperature = average.ave_temperature;
                    const time = this._time;

                    this._pool.getConnection(function (err, conn) {
                        const sql = 'INSERT INTO DHT22_data (devicename, humidity, temperature, lastupdate) VALUES (?, ?, ?, ?)';
                        const values = [devicename, humidity, temperature, time];
                        // Do something with the connection
                        conn.query(sql, values);
                        // Don't forget to release the connection when finished!
                        pool.releaseConnection(conn);
                    })

                    this._cleanQueue()
                } else {
                    this._averageQueue.push([this._temperature, this._humidity])
                }

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
            "online": this._online,
            "temperature": this._temperature,
            "humidity": this._humidity,
            "time": this._time,
        }
    }

    async GetHistoryData() {
        ((divicename, storageHours) => {
            const dateOut = new Date();
            const pool = this._pool;
            dateOut.setHours(dateOut.getHours() - storageHours);
            pool.getConnection(function (err, conn) {

                const sql = `DELETE FROM DHT22_data WHERE devicename = ? AND lastupdate < ?`;
                const values = [divicename, dateOut];
                // Do something with the connection
                conn.query(sql, values);
                // Don't forget to release the connection when finished!
                pool.releaseConnection(conn);
            })
        })(this._device_name, this._averageStorageHours);

        const sql = "SELECT * FROM `DHT22_data` WHERE `devicename` = ? ORDER BY `lastupdate` DESC LIMIT 24";
        const values = [this._device_name]
        const promisePool = this._pool.promise();
        const [rows, fields] = await promisePool.query(sql, values);
        return rows;
    }

    Toggle() {
        if (this._online == 'ON') {
            this._mqttClient.publish('automeow/DHT22/control', "0");
            this._online = 'OFF';
        } else {
            this._mqttClient.publish('automeow/DHT22/control', "1");
            this._online = 'ON';
        }
        return this._online
    }
}

module.exports = DHT22Client;