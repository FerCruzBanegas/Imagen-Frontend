import ApiService from './api.service'

const CategoryService = {

  listCategories: async function() {
    try {
      const response = await ApiService.get('/categories/listing')
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default CategoryService