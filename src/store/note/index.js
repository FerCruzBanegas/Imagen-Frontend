// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_NOTE (state, data) {
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
    
    DELETE_ITEM_NOTE (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_NOTE (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemNote({ commit }, data) {
      commit('SET_ITEM_NOTE', data)
    },
  
    deleteItemNote({ commit }, id) {
      commit('DELETE_ITEM_NOTE', id)
    },
  
    emptyNote({ commit }) {
      commit('EMPTY_NOTE')
    },
  }
  
  // getters
  const getters = {
    itemsNote: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }