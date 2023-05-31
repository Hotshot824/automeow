import { createApp } from 'vue'
import { createStore } from 'vuex'
import './style.css'
import App from './App.vue'

var temperature = "Unknown", humidity = "Unknown", currentTime = "Unknown", online = "Unknown"
async function fetchTemperature_Humidity() {
    await fetch('/api/dht')
        .then(response => response.json())
        .then(data => {
            console.log(data)
            temperature = parseFloat(data.temperature).toFixed(2);
            humidity = parseFloat(data.humidity).toFixed(2);
            if (!isNaN(parseFloat(data.temperature)) && !isNaN(parseFloat(data.humidity))) {
                currentTime = updateCurrentTime();
                online = "ON"
            }
        })
        .catch(error => {
            online = "OFF"
            console.log(error);
        })
}

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

fetchTemperature_Humidity();
setInterval(fetchTemperature_Humidity, 10000);

const module_dht = {
    state: () => ({
        temperature: null,
        humidity: null,
        online: null,
        currentTime: null,
    }),
    mutations: {
        updateTemperature(state, temperature) {
            state.temperature = temperature
        },
        updateHumidity(state, humidity) {
            state.humidity = humidity
        },
        updateOnline(state, online) {
            state.online = online
        },
        updateCurrentTime(state, currentTime) {
            state.currentTime = currentTime
        },
    },
    actions: {
        getTemperature_Humidity(context) {
            context.commit('updateTemperature', temperature);
            context.commit('updateHumidity', humidity);
            context.commit('updateCurrentTime', currentTime);
            context.commit('updateOnline', online);
        },
    },
}

const store = createStore({
    modules: {
        module_dht: module_dht,
    }
})

const app = createApp(App)

app.use(store)

app.mount('#app')

export default store
