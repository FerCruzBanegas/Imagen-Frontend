import ApiService from './api.service'

const AccountService = {

  getAccounts: async function() {
    try {
      const response = await ApiService.get('/accounts')
      return response
    } catch (error) {
      console.log(error)
    }
  },

  closeAccount: async function(data) {
    try {
      const response = await ApiService.post('/accounts/close', data)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfListAccountReceivable: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/accounts/receivable/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListAccountReceivable: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/accounts/receivable/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfListAccountCancelled: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/accounts/cancelled/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListAccountCancelled: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/accounts/cancelled/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default AccountService