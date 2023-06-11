import sensorNodes from '../../api/sensor_nodes'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: null,
    device_position: null,
    device_status: true,
    lastupdate: null,
    mode: null,
    init_distance: null,
    distance: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        const response = await sensorNodes.fetchData("feeder-01");
        commit('updateData', {
            device_name: response.device_name,
            device_position: response.device_position,
            device_status: response.device_status,
            lastupdate: response.lastupdate,
            mode: response.data.mode,
            init_distance: response.data.init_distance,
            distance: response.data.distance,
        });
    },
    async toggle({ commit }) {
        const data = await sensorNodes.fetchControl("feeder-01", "toggle");
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
        state.mode = payload.mode;
        state.init_distance = payload.init_distance;
        state.distance = payload.distance;
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
