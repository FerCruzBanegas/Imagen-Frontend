<template>
  <b-modal
    v-model="visible"
    :header-bg-variant="'secondary'"
    size="xl"
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
    scrollable
  >
    <template v-slot:modal-header="{ close }">
      <h5 class="text-white">LISTA DE FACTURAS EMITIDAS</h5>
      <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
    </template>
    <!-- <pre>{{ invoice }}</pre> -->
      <div class="container">
        <!-- <div><h2 class="font-weight-bold">LISTA DE FACTURAS EMITIDAS</h2></div> -->
        <div class="d-flex justify-content-between row bg-light p-2">
          <div><h5 class="font-weight-bold">CITE: {{ cite }}</h5></div>
          <div>
            <button id="btn-invoice" type="button" class="btn btn-danger btn-with-addon mr-auto text-nowrap">
              <span class="btn-addon">
                <i class="btn-addon-icon fe fe-plus-circle" />
              </span>
              Nueva Factura
            </button>
            <b-popover
              target="btn-invoice"
              triggers="click"
              :show.sync="popoverShow"
              placement="right"
              ref="popover"
            >
              <b-alert show variant="secondary">
                <h4 class="alert-heading font-weight-bold">Nota</h4>
                <div class="h6">Desea cargar el formulario con los datos de la última factura?</div>
              </b-alert>
              <div>
                <b-button @click="setFormInvoice(false)" class="mr-2" squared size="sm" variant="outline-secondary">NO</b-button>
                <b-button @click="setFormInvoice(true)" squared size="sm" variant="danger">SI</b-button>
              </div>
            </b-popover>
          </div>
        </div>
      </div>
      <b-table class="text-center" thead-class="bg-danger text-white" small fixed striped hover responsive="sm" stacked="sm" show-empty :fields="columns" :items="invoices" :sort-by.sync="sortBy" :sort-desc.sync="sortDesc">
        <template v-slot:empty="scope">
          <div class="text-center">
            <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
            <h6>No existen resultados</h6>
          </div>
        </template>
        <template v-slot:head(number)="data">
          <span>{{ data.label.toUpperCase() }}</span>
        </template>
        <template v-slot:head(date)="data">
          <span>{{ data.label.toUpperCase() }}</span>
        </template>
        <template v-slot:head(total)="data">
          <span>{{ data.label.toUpperCase() }}</span>
        </template>
        <template v-slot:cell(number)="data">
          <strong>{{ data.value }}</strong>
        </template>
        <template v-slot:cell(date)="data">
          <strong>{{ data.value | formatDate('DD/MM/YYYY') }}</strong>
        </template>
        <template v-slot:cell(total)="data">
          <strong>{{ data.value | currency }}</strong>
        </template>
        <template v-slot:cell(opciones)="row">
          <b-button @click="getCheckInvoice(row)" size="sm" class="mr-2" variant="dark">
            <i class="fa fa-search-plus" aria-hidden="true"></i>
          </b-button>
        </template>
      </b-table>
  </b-modal>
</template>
<script>
import InvoiceService from '../../../services/invoice.service'

export default {
  props: {
    invoices: Array,
    visible: Boolean,
    cite: String
  },

  data() {
    return {
      sortBy: 'id',
      sortDesc: true,
      columns: [
        { key: 'number', label: 'número'},
        { key: 'date', label: 'fecha'},
        { key: 'total', label: 'total'},
        'opciones',
      ],
      popoverShow: false,
    }
  },

  // created() {
  //   this.$bus.$on('setItemInvoice', (data) => {
  //     this.checkformOrList = true
  //     this.checkList = false
  //     this.invoiceItem = data
  //     this.checkInvoice = true
  //   })
  // },

  methods: {
    setFormInvoice(flag) {
      this.$emit('set-invoice-form', flag)
    },

    getCheckInvoice(row) {
      this.$bus.$emit('getCheckInvoice', row.item)
      // this.checkList = false
      // this.invoiceItem = row.item
      // this.checkInvoice = true
      // this.onClose()
      this.$emit("open-invoice-detail")
    },

    onClose() {
      this.$emit("hide")
    }
  }
}
</script>