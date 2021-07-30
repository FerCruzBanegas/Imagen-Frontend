// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_RENTAL (state, data) {
      let obj = {
        id: data.id,
        inicio: data.date_start,
        fin: data.date_end,
        condición: data.condition,
        cliente: data.customer,
        ubicación: data.location,
      }
      const flag = state.items.some(item => item.id === obj.id)
      if (!flag) state.items.push(obj)
    },
    
    DELETE_ITEM_RENTAL (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_RENTAL (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemRental({ commit }, data) {
      commit('SET_ITEM_RENTAL', data)
    },
  
    deleteItemRental({ commit }, id) {
      commit('DELETE_ITEM_RENTAL', id)
    },
  
    emptyRental({ commit }) {
      commit('EMPTY_RENTAL')
    },
  }
  
  // getters
  const getters = {
    itemsRental: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }