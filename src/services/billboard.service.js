import ApiService from './api.service'

const BillboardService = {
  pdfPresentationBillboard: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/billboards/presentation-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfListBillboard: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/billboards/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfDetailBillboard: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/billboards/detail-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListBillboard: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/billboards/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfListRentals: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/billboards/rentals-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListRental: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/billboards/rentals-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  listBillboards: async function() {
    try {
      const response = await ApiService.get('/billboards/listing')
      return response
    } catch (error) {
      throw error
    }
  },

  searchBillboards: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/billboards/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  getLastBillboard: async function() {
    try {
      const response = await ApiService.get('/billboards/last-billboard')
      return response
    } catch (error) {
      throw error
    }
  },

  getRecordBillboard: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  showBillboard: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  saveCustomerImage: async function(id, data) {
    try {
      const response = await ApiService.post(`/billboards/save-customer-img/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  saveUserImage: async function(id, data) {
    try {
      const response = await ApiService.post(`/billboards/save-user-img/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  storeBillboard: async function(data) {
    try {
      const response = await ApiService.post('/billboards', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateBillboard: async function(id, data) {
    try {
      const response = await ApiService.put(`/billboards/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteBillboard: async function(id) {
    try {
      const response = await ApiService.delete(`/billboards/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default BillboardService