<template>
  <div class="container" v-if="success">
  	<b-card no-body header-bg-variant="primary">
	    <b-tabs 
        v-model="tabIndex"
	      small card 
	      active-nav-item-class="font-weight-bold text-uppercase"
	    >
        <b-tab title="DATOS">
          <div class="container">
            <div class="row bg-secondary">
              <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                <div class="d-flex justify-content-between my-2">
                	<span class="text-white font-weight-bold">Registrado:</span>
                  <span class="text-white font-weight-bold">{{ customer.created | formatDate('DD/MM/YYYY') }}</span>
                </div>
              </div>
              <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                <div class="d-flex justify-content-between my-2">
                	<span class="text-white font-weight-bold">Actualizado:</span>
                  <span class="text-white font-weight-bold">{{ customer.updated | formatDate('DD/MM/YYYY') }}</span>
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div class="font-weight-bold pt-2 list">Nombre</div>
                <p>{{ customer.business_name }}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div class="font-weight-bold pt-2 list">NIT</div>
                <p>{{ customer.nit }}</p>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div class="font-weight-bold pt-2 list">Teléfono</div>
                <p>{{ customer.phone }}</p>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div class=" font-weight-bold pt-2 list">Dirección</div>
                <p v-if="customer.address">{{ customer.address }}</p>
                <p v-else>S/D</p>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div class=" font-weight-bold pt-2 list">Correo</div>
                <p v-if="customer.email">{{ customer.email }}</p>
                <p v-else>S/D</p>
              </div>
              <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                <div class=" font-weight-bold pt-2 list">Ciudad</div>
                <p>{{ customer.city }}</p>
              </div>
            </div>
          </div>
        </b-tab>
	      <b-tab title="COTIZACIONES" lazy>
          <a-skeleton active :loading="tabQuotes"/>
          <table-quotes :customer="id" v-show="!tabQuotes" @success="tabQuotes = false"></table-quotes>
	      </b-tab>
	    </b-tabs>
	  </b-card>
  </div>
</template>
<script>
import Customer from '../../models/Customer'
import CustomerService from '../../services/customer.service'
import TableQuotes from '../../components/customer/TableQuotes'

export default {
  data () {
    return {
      id: this.$route.params.id,
      success: false,
      customer: new Customer(),
      tabIndex: 0,
      tabQuotes: true,
    }
  },

  components: {
    'table-quotes': TableQuotes,
  },

  watch: {
    tabIndex(val) {
      if (val != 0 || val != 1) {
        this.tabQuotes = true
      }
    }
  },

  created() {
    this.showCustomer()
  },

  methods: {
    showCustomer: async function() {
      const response = await CustomerService.showCustomer(`customers/${this.id}/detail`)
      if (response.status === 200) {
        this.customer = response.data.data
        this.success = true
      }
    }
  }
}
</script>