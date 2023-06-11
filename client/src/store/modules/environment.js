import sensorNodes from '../../api/sensor_nodes'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: null,
    device_position: null,
    device_status: true,
    lastupdate: null,
    temperature: null,
    humidity: null,
    light: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        const response = await sensorNodes.fetchData("ENV-01");
        commit('updateData', {
            device_name: response.device_name,
            device_position: response.device_position,
            device_status: response.device_status,
            lastupdate: response.lastupdate,
            temperature: response.data.temperature,
            humidity: response.data.humidity,
            light: response.data.light,
        });
    },
    async toggle({ commit }) {
        const response = await sensorNodes.fetchControl("ENV-01", "toggle");
        commit('updateStatus', {
            device_status: response.device_status,
        });
    }
}

// mutations
const mutations = {
    updateData(state, payload) {
        state.device_name = payload.device_name;
        state.device_position = payload.device_position;
        state.device_status = payload.device_status;
        state.lastupdate = payload.lastupdate;
        state.temperature = payload.temperature;
        state.humidity = payload.humidity;
        state.light = payload.light;
    },
    updateStatus(state, payload) {
        state.device_status = payload.device_status;
    },
}

export default {
    namespaced: true,
    state,
    getters,
    actions,
    mutations,
}
