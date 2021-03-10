// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_ACCOUNT_CANCELLED (state, data) {
      let obj = {
        id: data.id,
        cite: data.cite,
        número: data.number,
        total: data.amount,
        cierre: data.closing_date,
        usuario: data.user,
      }
      const flag = state.items.some(item => item.id === obj.id)
      if (!flag) state.items.push(obj)
    },
    
    DELETE_ITEM_ACCOUNT_CANCELLED (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_ACCOUNT_CANCELLED (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemAccountCancelled({ commit }, data) {
      commit('SET_ITEM_ACCOUNT_CANCELLED', data)
    },
  
    deleteItemAccountCancelled({ commit }, id) {
      commit('DELETE_ITEM_ACCOUNT_CANCELLED', id)
    },
  
    emptyAccountCancelled({ commit }) {
      commit('EMPTY_ACCOUNT_CANCELLED')
    },
  }
  
  // getters
  const getters = {
    itemsAccountsCancelled: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }