// state
const state = {
  items: [],
}

// mutations
const mutations = {
  SET_ITEM_MATERIAL (state, data) {
    let obj = {
      id: data.id,
      name: data.name,
      unity: data.unity,
      descripción: data.description,
      registrado: data.created,
      actualizado: data.updated,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_MATERIAL (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_MATERIAL (state) {
    state.items = []
  },
}

// actions
const actions = {
  setItemMaterial({ commit }, data) {
    commit('SET_ITEM_MATERIAL', data)
  },

  deleteItemMaterial({ commit }, id) {
    commit('DELETE_ITEM_MATERIAL', id)
  },

  emptyMaterial({ commit }) {
    commit('EMPTY_MATERIAL')
  },
}

// getters
const getters = {
  itemsMaterial: state => {
    return state.items
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}