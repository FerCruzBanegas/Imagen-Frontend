import ApiService from './api.service'

const InvoiceService = {
  pdfListInvoice: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/invoices/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListInvoice: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/invoices/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  storeInvoice: async function(data) {
    try {
      const response = await ApiService.post('/invoices', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateInvoice: async function(id, data) {
    try {
      const response = await ApiService.put(`invoices/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadInvoice: async function(id, type) {
    try {
      const options = {
        method: 'get',
        url: `invoices/download/${id}`,
        responseType: 'arraybuffer',
        params: {
          type: type
        }
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  cancelInvoice: async function(id) {
    try {
      const response = await ApiService.put(`invoices/canceled/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default InvoiceService