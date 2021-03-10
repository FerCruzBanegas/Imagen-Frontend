import ApiService from './api.service'

const ProductService = {
  pdfListProduct: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/products/list-pdf',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  excelListProduct: async function(data) {
    try {
      const options = {
        method: 'post',
        url: '/products/list-excel',
        data: data,
        responseType: 'arraybuffer'
      }
      const response = await ApiService.customRequest(options)
      return response
    } catch (error) {
      throw error
    }
  },

  searchProduct: async function(data) {
    try {
      const params = {
        params: data
      }
      const response = await ApiService.getParams('/products/search', params)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  showProduct: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  storeProduct: async function(data) {
    try {
      const response = await ApiService.post('/products', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateProduct: async function(id, data) {
    try {
      const response = await ApiService.put(`/products/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteProduct: async function(data) {
    try {
      const response = await ApiService.deleteParams('/products', {data: {products: data}})
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default ProductService