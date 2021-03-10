import ApiService from './api.service'

const EmployeeService = {
  pdfListEmployee: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/employees/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListEmployee: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/employees/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  listEmployees: async function() {
    try {
      const response = await ApiService.get('/employees/listing')
      return response
    } catch (error) {
      console.log(error)
    }
  },

  searchEmployee: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/employees/search', params)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  showEmployee: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  storeEmployee: async function(data) {
    try {
      const response = await ApiService.post('/employees', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateEmployee: async function(id, data) {
    try {
      const response = await ApiService.put(`/employees/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteEmployee: async function(data) {
    try {
      const response = await ApiService.deleteParams('/employees', {data: {employees: data}})
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default EmployeeService