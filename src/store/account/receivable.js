// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_ACCOUNT_RECEIVABLE (state, data) {
      let obj = {
        id: data.id,
        cite: data.cite,
        número: data.number,
        total: data.amount,
        pagado: data.amount_paid,
        saldo: data.balance,
        usuario: data.user,
      }
      const flag = state.items.some(item => item.id === obj.id)
      if (!flag) state.items.push(obj)
    },
    
    DELETE_ITEM_ACCOUNT_RECEIVABLE (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_ACCOUNT_RECEIVABLE (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemAccountReceivable({ commit }, data) {
      commit('SET_ITEM_ACCOUNT_RECEIVABLE', data)
    },
  
    deleteItemAccountReceivable({ commit }, id) {
      commit('DELETE_ITEM_ACCOUNT_RECEIVABLE', id)
    },
  
    emptyAccountReceivable({ commit }) {
      commit('EMPTY_ACCOUNT_RECEIVABLE')
    },
  }
  
  // getters
  const getters = {
    itemsAccountsReceivable: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }