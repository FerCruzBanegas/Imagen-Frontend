<template>
  <div class="container">
    <div class="d-flex flex-wrap">
      <div class="mr-auto">
        <h6 class="font-weight-bold">LISTA DE ALQUILERES REALIZADOS</h6>
      </div>
      <div>
        <span class="font-weight-bold">Total registros({{ totalItems }})</span>
      </div>
    </div>
    <hr />
    <div class="d-flex flex-sm-row flex-column bg-custom">
      <div class="mr-auto p-2">
        <b-button @click="pdfListRentals" title="Descargar Lista PDF" size="sm" variant="danger" class="ml-2">
          <i class="fa fa-file-pdf-o"></i>
        </b-button>
        <!-- <b-button @click="excelListRental" title="Descargar Lista EXCEL" size="sm" variant="success" class="ml-2">
          <i class="fa fa-file-excel-o"></i>
        </b-button> -->
      </div>
      <div class="p-2">
        <b-form-group>
          <label class="d-inline-block" for="btn-radios-sort">
            <strong>Ordenar de manera: &nbsp;</strong>
          </label>
          <b-form-radio-group
            id="btn-radios-sort"
            v-model="sort"
            :options="sortItems"
            button-variant="outline-danger"
            size="sm"
            name="radio-btn-outline"
            buttons
          ></b-form-radio-group>
        </b-form-group>
      </div>
      <div class="p-2">
        <b-button @click="getRecordBillboard" title="Actualizar Tabla" size="sm" variant="dark" class="mr-2">
          <i class="fa fa-repeat"></i> Recargar
        </b-button>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <!-- <pre>{{ $data }}</pre> -->
        <b-table class="text-center" thead-class="bg-danger text-white" :busy="isBusy" fixed striped hover small :items="records" :fields="columns" responsive="sm" stacked="sm" :current-page="currentPage" show-empty>
          <template v-slot:empty="scope">
            <div class="text-center">
              <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
              <h6>No existen resultados</h6>
            </div>
          </template>
          <template #table-busy>
            <div class="text-center text-danger my-2">
              <b-spinner class="align-middle"></b-spinner>
            </div>
          </template>
          <template v-slot:head(date_start)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(date_end)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(amount_monthly)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(amount_total)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(customer)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(condition)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:head(opciones)="data">
            <span>{{ data.label.toUpperCase() }}</span>
          </template>
          <template v-slot:cell(date_start)="data">
            <strong>{{ data.value | formatDate('DD/MM/YYYY') }}</strong>
          </template>
          <template v-slot:cell(date_end)="data">
            <strong>{{ data.value | formatDate('DD/MM/YYYY') }}</strong>
          </template>
          <template v-slot:cell(amount_monthly)="data">
            <strong>{{ data.value | currency }}</strong>
          </template>
          <template v-slot:cell(amount_total)="data">
            <strong>{{ data.value | currency }}</strong>
          </template>
          <template v-slot:cell(customer)="data">
            <strong>{{ data.value }}</strong>
          </template>
          <template v-slot:cell(condition)="data">
            <span v-html="templateCondition(data.value)"></span>
          </template>
          <template v-slot:cell(opciones)="row">
            <b-button size="sm" class="mr-2" variant="outline-dark" @click="row.toggleDetails">
              <i v-if="row.detailsShowing" class="fa fa-eye-slash" aria-hidden="true"></i>
              <i v-else class="fa fa-eye" aria-hidden="true"></i>
            </b-button>
            <router-link :to="{path: `/servicios/alquileres/${row.item.id}`}">
              <b-button size="sm" class="mr-2" variant="outline-dark">
                <i class="fa fa-external-link" aria-hidden="true"></i>
              </b-button>
            </router-link>
          </template>
          <template #row-details="row">
            <b-card style="text-align: justify;">
              <span class="h6 font-weight-bold">RENOVACIONES</span>
              <div class="mb-2">
                <table>
                  <thead>
                    <tr>
                      <th style="background-color: #565656;" scope="col" width="20px">Nº</th>
                      <th style="background-color: #565656;" scope="col" width="80px">Fecha Inicio</th>
                      <th style="background-color: #565656;" scope="col" width="80px">Fecha Fin</th>
                      <th style="background-color: #565656;" scope="col" width="80px">M. Mensual</th>
                      <th style="background-color: #565656;" scope="col" width="80px">M. Total</th>
                      <th style="background-color: #565656;" scope="col" width="80px">Condición</th>
                    </tr>
                  </thead>
                  <tbody v-if="row.item.renewals.length > 0">
                    <tr v-for="(item, index) in row.item.renewals" :key="index">
                      <td data-label="Nº"><span>{{ index + 1 }}</span></td>
                      <td data-label="Fecha Inicio">
                        {{ item.date_start | formatDate('DD/MM/YYYY') }}
                      </td>
                      <td data-label="Fecha Fin">
                        {{ item.date_end | formatDate('DD/MM/YYYY') }}
                      </td>
                      <td data-label="M. Mensual">
                        {{ item.amount_monthly | currency }}
                      </td>
                      <td data-label="M. Total">
                        <div>{{ item.amount_total | currency  }}</div>
                      </td>
                      <td data-label="Condición">
                        <b-badge>{{ item.condition }}</b-badge>
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div class="container" v-if="row.item.renewals.length === 0">
                  <div class="d-flex justify-content-center row" style="background-color: #dcdcdc;">
                    <div class="text-center">
                      <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i> 
                      <div class="p-2"><small class="font-weight-bold">Sin datos.</small></div>
                    </div>
                  </div>
                </div>
              </div>
            </b-card>
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
          label="Por página"
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
import BillboardService from '../../services/billboard.service'


