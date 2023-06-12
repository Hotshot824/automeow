import sensorNodes from '../../api/sensor_nodes'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: null,
    device_position: null,
    device_status: true,
    lastupdate: null,
    mode: null,
    fountain_status: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        const response = await sensorNodes.fetchData("fountain-01");
        if (Object.keys(response).length > 1) {
            commit('updateData', {
                device_name: response.device_name,
                device_position: response.device_position,
                device_status: response.device_status,
                lastupdate: response.lastupdate,
                mode: response.data.mode,
                fountain_status: response.data.fountain_status,
            });
        } else {
            commit('updateStatus', {
                device_status: response.device_status
            });
        }
    },
    async toggle({ commit }) {
        const response = await sensorNodes.fetchControl("fountain-01", "toggle");
        commit('updateStatus', {
            device_status: response.device_status
        });
    },
    async changeMode({ commit }) {
        const response = await sensorNodes.fetchControl("fountain-01", "change_mode");
        console.log(response)
        commit('updateData', {
            device_name: response.device_name,
            device_position: response.device_position,
            device_status: response.device_status,
            lastupdate: response.lastupdate,
            mode: response.data.mode,
            fountain_status: response.data.fountain_status,
        });
    },
    async changeFountain({ commit }) {
        const response = await sensorNodes.fetchControl("fountain-01", "change_fountain");
        commit('updateData', {
            device_name: response.device_name,
            device_position: response.device_position,
            device_status: response.device_status,
            lastupdate: response.lastupdate,
            mode: response.data.mode,
            fountain_status: response.data.fountain_status,
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
        state.fountain_status = payload.fountain_status;
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
