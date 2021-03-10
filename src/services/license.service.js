import ApiService from './api.service'

const LicenseService = {
  getLicense: async function(data) {
    try {
      const response = await ApiService.post('licenses/dosage', data)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default LicenseService