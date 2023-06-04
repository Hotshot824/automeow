import DHT22 from '../../api/DHT22'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: null,
    device_position: null,
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
        const data = await DHT22.fetchDHTdata();
        // console.log(data);
        commit('updateData', {
            device_name: data.device_name,
            device_position: data.device_position,
            temperature: data.temperature,
            humidity: data.humidity,
            time: data.time,
            online: data.online
        });
    },
    async toggleDHT({ commit }) {
        const data = await DHT22.fetchToggleDHT();
        // console.log(data);
        commit('updateOnline', {
            online: data.online
        });
    }
}

// mutations
const mutations = {
    updateData(state, payload) {
        state.device_name = payload.device_name;
        state.device_position = payload.device_position;
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
