import ApiService from './api.service'

const NoteService = {
  pdfListNote: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/notes/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListNote: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/notes/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  showNote: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      throw error
    }
  },

  storeNote: async function(data) {
    try {
      const response = await ApiService.post('/notes', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateNote: async function(id, data) {
    try {
      const response = await ApiService.put(`notes/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  downloadNote: async function(id, type) {
    try {
      const options = {
        method: 'get',
        url: `notes/download/${id}`,
        responseType: 'arraybuffer',
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },
}

export default NoteService