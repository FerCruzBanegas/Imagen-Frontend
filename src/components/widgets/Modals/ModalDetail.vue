<template>
  <b-modal
    v-model="visible"
    :header-bg-variant="'secondary'"
    size="lg"
    no-close-on-backdrop
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <h5 class="text-white">{{ title }}</h5>
      <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
    </template>
    <slot  />
  </b-modal>
</template>
<script>
export default {
  props: {
    visible: Boolean,
    title: String
  },
  
  methods: {
    onClose() {
      this.$emit("hide")
    }
  }
}
</script>
