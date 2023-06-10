const pool = require('../mysql')
const config = require('../config.json');

class SensorModuleBase {
    constructor(name, type, postition, status) {
        this._device_name = name;
        this._device_postition = postition;
        this._device_type = type;
        this._device_status = status;
        this._lastupdate_time;

        this._host = config.mqtt.host;
        this._port = config.mqtt.port;
        this._pool = pool;

        this._startCheckDevice();
        this._registerDevice();
    }

    async _registerDevice() {
        const sql = "SELECT * FROM `device_info` WHERE `device_name` = ?;";
        const values = [this._device_name]
        const promisePool = this._pool.promise();
        const [rows, fields] = await promisePool.query(sql, values);
        // If device is not register in database.
        if (rows.length < 1) {
            this._pool.query("INSERT INTO `device_info`(`device_name`) VALUES (?);", values);
        }
    }

    // Check if the device is online every 30 seconds
    _startCheckDevice() {
        setInterval(() => {
            let current_time = this._updateCurrentTime();
            let time_diff_in_seconds = Math.abs(new Date(current_time) - new Date(this._lastupdate_time)) / 1000;
            if (time_diff_in_seconds >= 30 || !time_diff_in_seconds) {
                this._device_status = false;
            }
        }, 30000);
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