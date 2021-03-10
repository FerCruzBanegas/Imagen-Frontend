import ApiService from './api.service'

const CostService = {

  storeCost: async function(data) {
    try {
      const response = await ApiService.post('/costs', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateCost: async function(id, data) {
    try {
      const response = await ApiService.put(`/costs/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  active: async function(id) {
    try {
      const options = {
        method: 'put',
        url: `costs/active/${id}`,
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default CostService