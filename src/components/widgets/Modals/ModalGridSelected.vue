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
    <a-spin :spinning="success">
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
      <hr />
      <div class="row" v-if="permission(`${access}.destroy`)">
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <small>
            <strong>Pulse el botón si desear eliminar todos los registros de la lista.</strong>
          </small>
        </div>
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <b-popover
            target="popover-delete"
            triggers="click"
            :show.sync="popoverShow"
            placement="auto"
            ref="popover"
          >
            <a-alert
              message="Alerta"
              :description="alert_message"
              type="warning"
              showIcon
            />
            <br /> 
            <div>
              <b-button  class="mr-2" squared @click="closeAlert" size="sm" variant="outline-secondary">Cancelar</b-button>
              <b-button squared @click="deleted" size="sm" variant="danger">Si</b-button>
            </div>
          </b-popover>
          <b-button
            id="popover-delete"
            squared
            variant="danger"
            class="float-right"
          >({{data.length}}) ELIMINAR TODO</b-button>
        </div>
      </div>
    </a-spin>
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
    alert_message: String,
  },

  mixins: [permission],

  data() {
    return {
      success: false,
      popoverShow: false,
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

  created: function () {
    this.$bus.$on('success', this.successful)
  },

  methods: {
    closeAlert() {
      this.popoverShow = false
    },

    successful() {
      this.success = false
    },

    onClose() {
      this.$emit("hide");
    },

    async deleted() {
      this.popoverShow = false
      this.success = true
      this.$emit("deleted")
    }
  }
};
</script>
<style scoped src="../../../assets/css/table.css"></style>
