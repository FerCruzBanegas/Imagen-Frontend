// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_CUSTOMER (state, data) {
    let obj = {
      id: data.id,
      nombre: data.business_name,
      nit: data.nit,
      teléfono: data.phone,
      ciudad: data.city,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_CUSTOMER (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_CUSTOMER (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemCustomer({ commit }, data) {
    commit('SET_ITEM_CUSTOMER', data)
  },

  deleteItemCustomer({ commit }, id) {
    commit('DELETE_ITEM_CUSTOMER', id)
  },

  emptyCustomer({ commit }) {
    commit('EMPTY_CUSTOMER')
  },
}

// getters
const getters = {
  itemsCustomer: state => {
    return state.items
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}