<template>
  <div>
    <b-card no-body header-bg-variant="light">
      <template v-slot:header>
        <div>
          <span class="text-dark font-size-24 font-weight-bold">
            ADMINISTRACIÓN DE CUENTAS
          </span>
        </div>   
      </template>
      <!-- <pre>{{ $data }}</pre> -->
      <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase text-black">
        <b-tab title="Cuentas Por Cobrar" :title-link-class="linkClass(0)" lazy>
          <a-skeleton active :loading="tabReceivable"/>
          <fieldset v-if="!tabReceivable" class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <legend>Filtros:</legend>
            <div class="row my-2">
              <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <a-range-picker v-model="date" :locale="locale" :format="dateFormat" />
              </div>
              <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <v-select
                  label="business_name"
                  :filterable="false"
                  :options="customers"
                  v-model="customer"
                  @search="onSearchCustomer"
                  placeholder="Buscar cliente"
                >
                  <template slot="no-options">Buscar clientes..</template>
                  <template slot="option" slot-scope="customer">
                    <div>
                      <strong>{{ customer.business_name }}</strong>
                    </div>
                  </template>
                  <template slot="selected-option" slot-scope="customer">
                    <div>
                      <strong>{{ customer.business_name }}</strong>
                    </div>
                  </template>
                </v-select>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="d-table-cell w-100">
                  <v-select
                    v-model="office"
                    label="description"
                    :options="offices"
                    :reduce="office => office.id"
                    placeholder="Sucursal"
                  ></v-select>
                </div>
                <div class="d-table-cell align-middle">
                  <b-button @click="searchAccounts" variant="danger" class="ml-1" size="sm" style="height: 2.5em;">
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </div>
            </div>
          </fieldset>
          <grid-receivable v-show="!tabReceivable" v-on:receivable='receivable'></grid-receivable>
        </b-tab>
        <b-tab title="Cuentas Canceladas" :title-link-class="linkClass(1)" lazy>
          <a-skeleton active :loading="tabCancelled"/>
          <fieldset v-if="!tabCancelled" class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <legend>Filtros:</legend>
            <div class="row my-2">
              <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <a-range-picker v-model="date" :locale="locale" :format="dateFormat" />
              </div>
              <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5">
                <v-select
                  label="business_name"
                  :filterable="false"
                  :options="customers"
                  v-model="customer"
                  @search="onSearchCustomer"
                  placeholder="Buscar cliente"
                >
                  <template slot="no-options">Buscar clientes..</template>
                  <template slot="option" slot-scope="customer">
                    <div>
                      <strong>{{ customer.business_name }}</strong>
                    </div>
                  </template>
                  <template slot="selected-option" slot-scope="customer">
                    <div>
                      <strong>{{ customer.business_name }}</strong>
                    </div>
                  </template>
                </v-select>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="d-table-cell w-100">
                  <v-select
                    v-model="office"
                    label="description"
                    :options="offices"
                    :reduce="office => office.id"
                    placeholder="Sucursal"
                  ></v-select>
                </div>
                <div class="d-table-cell align-middle">
                  <b-button @click="searchAccounts" variant="danger" class="ml-1" size="sm" style="height: 2.5em;">
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </div>
            </div>
          </fieldset>
          <grid-cancelled v-show="!tabCancelled" v-on:cancelled='cancelled'></grid-cancelled>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import permission from '../../mixins/permission'
  import GridAccountReceivable from '../../components/account/GridAccountReceivable'
  import GridAccountCancelled from '../../components/account/GridAccountCancelled'
  import OfficeService from '../../services/office.service'
  import CustomerService from '../../services/customer.service'
  import locale from 'ant-design-vue/es/date-picker/locale/es_ES'
  import moment from 'moment'
  import 'moment/locale/es'

  export default {
    components: {
      'grid-receivable': GridAccountReceivable,
      'grid-cancelled': GridAccountCancelled,
    },

    mixins: [permission],

    data() {
      return {
        locale,
        moment,
        date: null,
        dateFormat: 'YYYY/MM/DD',
        office: null,
        offices: [],
        customer: null,
        customers: [],
        tabReceivable: true,
        tabCancelled: true,
        tabIndex: 0
      }
    },

    watch: {
      tabIndex(val) {
        if (val != 0 || val != 1) {
          this.tabReceivable = true
          this.tabCancelled = true
        }
      }
    },
    
    created() {
      this.listOffices()
    },

    methods: {
      searchAccounts() {
        let date = null
        if(this.date) {
          if(this.date[0] === this.date[1]) {
            this.date = null 
          } else {
            date = {
              initial_date: moment(this.date[0]).format('YYYY-MM-DD'),
              final_date: moment(this.date[1]).format('YYYY-MM-DD')
            }
          }
        }
        this.$bus.$emit('searchAccounts', {
          date: date, 
          office: this.office,
          customer: this.customer ? this.customer.id : null 
        })
      },

      listOffices: async function() {
        const offices = await OfficeService.listOffices()
        if (offices.status === 200) {
          this.offices = offices.data
        }
      },

      onSearchCustomer(search, loading) {
        loading(true)
        this.searchCustomer(loading, search, this)
      },

      searchCustomer: _.debounce(async (loading, search, vm) => {
        const data = {
          column: 'business_name',
          value: search
        }
        try {
          const customers = await CustomerService.searchCustomer(data)
          if (customers.status === 200) {
            vm.customers = customers.data.data
            loading(false)
          }
        } catch (err) {
          if (err.response.status === 404) {
            vm.customers = []
            loading(false)
          }
        }
      }, 350),

      receivable(e) {
        this.tabReceivable = e
      },

      cancelled(e) {
        this.tabCancelled = e
      },

      linkClass(idx) {
        if (this.tabIndex === idx) {
          return ['text-black']
        } else {
          return ['text-danger font-weight-bold']
        }
      }
    }
  }
</script>
<style scoped src="../../assets/css/date.css"></style>
<style scoped>
fieldset {
  background-color: #f6f6f6;
  border-radius: 4px;
}

legend {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  font-size: 17px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}
</style>