const router = require('koa-router')()
const mqtt = require('mqtt');

var mqtt_opt = {
  port: 20083,
  client: 'automeow-server',
}

const mqttClient = mqtt.connect('mqtt://benson.hopto.org', mqtt_opt);

mqttClient.on('connect', () => {
  console.log('Connect to mqtt server!');
  mqttClient.subscribe('automeow/DHT22/temperature');
  mqttClient.subscribe('automeow/DHT22/humidity');
  mqttClient.subscribe('automeow/DHT22/info');
})

var temperature = "", humidity = "", online = "", time = "";

// Subscribe MQTT topic and processed.
mqttClient.on('message', (topic, msg) => {
  switch (topic) {
    case 'automeow/DHT22/temperature':
      temperature = parseFloat(msg.toString());
      time = updateCurrentTime();
      // console.log("temperature: " + t);
      break;
    case 'automeow/DHT22/humidity':
      humidity = parseFloat(msg.toString());
      time = updateCurrentTime();
      // console.log("humidity: " + h);
      break
    case 'automeow/DHT22/info':
      online = msg.toString();
      // console.log("online: " + o);
      break
    default:
      console.log('Error!')
      break;
  }
})

function updateCurrentTime() {
  const now = new Date();
  const year = now.getFullYear();
  const month = (now.getMonth() + 1).toString().padStart(2, '0');
  const day = now.getDate().toString().padStart(2, '0');
  const hours = now.getHours().toString().padStart(2, '0');
  const minutes = now.getMinutes().toString().padStart(2, '0');
  const seconds = now.getSeconds().toString().padStart(2, '0');
  return `${year}/${month}/${day}/${hours}:${minutes}:${seconds}`;
}

// Check if the mqtt device is online every 30 seconds
setInterval(function () {
  let currentTime = updateCurrentTime();
  let timeDiffInSeconds = Math.abs(new Date(currentTime) - new Date(time)) / 1000;
  console.log(timeDiffInSeconds);
  if (timeDiffInSeconds >= 30) {
    online = 'OFF';
  }
}, 30000);

router.prefix('/sensors')

router.get('/dht', async (ctx, next) => {
  ctx.body = {
    online: online,
    temperature: temperature,
    humidity: humidity,
    time: time,
  }
})

router.post('/dht/control', async (ctx, next) => {
  const requestBody = ctx.request.body;
  switch (requestBody.topic) {
    case 'automeow/DHT22/controlDHT':
      if (online == 'ON') {
        mqttClient.publish('automeow/DHT22/controlDHT', "0");
        online = 'OFF';
      } else {
        mqttClient.publish('automeow/DHT22/controlDHT', "1");
        online = 'ON';
      }

      ctx.body = {
        message: "DHT sensor toggle.",
        online: online
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
