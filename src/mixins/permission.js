import { mapGetters } from 'vuex'

export default {
  computed: mapGetters([
    'currentUser'
  ]),

  methods: {
    permission (url) {
      if(this.currentUser)
      	if (url.includes("|")) {
      	  const substrings = url.split("|") 
      	  return substrings.some(v => this.currentUser.acl.includes(v)) || this.currentUser.acl.includes('*') || url == 'all'
      	} else {
          return this.currentUser.acl.includes(url) || this.currentUser.acl.includes('*') || url == 'all'
      	}
    }
  }
}