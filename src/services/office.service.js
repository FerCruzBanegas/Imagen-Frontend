import ApiService from './api.service'

const OfficeService = {

  listOffices: async function() {
    try {
      const response = await ApiService.get('/offices/listing')
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default OfficeService