import ApiService from './api.service'

const MaterialService = {
  searchMaterial: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/materials/search', params)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  storeMaterial: async function(data) {
    try {
      const response = await ApiService.post('/materials', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateMaterial: async function(id, data) {
    try {
      const response = await ApiService.put(`/materials/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteMaterial: async function(data) {
    try {
      const response = await ApiService.deleteParams('/materials', {data: {materials: data}})
      return response
    } catch (error) {
      throw error
    }
  },
}

export default MaterialService