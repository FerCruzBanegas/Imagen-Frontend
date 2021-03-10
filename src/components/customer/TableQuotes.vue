<template>
  <div>
    <div class="row justify-content-end">
      <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
        <strong class="float-right">{{ totalItems }} ítems</strong> 
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <b-table class="text-center" thead-class="bg-danger text-white" :busy="isBusy" fixed striped hover :items="items" :fields="columns" responsive="sm" stacked="sm" :current-page="currentPage" show-empty>
          <template v-slot:empty="scope">
            <div class="text-center">
              <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
              <h6>No existen resultados</h6>
            </div>
          </template>
          <template v-slot:head(cite)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(date)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(amount)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(state)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(user)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:cell(cite)="data">
            <a style="text-decoration: underline;" class="cite" @click.prevent="ShowQuotation(data)">{{ data.value }}</a>
          </template>
          <template v-slot:cell(date)="data">
            <strong>{{ data.value | formatDate('DD/MM/YYYY') }}</strong>
          </template>
          <template v-slot:cell(amount)="data">
            <strong>{{ data.value }}</strong>
          </template>
          <template v-slot:cell(state)="data">
            <strong v-if="data.value =='APROBADO'" class="text-primary">{{ data.value }}</strong>
            <strong v-else-if="data.value =='PENDIENTE'" class="text-purple-2">{{ data.value }}</strong>
            <strong v-else class="text-secondary">{{ data.value }}</strong>
          </template>
          <template v-slot:cell(user)="data">
            <strong>{{ data.value }}</strong>
          </template>
          <template v-slot:table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
        </b-table>
      </div>
    </div>
    <div class="row justify-content-between">
      <div class="col-md-4">
        <b-pagination :total-rows="totalItems" v-model="currentPage" :per-page="perPage">
          <template v-slot:first-text><i class="fa fa-step-backward"></i></template>
          <template v-slot:prev-text><i class="fa fa-chevron-left"></i></template>
          <template v-slot:next-text><i class="fa fa-chevron-right"></i></template>
          <template v-slot:last-text><i class="fa fa-step-forward"></i></template>
        </b-pagination>
      </div>
      <div class="col-md-3">
        <b-form-group
          label="por página"
          label-cols-sm="4"
          label-cols-md="4"
          label-cols-lg="4"
          label-align-sm="right"
          label-size="sm"
        >
          <v-select v-model="perPage" :searchable="false" :clearable="false" :options="pageOptions"></v-select>
        </b-form-group>
      </div>
    </div>
  </div>
</template>
<script>
import CustomerService from '../../services/customer.service'

export default {
  props: ['customer'],

  data () {
    return {
      isBusy: true,
      items: [],
      columns: [
        { key: 'cite', label: 'Cite'},
        { key: 'date', label: 'Fecha'},
        { key: 'amount', label: 'Monto'},
        { key: 'state', label: 'Estado'},
        { key: 'user', label: 'Usuario'},
      ],
      pageOptions: [5, 10, 15],
      currentPage: 1,
      perPage: 5,
      totalItems: 0
    }
  },

  watch: {
    currentPage: {
      handler: function(value) {
        this.getCustomerQuotes()
      }
    },
    perPage: {
      handler: function(value) {
        this.getCustomerQuotes()
      }
    }
  },

  created(){
    this.getCustomerQuotes()
  },

  methods: {
    ShowQuotation(data) {
      this.$router.push({name: "ShowQuotation", params: { id: data.item.id }})
    },

    getCustomerQuotes: async function() {
      this.isBusy = true
      const response = await CustomerService.showCustomer(this.buildURL())
      if (response.status === 200) {
        this.items = response.data.data
        this.totalItems = response.data.meta.total
        this.isBusy = false
        this.$emit("success")
      }
    },

    buildURL() {
      let customer = `?id=${this.customer}`
      let current_page = `&page=${this.currentPage}`
      let per_page = `&per_page=${this.perPage}`
      return `customers/quotes${customer}${current_page}${per_page}`
    }
  }
}
</script>
<style scoped>
  .cite {
    text-decoration: underline;
    font-weight: bold;
    font-size: 1em;
  }
  >>> .pagination .page-item.active .page-link {
    background-color: #9e0207;
    border-color: #9e020754;
  }

  >>> .page-link:focus {
    box-shadow: 0 0 0 0.2rem #9e020754;
  }
</style>