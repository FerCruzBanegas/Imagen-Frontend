import Vue from 'vue'
import Vuex from 'vuex'
import user from './user'
import auth from './auth'
import quotation from './quotation'
import invoice from './invoice'
import note from './note'
import account_receivable from './account/receivable'
import account_cancelled from './account/cancelled'
import workorder from './workorder'
import product from './product'
import material from './material'
import customer from './customer'
import employee from './employee'
import profile from './profile'
import loader from './loader'
import settings from './settings'
import message from './message'
import createPersistedState from 'vuex-persistedstate'

Vue.use(Vuex)

export default new Vuex.Store({
  modules: {
    auth,
    quotation,
    account_receivable,
    account_cancelled,
    invoice,
    note,
    workorder,
    product,
    material,
    customer,
    employee,
    profile,
    loader,
    user,
    settings,
    message
  },
  plugins: [createPersistedState()]
})
