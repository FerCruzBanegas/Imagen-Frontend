// state
const state = {
    loader: false,
}

// mutations
const mutations = {
    SHOW_LOADER(state) {
        state.loader = true
    },

    HIDE_LOADER(state) {
        state.loader = false
    },
}

// actions
const actions = {
    showLoader({ commit }) {
        commit('SHOW_LOADER')
    },

    hideLoader({ commit }) {
        commit('HIDE_LOADER')
    },
}

// getters
const getters = {
    active: state => {
        return state.loader
    },
}

export default {
    state,
    mutations,
    actions,
    getters
}