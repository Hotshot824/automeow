import sensorNodes from '../../api/sensor_nodes'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: undefined,
    device_position: undefined,
    device_status: undefined,
    lastupdate: undefined,
    temperature: undefined,
    humidity: undefined,
    light: undefined,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        const response = await sensorNodes.fetchData("ENV-01");
        console.log(response);
        if (Object.keys(response.data).length > 0) {
            commit('updateData', {
                device_name: response.device_name,
                device_position: response.device_position,
                device_status: response.device_status,
                lastupdate: response.lastupdate,
                temperature: response.data.temperature,
                humidity: response.data.humidity,
                light: response.data.light,
            });
        } else {
            commit('updateStatus', {
                device_name: response.device_name,
                device_status: response.device_status,
            });
        }
    },
    async toggle({ commit }) {
        const response = await sensorNodes.fetchControl("ENV-01", "toggle");
        commit('updateStatus', {
            device_name: response.device_name,
            device_status: response.device_status,
        });
    }
}

// mutations
const mutations = {
    updateData(state, payload) {
        console.log(payload);
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
        state.device_name = payload.device_name,
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
