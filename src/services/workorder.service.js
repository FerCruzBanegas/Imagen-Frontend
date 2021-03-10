import ApiService from './api.service'

const WorkOrderService = {
  pdfListWorkOrder: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/workorders/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListWorkOrder: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/workorders/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },
  
  storeWorkOrder: async function(data) {
    try {
      const response = await ApiService.post('/workorders', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateWorkOrder: async function(data) {
    try {
      const response = await ApiService.put(`workorders/${data.id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadWorkOrder: async function(data) {
    try {
      const options = {
        method: 'post',
        url: 'workorders/download',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  finishWorkOrder: async function(id) {
    try {
      const response = await ApiService.put(`workorders/finish/${id}`)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default WorkOrderService