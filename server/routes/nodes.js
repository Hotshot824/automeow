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

// router.post('/control', async (ctx, next) => {
//   const requestBody = ctx.request.body;
//   switch (requestBody.topic) {
//     case 'automeow/DHT22/control':
//       ctx.body = {
//         message: "DHT sensor toggle.",
//         online: DHT22.Toggle()
//       }
//       break;

//     case 'automeow/feeder/control':
//       ctx.body = {
//         message: "feeder sensor toggle.",
//         online: feeder.Toggle()
//       }
//       break;

//     case 'automeow/feeder/control/tofeed':
//       ctx.body = {
//         message: "feeder sensor toggle.",
//         online: feeder.ToFeed()
//       }
//       break;

//     default:
//       ctx.body = {
//         title: 'Not have the correct topic.'
//       }
//       break;
//   }
// })


module.exports = router
