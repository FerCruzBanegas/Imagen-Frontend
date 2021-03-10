<template>
  <b-modal
    v-model="responseMessage.modal"
    :value.sync="responseMessage.show"
    :header-bg-variant="'secondary'"
    size="lg"
    no-close-on-backdrop
    hide-footer
  >
    <div class="h5">{{ responseMessage.text }}</div>
    <b-button
      @click="close"
      variant="danger"
      class="float-right"
    >Aceptar</b-button>
    <template v-slot:modal-header="{ close }">
      <h4 class="text-white">{{ responseMessage.title }}</h4>
    </template>
  </b-modal>
</template>

<script>
  import { mapGetters } from 'vuex'
  export default {
    name: 'feedback-message',
    computed: mapGetters([
      'responseMessage'
    ]),
    methods: {
      close () {
        this.$store.dispatch('clearMessage')
      }
    }
  }
</script>