const router = require('koa-router')()
const mqtt_client = require('../mqtt_modlues/mqtt_client.js');

const mqttClient = new mqtt_client();

router.prefix('/nodes')

router.get('/', async (ctx, next) => {
    const name = ctx.query.device_name;
    const data = mqttClient.GetModuleData(name);
    if (data) {
        ctx.body = data;
    }
})

router.get('/list', async (ctx, next) => {
    ctx.body = {
        list: mqttClient.GetModuleList()
    }
})

router.get('/history', async (ctx, next) => {
    const name = ctx.query.device_name;
    const data = await mqttClient.GetModuleHistoryData(name);
    if (data) {
        ctx.body = data
    }
})

router.get('/contorl', async (ctx, next) => {
    const name = ctx.query.device_name;
    const type = ctx.query.control_type;
    const data = mqttClient.ControlModule(name, type);
    if (data) {
        ctx.body = data;
    }
})

module.exports = router
