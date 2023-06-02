import sensor from '../../api/sensor'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    temperature: null,
    humidity: null,
    online: null,
    current_time: null,
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
            current_time: data.current_time,
            online: data.online
        });
    },
    async toggleDHT() {
        await sensor.toggleDHT();
    }
}

// mutations
const mutations = {
    updateData(state, payload) {
        state.temperature = payload.temperature;
        state.humidity = payload.humidity;
        state.current_time = payload.current_time;
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
