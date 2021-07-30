import ApiService from './api.service'

const QuotationService = {
  searchQuotation: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/quotations/search', params)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  pdfListQuotation: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/quotations/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListQuotation: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/quotations/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadQuotation: async function(id) {
    try {
      const options = {
        method: 'get',
        url: `download/quotation/${id}`,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadQuotationSummary: async function(id) {
    try {
      const options = {
        method: 'get',
        url: `download/quotation/${id}/summary`,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  showQuotation: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  storeQuotation: async function(data) {
    try {
      const response = await ApiService.post('/quotations', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateQuotation: async function(id, data) {
    try {
      const response = await ApiService.put(`quotations/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteQuotation: async function(data) {
    try {
      const response = await ApiService.deleteParams('quotations', {data: {quotations: data}})
      return response
    } catch (error) {
      throw error
    }
  },

  approvedQuotation: async function(id) {
    try {
      const response = await ApiService.put(`quotations/approved/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default QuotationService
