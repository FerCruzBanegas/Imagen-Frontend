<template>
  <div class="container" v-if="success">
    <a-spin :spinning="loading">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
          <!-- <pre>{{ $data }}</pre> -->
          <strong>
            <label for="state">Seleccione su reporte :</label>
          </strong>
          <div class="d-table-cell w-100">
            <v-select 
              v-model="report"
              :clearable= "false"
              :options="reports"
            >
              <template slot="option" slot-scope="option">
                <div class="d-center">
                  {{ option.label }}
                </div>
              </template>
            </v-select>
          </div>
          <div class="d-table-cell align-middle">
            <b-button :disabled="report === null ? true : false" @click="getReport" class="ml-1" size="sm" style="height: 2.5em;">
              <i class="fa fa-search"></i>
            </b-button>
          </div>
        </div>
      </div>
      <div class="mt-2">
        <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
          <legend>Filtros:</legend>
          <div class="row my-2">
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <a-range-picker v-model="date" :locale="locale" :format="dateFormat" />
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <v-select
                v-model="office"
                label="description"
                :options="offices"
                :reduce="office => office.id"
                placeholder="Sucursal.."
              ></v-select>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <v-select
                label="business_name"
                :filterable="false"
                :options="customers"
                v-model="customer"
                @search="onSearchCustomer"
                placeholder="Cliente.."
              >
                <template slot="no-options">Buscar Cliente</template>
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
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <v-select
                v-model="user"
                label="name"
                :options="users"
                :reduce="user => user.id"
                placeholder=" Vendedor.."
              ></v-select>
            </div>
          </div>
        </fieldset>
      </div>
      <div class="d-flex justify-content-end pt-2"><div><strong>Total {{ items.length }} ítems</strong></div></div>
      <div v-if="items.length > 0" class="row mt-2">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div  class="p-2" style="background-color: #e8e8e8;">
            <b-button @click="downloadPdf" title="Descargar PDF" variant="danger" class="mr-2">
              <i class="fa fa-file-pdf-o"></i>
            </b-button>
            <b-button @click="downloadExcel" title="Descargar EXCEL" variant="success" class="mr-2">
              <i class="fa fa-file-excel-o"></i>
            </b-button>
          </div>
          <div v-if="report.type == 1">
            <b-table class="text-center" thead-class="bg-danger text-white" small fixed striped hover responsive="sm" stacked="sm" show-empty :items="items">
            </b-table>
            <div class="container text-center">
              <div class="row border border-dark">
                <div class="col-md-2 ml-auto border">
                  <div class="h5 font-weight-bold pt-2">TOTAL (BS)&nbsp:</div>
                </div>
                <div class="col-md-2 border" style="background: #4e4e4e;">
                  <div class="text-white h6 font-weight-bold pt-2">{{ subTotal | currency }}</div>
                </div>
                <div v-if="report.value === 'reports/total_quotations'" class="col-md-2 border" style="background: #4e4e4e;">
                  <div class="text-white h6 font-weight-bold pt-2">{{ subTotalCancelado | currency }}</div>
                </div>
                <div v-if="report.value === 'reports/total_quotations'" class="col-md-2 border" style="background: #4e4e4e;">
                  <div class="text-white h6 font-weight-bold pt-2">{{ subTotalSaldo | currency }}</div>
                </div>
              </div>
            </div>
          </div>
          <table-account-customer v-if="report.type == 2" :items="items"></table-account-customer>
        </div>
      </div>
      <div v-else class="d-flex justify-content-center" style="background-color: #e8e8e8;">
        <div class="text-center p-2">
          <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
          <h6>Sin Datos Disponibles</h6>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
  import formatter from '../../mixins/formatter'
  import locale from 'ant-design-vue/es/date-picker/locale/es_ES'
  import moment from 'moment'
  import 'moment/locale/es'
  import OfficeService from '../../services/office.service'
  import ReportService from '../../services/report.service'
  import CustomerService from '../../services/customer.service'
  import UserService from '../../services/user.service'
  import TableAccountCustomer from '../../components/widgets/Tables/TableAccountCustomer.vue'

  export default {
    mixins: [formatter],

    data() {
      return {
        success: false,
        loading: false,
        locale,
        moment,
        report: null,
        reports: [
          { label: 'Total Importe Cotizaciones', value: 'reports/total_quotations', type: 1 },
          { label: 'Reporte de Facturación', value: 'reports/invoice_report', type: 1 },
          { label: 'Estado de Cuentas (Clientes)', value: 'reports/get_accounts', type: 2},
          { label: 'Lista Cotizaciones Emitidas (General)', value: 'reports/quotation_general', type: 1 },
          { label: 'Lista Cotizaciones Emitidas (Pendientes)', value: 'reports/quotation_pending', type: 1 },
          { label: 'Lista Cotizaciones Emitidas (Aprobadas)', value: 'reports/quotation_approved', type: 1 },
          { label: 'Lista Cotizaciones Emitidas (Ejecutadas)', value: 'reports/quotation_executed', type: 1 },
        ],
        items: [],
        office: null,
        offices: [],
        customer: null,
        customers: [],
        user: null,
        users: [],
        dateFormat: 'YYYY/MM/DD',
        date: null,
      }
    },

    components: {
      'table-account-customer': TableAccountCustomer
    },

    watch: {
      report() {
        this.items = []
      }
    },

    computed: {
      subTotal() {
        return this.items.reduce((acc, item) => acc + Number(this.toFloat(item.monto)), 0)
      },

      subTotalCancelado() {
        return this.items.reduce((acc, item) => acc + Number(this.toFloat(item.cancelado)), 0)
      },

      subTotalSaldo() {
        return this.items.reduce((acc, item) => acc + Number(this.toFloat(item.saldo)), 0)
      },
    },

    created() {
      Promise.all([this.listOffices(), this.listSeller()])
      .then(() =>{
        this.success = true
      })
    },

    methods: {
      listOffices: async function() {
        const offices = await OfficeService.listOffices()
        if (offices.status === 200) {
          this.offices = offices.data
        }
      },

      listSeller: async function() {
        const users = await UserService.listSeller()
        if (users.status === 200) {
          this.users = users.data
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

      test: async function() {
        // this.loading = true
        try {
          let config = {
            method: 'post',
            url: 'reports/get_accounts',
            data: {
              // initial_date: moment(this.date[0]).format('YYYY-MM-DD'),
              // final_date: moment(this.date[1]).format('YYYY-MM-DD'),
              office: this.office,
              customer: this.customer ? this.customer.id : null,
              user: this.user
            }
          }
          const response = await ReportService.getReport(config)
          if (response.status === 200) {
            // console.log(response)
            this.items = response.data.data
            // console.log(this.items)
            // this.loading = false
          }
        } catch (err) {
          this.loading = false
          // console.log(err)
        }
      },

      getReport: async function(quotation) {
        this.loading = true
        try {
          let config = {
            method: 'post',
            url: this.report.value,
            data: {
              initial_date: moment(this.date[0]).format('YYYY-MM-DD'),
              final_date: moment(this.date[1]).format('YYYY-MM-DD'),
              office: this.office,
              customer: this.customer ? this.customer.id : null,
              user: this.user
            }
          }
          const response = await ReportService.getReport(config)
          if (response.status === 200) {
            // console.log(response)
            this.items = response.data
            this.loading = false
          }
        } catch (err) {
          this.loading = false
          // console.log(err)
        }
      },

      async downloadPdf() {
        try {
          this.loading = true

          let items = this.items.map(obj => {
            let rObj = Object.assign({}, obj)
            if (this.report.type === 1) { 
              rObj.monto = Number(this.toFloat(rObj.monto))
              if (rObj.cancelado && rObj.saldo) {
                rObj.cancelado = Number(this.toFloat(rObj.cancelado))
                rObj.saldo = Number(this.toFloat(rObj.saldo))
              }
              return rObj
            }
            return rObj
          })
        
          const data = { 
            title: this.reports.filter(obj => obj.value === this.report.value)[0].label, 
            ... this.office && { office: this.offices.filter(obj => obj.id === this.office)[0].description }, 
            ... this.customer && { customer: this.customer.business_name },
            ... this.report.type === 1 && { columns: Object.keys(items[0]) },
            date: { initial_date: moment(this.date[0]).format('YYYY-MM-DD'), final_date: moment(this.date[1]).format('YYYY-MM-DD') },
            type: this.report.type,
            items: items
          };

          const response = await ReportService.downloadPdf({data: data})
          if (response.status === 200) {
            let blob = new Blob([response.data])
            let link = document.createElement("a")
            link.href = window.URL.createObjectURL(blob)
            link.download = "Reporte.pdf"
            link.click()
            this.loading = false
          }
        } catch (err) {
          this.loading = false
        }
      },

      async downloadExcel() {
        try {
          this.loading = true
          const response = await ReportService.downloadExcel({data: this.items})
          if (response.status === 200) {
            let blob = new Blob([response.data])
            let link = document.createElement("a")
            link.href = window.URL.createObjectURL(blob)
            link.download = "Reporte.xlsx"
            link.click()
            this.loading = false
          }
        } catch (err) {
          this.loading = false
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