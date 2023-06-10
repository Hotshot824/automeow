import sensorNodes from '../../api/sensor_nodes'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: NaN,
    device_position: NaN,
    device_status: NaN,
    temperature: NaN,
    humidity: NaN,
    light: NaN,
    lastupdate: NaN,
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
        const data = await sensorNodes.fetchControl("ENV-01", "toggle");
        commit('updateStatus', {
            device_status: data.device_status
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
        if (!isNaN(payload.temperature)) {
            state.temperature = payload.temperature;
            state.humidity = payload.humidity;
            state.light = payload.light;
        }
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
