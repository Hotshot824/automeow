import sensor from '../../api/sensor'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    temperature: null,
    humidity: null,
    online: null,
    currentTime: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getTemperature_Humidity({ commit }) {
        let data = await sensor.getData();
        commit('updateTemperature', data.temperature);
        commit('updateHumidity', data.humidity);
        commit('updateCurrentTime', data.currentTime);
        commit('updateOnline', data.online);
    },
    async controlLED() {
        await sensor.controlLED();
    }
}

// mutations
const mutations = {
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
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
