// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_WORKORDER (state, data) {
    const flag = state.items.some(item => item.id === data.id)
    if (!flag) state.items.push(data)
  },
  
  DELETE_ITEM_WORKORDER (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_WORKORDER (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemWorkOrder({ commit }, data) {
    commit('SET_ITEM_WORKORDER', data)
  },

  deleteItemWorkOrder({ commit }, id) {
    commit('DELETE_ITEM_WORKORDER', id)
  },

  emptyWorkOrder({ commit }) {
    commit('EMPTY_WORKORDER')
  },
}

// getters
const getters = {
  itemsWorkOrder: state => {
    return state.items
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}