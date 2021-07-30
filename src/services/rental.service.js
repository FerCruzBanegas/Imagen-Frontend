import ApiService from './api.service'

const RentalService = {
  pdfListRental: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/rentals/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfDetailRental: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/rentals/detail-pdf',
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
        url: '/rentals/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  pdfListRenovations: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/rentals/renovations-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListRenovations: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/rentals/renovations-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  searchRentals: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/rentals/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  getLastRental: async function() {
    try {
      const response = await ApiService.get('/rentals/last-rental')
      return response
    } catch (error) {
      throw error
    }
  },

  getRenovations: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  showRental: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  storeRental: async function(data) {
    try {
      const response = await ApiService.post('/rentals', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateRental: async function(id, data) {
    try {
      const response = await ApiService.put(`/rentals/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteRental: async function(data) {
    try {
      const response = await ApiService.deleteParams('/rentals', {data: {rentals: data}})
      return response
    } catch (error) {
      throw error
    }
  },
}

export default RentalService