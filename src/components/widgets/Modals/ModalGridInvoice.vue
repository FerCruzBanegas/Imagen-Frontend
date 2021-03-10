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
    <div>
    <table class="table-scroll small-first-col">
        <thead>
        <tr>
            <th scope="col" v-for="(column, index) in keyItems" :key="index">{{column}}</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="(item, index) in items" :key="index">
            <td :data-label="column" v-for="(column, indexColumn) in keyItems" :key="indexColumn">{{item[column]}}</td>
        </tr>
        </tbody>
    </table>
    </div>
  </b-modal>
</template>
<script>
import permission from '../../../mixins/permission'

export default {
  props: {
    visible: Boolean,
    title: String,
    access: String,
    data: Array,
  },

  mixins: [permission],

  data() {
    return {
      success: false,
    }
  },

  computed: {
    items() {
      return this.data.map(({id,...rest}) => ({...rest}))
    },

    keyItems() {
      if (this.items.length) {
        return Object.keys(this.items[0])
      }
      return []
    }
  },

methods: {
    onClose() {
      this.$emit("hide");
    },
  }
};
</script>
<style scoped src="../../../assets/css/table.css"></style>
