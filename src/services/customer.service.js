import ApiService from './api.service'

const CustomerService = {
  pdfListCustomer: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/customers/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListCustomer: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/customers/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  searchCustomer: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/customers/search', params)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  showCustomer: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  storeCustomer: async function(data) {
    try {
      const response = await ApiService.post('/customers', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateCustomer: async function(id, data) {
    try {
      const response = await ApiService.put(`/customers/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteCustomer: async function(data) {
    try {
      const response = await ApiService.deleteParams('/customers', {data: {customers: data}})
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default CustomerService