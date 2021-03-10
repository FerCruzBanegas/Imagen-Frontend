import ApiService from './api.service'

const VoucherService = {
  getVoucher: async function(data) {
    try {
      const response = await ApiService.post('vouchers', data)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default VoucherService