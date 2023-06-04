import feeder from '../../api/feeder'

// initial state
// shape: [{ id, quantity }]
const state = () => ({
    device_name: null,
    device_position: null,
    online: null,
    time: null,
})

// getters
const getters = {
}

// actions
const actions = {
    async getData({ commit }) {
        const data = await feeder.fetchData();
        // console.log(data);
        commit('updateData', {
            device_name: data.device_name,
            device_position: data.device_position,
            time: data.time,
            online: data.online
        });
    },
    async toggle({ commit }) {
        const data = await feeder.fetchToggle();
        // console.log(data);
        commit('updateOnline', {
            online: data.online
        });
    },
    async toFeed({ commit }) {
        const data = await feeder.fetchToFeed();
    }
}

// mutations
const mutations = {
    updateData(state, payload) {
        state.device_name = payload.device_name;
        state.device_position = payload.device_position;
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
