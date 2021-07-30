<template>
  <div id="app">
    <loading :active.sync="active" :is-full-page="true" color="#9e0207"></loading>
    <router-view />
    <feedback-message></feedback-message>
  </div>
</template>

<script>
import { mapGetters } from "vuex"
import FeedbackMessage from './components/widgets/General/FeedbackMessage/index'
export default {
  name: "app",
  computed: {
    ...mapGetters(['active'])
  },
  mounted() {
    this.$store.dispatch("hideLoader")
  },
  components: {
    'feedback-message': FeedbackMessage,
  }
}
</script>
