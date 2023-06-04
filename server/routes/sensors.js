const router = require('koa-router')()
const DHT22Client = require('../mqtt_modlues/DHT22.js');
const FeederClient = require('../mqtt_modlues/Feeder.js');

const DHT22 = new DHT22Client();
const Feeder = new FeederClient();

router.prefix('/sensors')

router.get('/dht', async (ctx, next) => {
  const data = DHT22.GetData();
  ctx.body = data;
})

router.get('/dht/history', async (ctx, next) => {
  const data = await DHT22.GetHistoryData();
  ctx.body = {
    history: data,
  }
})

router.post('/dht/control', async (ctx, next) => {
  const requestBody = ctx.request.body;
  switch (requestBody.topic) {
    case 'automeow/DHT22/control':
      ctx.body = {
        message: "DHT sensor toggle.",
        online: DHT22.Toggle()
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
