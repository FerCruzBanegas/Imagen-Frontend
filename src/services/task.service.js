import ApiService from './api.service'

const TaskService = {
//   searchTask: async function(data) {
//     try {
//       const params = {
//         params: data
//       }
//       const response = await ApiService.getParams('/tasks/search', params)
//       return response
//     } catch (error) {
//       console.log(error)
//     }
//   },

  storeTask: async function(data) {
    try {
      const response = await ApiService.post('/tasks', data)
      return response
    } catch (error) {
      throw error
    }
  },

  closeTasks: async function(data) {
    try {
      const response = await ApiService.post('/tasks/close', data)
      return response
    } catch (error) {
      throw error
    }
  }
}

export default TaskService