// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_QUOTATION (state, data) {
    // console.log(data)
    let obj = {
      id: data.id,
      cite: data.cite,
      fecha: data.date,
      monto: data.amount,
      estado: data.state,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_QUOTATION (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_QUOTATION (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemQuotation({ commit }, data) {
    commit('SET_ITEM_QUOTATION', data)
  },

  deleteItemQuotation({ commit }, id) {
    commit('DELETE_ITEM_QUOTATION', id)
  },

  emptyQuotation({ commit }) {
    commit('EMPTY_QUOTATION')
  },
}

// getters
const getters = {
  itemsGeneral: state => {
    return state.items
  },

  itemsPending: state => {
    return state.items.filter(item => item.estado === 'PENDIENTE')
  },

  itemsApproved: state => {
    return state.items.filter(item => item.estado === 'APROBADO')
  },

  itemsExecuted: state => {
    return state.items.filter(item => item.estado === 'EJECUTADO')
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}