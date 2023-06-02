const router = require('koa-router')()
const mqtt = require('mqtt');

var mqtt_opt = {
  port: 20083,
  client: 'watch-cat-server',
}

const mqttClient = mqtt.connect('mqtt://benson.hopto.org', mqtt_opt);

mqttClient.on('connect', () => {
  console.log('Connect to mqtt server!');
  mqttClient.subscribe('Group10_boardA/DHT22/temperature');
  mqttClient.subscribe('Group10_boardA/DHT22/humidity');
  mqttClient.subscribe('Group10_boardA/DHT22/info');
})

var t = "", h = "", o = "OFF";

mqttClient.on('message', (topic, msg) => {
  switch (topic) {
    case 'Group10_boardA/DHT22/temperature':
      t = parseFloat(msg.toString());
      // console.log("temperature: " + t);
      break;
    case 'Group10_boardA/DHT22/humidity':
      h = parseFloat(msg.toString());
      // console.log("humidity: " + h);
      break
    case 'Group10_boardA/DHT22/info':
      o = msg.toString();
      // console.log("online: " + o);
      break
    default:
      console.log('Error!')
      break;
  }
})

router.prefix('/sensors')

router.get('/dht', async (ctx, next) => {
    ctx.body = {
      online: o,
      temperature: t,
      humidity: h
    }
  })
  
let flag = true;
router.post('/dht/control', async (ctx, next) => {
const requestBody = ctx.request.body;
switch (requestBody.topic) {
    case 'Group10_boardA/DHT22/controlDHT':
    if (flag) {
        mqttClient.publish('Group10_boardA/DHT22/controlDHT', "0");
        flag = false;
    } else {
        mqttClient.publish('Group10_boardA/DHT22/controlDHT', "1");
        flag = true;
    }

    ctx.body = {
        message: "DHT sensor toggle."
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
