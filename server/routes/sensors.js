const router = require('koa-router')()
const DHT22Client = require('../mqtt_modlues/DHT22.js');

const mqttClient = new DHT22Client();

router.prefix('/sensors')

router.get('/dht', async (ctx, next) => {
  const data = mqttClient.GetData();
  ctx.body = data;
})

router.get('/dht/history', async (ctx, next) => {
  const data = await mqttClient.GetHistoryData();
  ctx.body = {
    history: data,
  }
})

router.post('/dht/control', async (ctx, next) => {
  const requestBody = ctx.request.body;
  switch (requestBody.topic) {
    case 'automeow/DHT22/controlDHT':
      ctx.body = {
        message: "DHT sensor toggle.",
        online: mqttClient.Toggle()
      }
      break;

    default:
      ctx.body = {
        title: 'Not have the correct topic.'
      }
      break;
  }
})

module.exports = router
