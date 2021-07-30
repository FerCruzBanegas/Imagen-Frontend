import ApiService from './api.service'

const CityService = {
  listCities: async function() {
    try {
      const response = await ApiService.get('/cities/listing')
      return response
    } catch (error) {
      console.log(error)
    }
  },

  statesByCity: async function() {
    try {
      const response = await ApiService.get('/cities/status')
      return response
    } catch (error) {
      console.log(error)
    }
  },

  quotesPerMonth: async function() {
    try {
      const response = await ApiService.get('/cities/quotes')
      return response
    } catch (error) {
      console.log(error)
    }
  },

  storeCity: async function(data) {
    try {
      const response = await ApiService.post('/cities', data)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default CityService