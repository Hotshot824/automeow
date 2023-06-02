const mqtt = require('mqtt');
const pool = require('../mysql')
const config = require('../config.json');

class DHT22Client {
    constructor() {
        this._divicename = 'DHT22'

        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._pool = pool

        this._mqtt_opt = {
            port: this._port,
            client: 'automeow-server-DHT',
        };

        this._mqttClient = mqtt.connect(this._host, this._mqtt_opt);
        this._temperature;
        this._humidity;
        this._online;
        this._time;

        this.averageQueue = [];
        // Average unit =  average count * publish interval = total second (360 * 10 = 3600 sec).
        this.averageCounter = 6;

        this._mqttClient.on('connect', this._handleConnect.bind(this));
        this._mqttClient.on('message', this._handleMessage.bind(this));

        this._startCheckDevice();
    }

    _averageQueueIsFull() {
        if (this.averageQueue.length == this.averageCounter-1) {
            return true;
        } else {
            return false;
        }
    }

    _cleanQueue() {
        this.averageQueue = []
    }

    _averageCauculate() {
        let length = this.averageQueue.length
        let sum = this.averageQueue.reduce((acc, curr) => {
            let t = curr[0], h = curr[1];
            // Does not count if sensor is wrong
            if (t == 0 && t > 40 && h == 0) {
                length--;
                return acc;
            }
            acc[0] += t;
            acc[1] += h;
            return acc
        }, [0, 0]);
        console.log(sum, this._time);
        return {
            'ave_temperature': (sum[0]/length).toFixed(2),
            'ave_humidity': (sum[1]/length).toFixed(2)
        }
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
                if (this._online == 'ON' && this._averageQueueIsFull()) {
                    const average = this._averageCauculate();
                    const devicename = this._divicename;
                    const humidity = average.ave_humidity;
                    const temperature = average.ave_temperature;
                    const time = this._time;

                    pool.getConnection(function (err, conn) {
                        const sql = 'INSERT INTO DHT22_data (devicename, humidity, temperature, lastupdate) VALUES (?, ?, ?, ?)';
                        const values = [devicename, humidity, temperature, time];
                        // Do something with the connection
                        conn.query(sql, values);
                        // Don't forget to release the connection when finished!
                        pool.releaseConnection(conn);
                    })

                    this._cleanQueue()
                } else {
                    this.averageQueue.push([this._temperature, this._humidity])
                }

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
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
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