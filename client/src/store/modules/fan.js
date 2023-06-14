import sensorNodes from '../../api/sensor_nodes'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: null,
    device_position: null,
    device_status: true,
    lastupdate: null,
    fan_status: null,
    fan_run_time: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        const response = await sensorNodes.fetchData("fan-01");
        if (Object.keys(response).length > 1) {
            commit('updateData', {
                device_name: response.device_name,
                device_position: response.device_position,
                device_status: response.device_status,
                lastupdate: response.lastupdate,
                fan_status: response.data.fan_status,
                fan_run_time: response.data.fan_run_time,
            });
        } else {
            commit('updateStatus', {
                device_status: response.device_status
            });
        }
    },
    async toggle({ commit }) {
        const response = await sensorNodes.fetchControl("fan-01", "toggle");
        commit('updateData', {
            device_name: response.device_name,
            device_position: response.device_position,
            device_status: response.device_status,
            lastupdate: response.lastupdate,
            fan_status: response.data.fan_status,
            fan_run_time: response.data.fan_run_time,
        });
    },
    async toggleFan({ commit }) {
        const response = await sensorNodes.fetchControl("fan-01", "toggle_fan");
        commit('updateData', {
            device_name: response.device_name,
            device_position: response.device_position,
            device_status: response.device_status,
            lastupdate: response.lastupdate,
            fan_status: response.data.fan_status,
            fan_run_time: response.data.fan_run_time,
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
        state.fan_status = payload.fan_status;
        state.fan_run_time = payload.fan_run_time;
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
