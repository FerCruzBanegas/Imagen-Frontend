// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_BILLBOARD (state, data) {
      let obj = {
        id: data.id,
        código: data.code,
        ubicación: data.location,
        estado: data.state,
        ciudad: data.city,
      }
      const flag = state.items.some(item => item.id === obj.id)
      if (!flag) state.items.push(obj)
    },
    
    DELETE_ITEM_BILLBOARD (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_BILLBOARD (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemBillboard({ commit }, data) {
      commit('SET_ITEM_BILLBOARD', data)
    },
  
    deleteItemBillboard({ commit }, id) {
      commit('DELETE_ITEM_BILLBOARD', id)
    },
  
    emptyBillboard({ commit }) {
      commit('EMPTY_BILLBOARD')
    },
  }
  
  // getters
  const getters = {
    itemsBillboard: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }