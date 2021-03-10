import ApiService from './api.service'

const ProfileService = {
  listProfiles: async function() {
    try {
      const response = await ApiService.get('/profiles/listing')
      return response
    } catch (error) {
      console.log(error)
    }
  },
  
  showProfile: async function(url) {
    try {
      const response = await ApiService.get(url)
      return response
    } catch (error) {
      console.log(error)
    }
  },

  storeProfile: async function(data) {
    try {
      const response = await ApiService.post('/profiles', data)
      return response
    } catch (error) {
      throw error
    }
  },

  updateProfile: async function(id, data) {
    try {
      const response = await ApiService.put(`/profiles/${id}`, data)
      return response
    } catch (error) {
      throw error
    }
  },

  deleteProfile: async function(data) {
    try {
      const response = await ApiService.deleteParams('/profiles', {data: {profiles: data}})
      return response
    } catch (error) {
      console.log(error)
    }
  },
}

export default ProfileService