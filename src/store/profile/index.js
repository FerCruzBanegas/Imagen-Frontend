// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_PROFILE (state, data) {
    let obj = {
      id: data.id,
      descripción: data.description,
      registrado: data.created,
      actualizado: data.updated,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_PROFILE (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_PROFILE (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemProfile({ commit }, data) {
    commit('SET_ITEM_PROFILE', data)
  },

  deleteItemProfile({ commit }, id) {
    commit('DELETE_ITEM_PROFILE', id)
  },

  emptyProfile({ commit }) {
    commit('EMPTY_PROFILE')
  },
}

// getters
const getters = {
  itemsProfile: state => {
    return state.items
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}