export default {
  props: ['billboard'],

  data() {
    return {
      records: [],
      isBusy: false,
      columns: [
        { key: 'date_start', label: 'Fecha Inicio'},
        { key: 'date_end', label: 'Fecha Fin'},
        { key: 'amount_monthly', label: 'M. Mensual'},
        { key: 'amount_total', label: 'M. Total'},
        { key: 'customer', label: 'Cliente'},
        { key: 'condition', label: 'Condición'},
        'opciones',
      ],
      sort: 'desc',
      sortItems: [
        { text: 'ASC ▲', value: 'asc' },
        { text: 'DESC ▼', value: 'desc' },
      ],
      pageOptions: [5, 10, 15],
      currentPage: 1,
      perPage: 5,
      totalItems: 0
    }
  },

  watch: {
    sort: {
      handler: function(value) {
        this.getRecordBillboard()
      }
    },
    currentPage: {
      handler: function(value) {
        this.getRecordBillboard()
      }
    },
    perPage: {
      handler: function(value) {
        this.getRecordBillboard()
      }
    }
  },

  created() {
    // Promise.all([this.listCustomers(), this.listBillboards()])
    // .then(() =>{
    //   this.success = false
    // })
    this.getRecordBillboard()
  },

  methods: {
    async getRecordBillboard() {
      this.isBusy = true
      try {
        const request = await BillboardService.getRecordBillboard(this.buildURL())
        if (request.status === 200) {
          this.records = request.data.data
          this.totalItems = request.data.meta.total
          this.isBusy = false
          this.$emit("historial", false)
        }
      } catch (err) {
        console.log(err)
      }
    },

    buildURL() {
      let billboard = `?id=${this.billboard}`
      let sort = `&sort=${this.sort}`
      let current_page = `&page=${this.currentPage}`
      let per_page = `&per_page=${this.perPage}`
      return `/billboards/record${billboard}${sort}${current_page}${per_page}`
    },

    templateCondition(condition) {
      switch (condition) {
        case 'Activo':
          return (
            "<span class='badge badge-custom-6'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
          break;
        case 'Terminado':
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
          break;
        case 'Renovado':
          return (
            "<span class='badge badge-custom-5'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
      }
    },

    async pdfListRentals() {
      this.$store.dispatch("showLoader")
      try {
        const response = await BillboardService.pdfListRentals({rentals: this.records, billboard: this.billboard})
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = "Lista.pdf"
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },

    async excelListRental() {
      this.$store.dispatch("showLoader")
      try {
        const response = await BillboardService.excelListRentals({rentals: this.records})
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = "Lista.xlsx"
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },
  }
}
</script>
<style scoped src="../../assets/css/table_cost.css"></style>
<style scoped>
>>> .pagination .page-item.active .page-link {
  background-color: #9e0207;
  border-color: #9e020754;
}

>>> .page-link:focus {
  box-shadow: 0 0 0 0.2rem #9e020754;
}

.bg-custom {
  background-color: #d8d8d8;
}
</style>