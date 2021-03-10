// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_INVOICE (state, data) {
      let obj = {
        id: data.id,
        número: data.number,
        fecha: data.date,
        cliente: data.customer,
        total: data.total,
      }
      const flag = state.items.some(item => item.id === obj.id)
      if (!flag) state.items.push(obj)
    },
    
    DELETE_ITEM_INVOICE (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_INVOICE (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemInvoice({ commit }, data) {
      commit('SET_ITEM_INVOICE', data)
    },
  
    deleteItemInvoice({ commit }, id) {
      commit('DELETE_ITEM_INVOICE', id)
    },
  
    emptyInvoice({ commit }) {
      commit('EMPTY_INVOICE')
    },
  }
  
  // getters
  const getters = {
    itemsInvoice: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }