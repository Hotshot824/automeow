const pool = require('../mysql')
const config = require('../config.json');

class SensorModuleBase {
    constructor() {
        this._device_name;
        this._device_postition;
        
        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._pool = pool;
    }

    async _registerDevice(device_name) {
        const sql = "SELECT * FROM `device_info` WHERE `devicename` = ?;";
        const values = [device_name]
        const promisePool = this._pool.promise();
        const [rows, fields] = await promisePool.query(sql, values);
        if (rows.length < 1) {
            this._pool.query("INSERT INTO `device_info`(`devicename`) VALUES (?);", values)
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
}

module.exports = SensorModuleBase;