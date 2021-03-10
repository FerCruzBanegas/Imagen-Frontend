import ApiService from './api.service'

const ReportService = {

  getReport: async function(data) {
    try {
      const response = await ApiService.customRequest(data)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  downloadPdf: async function(data) {
    try {
      const options = {
        method: 'post',
        url: 'reports/pdf_download',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadExcel: async function(data) {
    try {
      const options = {
        method: 'post',
        url: 'reports/excel_download',
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

export default ReportService