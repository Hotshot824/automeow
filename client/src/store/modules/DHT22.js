import sensor from '../../api/sensor'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    temperature: null,
    humidity: null,
    online: null,
    time: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        let data = await sensor.getData();
        commit('updateData', {
            temperature: data.temperature,
            humidity: data.humidity,
            time: data.time,
            online: data.online
        });
    },
    async toggleDHT({ commit }) {
        let data = await sensor.toggleDHT();
        commit('updateOnline', {
            online: data.online
        });
    }
}

// mutations
const mutations = {
    updateData(state, payload) {
        state.temperature = payload.temperature;
        state.humidity = payload.humidity;
        state.time = payload.time;
        state.online = payload.online;
    },
    updateOnline(state, payload) {
        state.online = payload.online;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
