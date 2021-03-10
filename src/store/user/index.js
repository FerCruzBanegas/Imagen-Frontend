// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_USER (state, data) {
    let obj = {
      id: data.id,
      nombre: data.name,
      correo: data.email,
      estado: data.state,
      registrado: data.created,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_USER (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_USER (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemUser({ commit }, data) {
    commit('SET_ITEM_USER', data)
  },

  deleteItemUser({ commit }, id) {
    commit('DELETE_ITEM_USER', id)
  },

  emptyUser({ commit }) {
    commit('EMPTY_USER')
  },
}

// getters
const getters = {
  itemsUser: state => {
    return state.items
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}