<template>
  <b-modal
    v-model="visible"
    :header-bg-variant="'secondary'"
    size="lg"
    no-close-on-backdrop
    hide-footer
  >
    <a-spin :spinning="loading">
      <div class="h5">{{ alert_message }}</div>
      <b-button
        @click="onSubmit"
        variant="danger"
        class="float-right"
      >Aceptar</b-button>
    </a-spin>
    <template v-slot:modal-header="{ close }">
      <h4 class="text-white">{{ title }}</h4>
      <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
    </template>
  </b-modal>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    title: String,
    loading: Boolean,
    alert_message: String
  },

  methods: {
    onClose() {
      this.$emit("hide")
    },

    onSubmit() {
      this.$emit("submit")
    }
  }
}
</script>
