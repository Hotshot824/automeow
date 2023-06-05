const router = require('koa-router')()
const DHT22Client = require('../mqtt_modlues/DHT22.js');
const feederClient = require('../mqtt_modlues/feeder.js');

const DHT22 = new DHT22Client();
const feeder = new feederClient();

router.prefix('/sensors')

// DHT22 router
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

// Feeder router
router.get('/feeder', async (ctx, next) => {
  const data = feeder.GetData();
  ctx.body = data;
})

router.post('/control', async (ctx, next) => {
  const requestBody = ctx.request.body;
  switch (requestBody.topic) {
    case 'automeow/DHT22/control':
      ctx.body = {
        message: "DHT sensor toggle.",
        online: DHT22.Toggle()
      }
      break;

    case 'automeow/feeder/control':
      ctx.body = {
        message: "feeder sensor toggle.",
        online: feeder.Toggle()
      }
      break;

    case 'automeow/feeder/control/tofeed':
      ctx.body = {
        message: "feeder sensor toggle.",
        online: feeder.ToFeed()
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
