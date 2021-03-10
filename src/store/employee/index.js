// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_EMPLOYEE (state, data) {
    let obj = {
      id: data.id,
      nombre: data.name,
      documento: data.num_document,
      teléfono: data.phone,
      oficina: data.office,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_EMPLOYEE (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_EMPLOYEE (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemEmployee({ commit }, data) {
    commit('SET_ITEM_EMPLOYEE', data)
  },

  deleteItemEmployee({ commit }, id) {
    commit('DELETE_ITEM_EMPLOYEE', id)
  },

  emptyEmployee({ commit }) {
    commit('EMPTY_EMPLOYEE')
  },
}

// getters
const getters = {
  itemsEmployee: state => {
    return state.items
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}