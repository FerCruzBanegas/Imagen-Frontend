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
              :reduce="state => state.value"
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
            <b-button :disabled="report === null ? true : false" @click="getReport" class="ml-1 btn-add" size="sm">
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
      <!-- <div class="row mt-2">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div v-if="items.length > 0" class="p-2" style="background-color: #e8e8e8;">
            <b-button @click="downloadPdf" title="Descargar PDF" variant="danger" class="mr-2">
              <i class="fa fa-file-pdf-o"></i>
            </b-button>
            <b-button @click="downloadExcel" title="Descargar EXCEL" variant="success" class="mr-2">
              <i class="fa fa-file-excel-o"></i>
            </b-button>
          </div>
          <b-table class="text-center" thead-class="bg-danger text-white" small fixed striped hover responsive="sm" stacked="sm" show-empty :items="items">
            <template v-slot:empty="scope">
              <div class="text-center">
                <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
                <h6>No existen resultados</h6>
              </div>
            </template>
          </b-table>
          <div class="container text-center">
            <div class="row border border-dark">
              <div class="col-md-2 ml-auto border">
                <div class="h5 font-weight-bold pt-2">TOTAL (BS)&nbsp:</div>
              </div>
              <div class="col-md-2 border" style="background: #4e4e4e;">
                <div class="text-white h6 font-weight-bold pt-2">{{ subTotal | currency }}</div>
              </div>
              <div v-if="report === 'reports/total_quotations'" class="col-md-2 border" style="background: #4e4e4e;">
                <div class="text-white h6 font-weight-bold pt-2">{{ subTotalCancelado | currency }}</div>
              </div>
              <div v-if="report === 'reports/total_quotations'" class="col-md-2 border" style="background: #4e4e4e;">
                <div class="text-white h6 font-weight-bold pt-2">{{ subTotalSaldo | currency }}</div>
              </div>
            </div>
          </div>
        </div>
      </div> -->
      <b-button @click="test" title="Descargar PDF" variant="danger" class="mr-2">
        <i class="fa fa-file-pdf-o"></i>
      </b-button>
      <table-account-customer :items="items"></table-account-customer>
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
          { label: 'Total Importe Cotizaciones', value: 'reports/total_quotations'},
          { label: 'Reporte de Facturación', value: 'reports/invoice_report'},
          { label: 'Lista Cotizaciones Emitidas (General)', value: 'reports/quotation_general'},
          { label: 'Lista Cotizaciones Emitidas (Pendientes)', value: 'reports/quotation_pending'},
          { label: 'Lista Cotizaciones Emitidas (Aprobadas)', value: 'reports/quotation_approved'},
          { label: 'Lista Cotizaciones Emitidas (Ejecutadas)', value: 'reports/quotation_executed'},
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
            console.log(this.items)
            // this.loading = false
          }
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      },

      getReport: async function(quotation) {
        this.loading = true
        try {
          let config = {
            method: 'post',
            url: this.report,
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
          console.log(err)
        }
      },

      async downloadPdf() {
        try {
          this.loading = true
          let title = this.reports.filter(obj => obj.value === this.report)
          let date = {
            initial_date: moment(this.date[0]).format('YYYY-MM-DD'),
            final_date: moment(this.date[1]).format('YYYY-MM-DD'),
          }
          let items = this.items.map(obj => {
            let rObj = Object.assign({}, obj)
            rObj.monto = Number(this.toFloat(rObj.monto))
            if (rObj.cancelado && rObj.saldo) {
              rObj.cancelado = Number(this.toFloat(rObj.cancelado))
              rObj.saldo = Number(this.toFloat(rObj.saldo))
            }
            return rObj
          })
          const response = await ReportService.downloadPdf({data: items, title: title[0].label, date: date})
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
<style scoped>
>>> .ant-calendar-picker:hover .ant-calendar-picker-input:not(.ant-input-disabled) {
    border-color: #9e0207;
}

.btn-add {
  height: 2.5em;
}

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