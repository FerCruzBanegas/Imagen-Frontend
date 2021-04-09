// state
const state = {
    items: [],
  }
  
  // mutations
  const mutations = {
    SET_ITEM_MACHINE (state, data) {
      let obj = {
        id: data.id,
        descripción: data.description,
        registrado: data.created,
        actualizado: data.updated,
      }
      const flag = state.items.some(item => item.id === obj.id)
      if (!flag) state.items.push(obj)
    },
    
    DELETE_ITEM_MACHINE (state, id) {
      state.items.splice(id, 1)
    },
  
    EMPTY_MACHINE (state) {
      state.items = []
    },
  }
  
  // actions
  const actions = {
    setItemMachine({ commit }, data) {
      commit('SET_ITEM_MACHINE', data)
    },
  
    deleteItemMachine({ commit }, id) {
      commit('DELETE_ITEM_MACHINE', id)
    },
  
    emptyMachine({ commit }) {
      commit('EMPTY_MACHINE')
    },
  }
  
  // getters
  const getters = {
    itemsMachine: state => {
      return state.items
    }
  }
  
  export default {
    state,
    mutations,
    actions,
    getters
  }