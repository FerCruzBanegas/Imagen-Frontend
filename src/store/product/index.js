// state
const state = {
  items: [],
  loadQuotes: false
}

// mutations
const mutations = {
  SET_ITEM_PRODUCT (state, data) {
    let obj = {
      id: data.id,
      código: data.code,
      nombre: data.name,
      categoría: data.category,
      registrado: data.created,
    }
    const flag = state.items.some(item => item.id === obj.id)
    if (!flag) state.items.push(obj)
  },
  
  DELETE_ITEM_PRODUCT (state, id) {
    state.items.splice(id, 1)
  },

  EMPTY_PRODUCT (state) {
    state.items = []
  },

  SHOW_LOAD_QUOTES (state) {
    state.loadQuotes = true
  },

  CLOSE_LOAD_QUOTES (state) {
    state.loadQuotes = false
  },
}

// actions
const actions = {
  setItemProduct({ commit }, data) {
    commit('SET_ITEM_PRODUCT', data)
  },

  deleteItemProduct({ commit }, id) {
    commit('DELETE_ITEM_PRODUCT', id)
  },

  emptyProduct({ commit }) {
    commit('EMPTY_PRODUCT')
  },
}

// getters
const getters = {
  itemsProduct: state => {
    return state.items
  },

  loaderProduct: state => {
    return state.loadQuotes
  }
}

export default {
  state,
  mutations,
  actions,
  getters
}