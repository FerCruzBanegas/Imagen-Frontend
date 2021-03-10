import ApiService from './api.service'

const PaymentService = {
  storePayment: async function(data) {
    try {
      const response = await ApiService.post('/payments', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updatePayment: async function(id, data) {
    try {
      const response = await ApiService.put(`/payments/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deletePayment: async function(id) {
    try {
      const response = await ApiService.delete(`/payments/${id}`)
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default PaymentService