import ApiService from './api.service'

const MachineService = {
  searchMachine: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/machines/search', params)
      return response
    } catch (error) {
      throw error
    }
  },

  listMachines: async function() {
    try {
      const response = await ApiService.get('/machines/listing')
      return response
    } catch (error) {
      throw error
    }
  },

  showMachine: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error    
    }
  },

  storeMachine: async function(data) {
    try {
      const response = await ApiService.post('/machines', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateMachine: async function(id, data) {
    try {
      const response = await ApiService.put(`/machines/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteMachine: async function(data) {
    try {
      const response = await ApiService.deleteParams('/machines', {data: {machines: data}})
      return response
    } catch (error) {
      throw error
    }
  },
}

export default MachineService