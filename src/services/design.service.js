import ApiService from './api.service'

const DesignService = {

  storeDesign: async function(data) {
    try {
      const response = await ApiService.post('/designs', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateDesign: async function(id, data) {
    try {
      const response = await ApiService.put(`designs/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadDesign: async function(data) {
    try {
      const options = {
        method: 'post',
        url: 'designs/download',
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

export default DesignService