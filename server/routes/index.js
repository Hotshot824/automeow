const router = require('koa-router')()
const mqtt = require('mqtt');

var mqtt_opt = {
  port: 20083,
  client: 'watch-cat-server',
}

const mqttClient = mqtt.connect('mqtt://benson.hopto.org', mqtt_opt);

mqttClient.on('connect', () => {
  console.log('Connect to mqtt server!');
  mqttClient.subscribe('Group10_boardA/sensor/temperature');
  mqttClient.subscribe('Group10_boardA/sensor/humidity');
})

var t = "", h = "";

mqttClient.on('message', (topic, msg) => {
  switch (topic) {
    case 'Group10_boardA/sensor/temperature':
      t = parseFloat(msg.toString());
      // console.log("temperature: " + t);
      break;
    case 'Group10_boardA/sensor/humidity':
      h = parseFloat(msg.toString());
      // console.log("humidity: " + h);
      break
    default:
      console.log('Error!')
      break;
  }
})

router.get('/', async (ctx, next) => {
  await ctx.render('index', {
    title: 'Hello Koa 2!'
  })
})

router.get('/string', async (ctx, next) => {
  ctx.body = 'koa2 string'
})

router.get('/json', async (ctx, next) => {
  ctx.body = {
    title: 'koa2 json'
  }
})

router.get('/dht', async (ctx, next) => {
  ctx.body = {
    temperature: t,
    humidity: h
  }
})

let flag = true;
router.post('/control', async (ctx, next) => {
  const requestBody = ctx.request.body;
  switch (requestBody.topic) {
    case 'Group10_boardA/sensor/controlLED':
      if (flag) {
        mqttClient.publish('Group10_boardA/sensor/controlLED', "0");
        flag = false;
      } else {
        mqttClient.publish('Group10_boardA/sensor/controlLED', "1");
        flag = true;
      }

      ctx.body = {
        title: "Hello"
      }
      break;
  
    default:
      ctx.body = {
        title: 'test'
      }
      break;
  }
})

module.exports = router
