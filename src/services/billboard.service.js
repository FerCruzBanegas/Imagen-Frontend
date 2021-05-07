import ApiService from './api.service'

const BillboardService = {
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

  searchBillboards: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/billboards/search', params)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  showBillboards: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      console.log(error)
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

  deleteBillboard: async function(data) {
    try {
      const response = await ApiService.deleteParams('/billboards', {data: {billboards: data}})
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default BillboardService