<template>
  <section v-if="success">
    <modal-detail
      :title="'Detalles de OT'"
      :visible="visibleDetail"
      @hide="hideModalDetail"
    >
      <div v-if="detail">
        <a-spin :spinning="loading">
          <div class="container">
            <div class="row d-flex">
              <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <legend>Artes Guías:</legend>
                <b-table class="text-center" thead-class="bg-danger text-white" :busy="isBusyProduct" small fixed striped hover :items="detail.products" :fields="columnsProduct" :tbody-tr-class="'table-secondary'" responsive="sm" stacked="sm" show-empty>
                  <template v-slot:cell(item)="data">
                    <strong> {{ data.index + 1 }} </strong>
                  </template>
                  <template v-slot:head(item)="data">
                    <span>{{ data.label.toUpperCase() }}</span>
                  </template>
                  <template v-slot:empty="scope">
                    <div class="text-center">
                      <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
                      <h6>No existen resultados</h6>
                    </div>
                  </template>
                  <template v-slot:head(name)="data">
                    <span>{{ data.label.toUpperCase() }}</span>
                  </template>
                  <template v-slot:head(quantity)="data">
                    <span>{{ data.label.toUpperCase() }}</span>
                  </template>
                  <template v-slot:head(dimension)="data">
                    <span>{{ data.label.toUpperCase() }}</span>
                  </template>
                  <template v-slot:head(opciones)="data">
                    <span>{{ data.label.toUpperCase() }}</span>
                  </template>
                  <template v-slot:cell(name)="data">
                    <strong>{{ data.value }}</strong>
                  </template>
                  <template v-slot:cell(quantity)="data">
                    <strong>{{ data.value }}</strong>
                  </template>
                  <template v-slot:cell(dimension)="data">
                    <strong>{{ data.value }}</strong>
                  </template>
                  <template v-slot:cell(opciones)="row">
                    <b-button size="sm" class="mr-2" variant="outline-dark" @click="row.toggleDetails">
                      <i v-if="row.detailsShowing" class="fa fa-eye-slash" aria-hidden="true"></i>
                      <i v-else class="fa fa-eye" aria-hidden="true"></i>
                    </b-button>
                    <b-button @click="printDesign(row)" size="sm" class="mr-2" variant="outline-warning">
                      <i class="fa fa-download" aria-hidden="true"></i>
                    </b-button>
                  </template>
                  <template #row-details="row">
                    <b-card>
                      <div class="container">
                        <div class="row bg-secondary">
                          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                            <div class="d-flex justify-content-between my-2">
                              <span class="text-white font-weight-bold">Registrado:</span>
                              <span class="text-white font-weight-bold">{{ row.item.design.created | formatDate('DD/MM/YYYY') }}</span>
                            </div>
                          </div>
                          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                            <div class="d-flex justify-content-between my-2">
                              <span class="text-white font-weight-bold">Actualizado:</span>
                              <span class="text-white font-weight-bold">{{ row.item.design.updated | formatDate('DD/MM/YYYY') }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="row bg-light text-justify">
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Nombre Archivo:</div>
                            <p>{{ row.item.design.filename }}</p>
                          </div>
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Máquina(s):</div>
                            <p>
                              <span v-for="(machine, index) in row.item.design.machines" :key="index">
                                {{ machine }}{{ index+1 < row.item.design.machines.length ? ',' : '' }}
                              </span>
                            </p>
                          </div>
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Calidad:</div>
                            <p>{{ row.item.design.quality }}</p>
                          </div>
                        </div>
                        <div class="row text-justify">
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Material:</div>
                            <p>{{ row.item.design.material }}</p>
                          </div>
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Dimensiones CORTE:</div>
                            <p>{{ row.item.design.cutting_dimension }}</p>
                          </div>
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Dimensiones IMPRESIÓN:</div>
                            <p>{{ row.item.design.print_dimension }}</p>
                          </div>
                        </div>
                        <div class="row bg-light text-justify">
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Acabado:</div>
                            <p>{{ row.item.design.finished }}</p>
                          </div>
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Prueba de Impresión:</div>
                            <p>{{ row.item.design.reloadWorkOrder_print }}</p>
                          </div>
                          <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                            <div class="font-weight-bold pt-2 list">Referencia:</div>
                            <p>{{ row.item.design.reference }}</p>
                          </div>
                        </div>
                        <div class="row text-justify">
                          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div class="font-weight-bold pt-2 list">Fecha APROBADA COTIZACIÓN:</div>
                            <p>{{ row.item.design.quote_approved_date | formatDate('DD/MM/YYYY') }}</p>
                          </div>
                          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6">
                            <div class="font-weight-bold pt-2 list">Fecha de APROBACIÓN DISEÑO:</div>
                            <p>{{ row.item.design.design_approved_date }}</p>
                          </div>
                        </div>
                        <div class="row text-center">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                            <div class="text-left">
                              <strong>Imágenes del diseño:</strong>
                            </div>
                            <div v-if="row.item.design.support_path">
                              <div class="wrap">
                                <div class="column" v-on:click.prevent="showImageTable(row.item.design.path)">
                                  <img :src="row.item.design.path">
                                </div>
                              </div>
                              <div class="wrap">
                                <div class="column" v-on:click.prevent="showImageTable(row.item.design.support_path)">
                                  <img :src="row.item.design.support_path">
                                </div>
                              </div>
                            </div>
                            <div v-else class="thumbnail">
                              <div class="column" v-on:click.prevent="showImageTable(row.item.design.path)">
                                <img :src="row.item.design.path">
                              </div>
                            </div>
                            <div style="display: inline-table;">
                              <strong>Click en la imagen para agrandarla.</strong>
                            </div>
                            <vue-easy-lightbox
                              escDisabled
                              moveDisabled
                              :visible="showImgTable"
                              :imgs="imgsTable"
                              @hide="hideImageTable"
                            ></vue-easy-lightbox>
                          </div>
                        </div>
                      </div>
                    </b-card>
                  </template>
                </b-table>
              </fieldset>
            </div>
            <div class="row d-flex mt-2">
              <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <legend>Tareas:</legend>
                <div class="d-flex flex-sm-row flex-column">
                  <div class="mr-auto p-2">
                    <button @click="successTask" type="button" class="btn btn-secondary btn-with-addon text-nowrap">
                      <span class="btn-addon">
                        <i class="btn-addon-icon fe fe-check-circle"  />
                      </span>
                      Guardar Cambios
                    </button>
                  </div>
                  <div class="p-2">
                    <span class="font-weight-bold">Total tareas asignadas ({{ detail.total_tasks }})</span>
                  </div>
                </div>
                <!-- <pre>{{ $data.detail }}</pre> -->
                <div class="mb-2">
                  <table>
                    <thead>
                      <tr>
                        <th scope="col" width="20px">Nº</th>
                        <th scope="col" width="100px">Descripción</th>
                        <th scope="col" width="30px">Prioridad</th>
                        <th scope="col" width="90px">Encargado</th>
                        <th scope="col" width="80px">Fecha Inicio</th>
                        <th scope="col" width="80px">Fecha Entrega</th>
                        <th scope="col" width="50px">Realizado</th>
                      </tr>
                    </thead>
                    <tbody v-if="detail.tasks.length > 0">
                      <tr v-for="(item, index) in detail.tasks" :key="index">
                        <td data-label="Nº"><span>{{ index + 1 }}</span></td>
                        <td data-label="Descripción">
                          {{ item.description }}
                        </td>
                        <td data-label="Prioridad">
                          {{ item.priority }}
                        </td>
                        <td data-label="Encargado">
                          {{ item.employee_id.name }}
                        </td>
                        <td data-label="Fecha Inicio">
                          <div>{{ item.date_init | formatDate('DD/MM/YYYY LT') }}</div>
                        </td>
                        <td data-label="Fecha Entrega">
                          <strong v-if="item.date_end">{{ item.date_end | formatDate('DD/MM/YYYY') }}</strong>
                          <b-badge v-else variant="dark">PENDIENTE</b-badge>
                        </td>
                        <td data-label="Realizado">
                          <input :disabled="item.date_end" v-model="item.completed" type="checkbox" class="k-checkbox">
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div class="container" v-if="detail.tasks.length === 0">
                    <div class="d-flex justify-content-center row" style="background-color: #dcdcdc;">
                      <div class="text-center">
                        <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i> 
                        <div class="p-2"><small class="font-weight-bold">Sin tareas asignadas</small></div>
                      </div>
                    </div>
                  </div>
                </div>
              </fieldset>
            </div>
          </div>
        </a-spin>
      </div>
    </modal-detail>
    <div class="container">
      <div class="d-flex flex-wrap">
        <div class="mr-auto">
          <h3 class="font-weight-bold">LISTA DE TRABAJOS PENDIENTES</h3>
        </div>
        <div>
          <span class="font-weight-bold">Total trabajos pendientes ({{ totalItems }})</span>
        </div>
      </div>
      <hr />
      <div class="d-flex flex-sm-row flex-column bg-custom">
        <div class="mr-auto p-2">
          <b-button @click="pdfListPendingWorkOrder" title="Descargar Lista PDF" variant="danger" class="ml-2">
            <i class="fa fa-file-pdf-o"></i>
          </b-button>
          <b-button @click="excelListPendingWorkOrder" title="Descargar Lista EXCEL" variant="success" class="ml-2">
            <i class="fa fa-file-excel-o"></i>
          </b-button>
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
          <b-button @click="reloadWorkOrder" title="Actualizar Tabla" variant="dark" class="mr-2">
            <i class="fa fa-repeat"></i> Recargar
          </b-button>
        </div>
      </div>
      <div class="row d-flex">
        <div v-for="(workorder, index) in workorders" :key="index" class="col-12 col-md-4 mb-4 mt-2">
          <div class="card border-light shadow" :style="{ 'background-color': workorder.office }">
            <div class="card-body d-flex-row">
              <div class="d-flex flex-sm-row flex-column">
                <div class="mr-auto p-2">
                  <span class="mb-0 font-weight-bold">OT Nº: <span style="color: #9e0207;">{{ workorder.number }}</span></span>
                </div>
                <div class="p-2">
                  <span class="cite" @click="printQuotation(workorder.quotation.id)">{{ workorder.quotation.cite }}</span>
                </div>
              </div>
              <fieldset class="fieldset col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <legend class="legend">Info:</legend>
                <div class="card-text mb-2">
                  <span class="mb-0 font-weight-bold">FECHA DE INICIO: </span>
                  <span>{{ workorder.opening_date | formatDate('DD/MM/YYYY') }}</span> 
                </div>
                <div class="card-text mb-2">
                  <span class="mb-0 font-weight-bold">FECHA DE ESTIMADA: </span> 
                  <span>{{ workorder.estimated_date | formatDate('DD/MM/YYYY') }}</span>
                </div>
                <div class="card-text mb-2">
                  <span class="mb-0 font-weight-bold">RESPONSABLES:</span> 
                  <span v-for="(employee, sindex) in workorder.employees" :key="sindex">
                    {{ employee.name }}{{ sindex+1 < workorder.employees.length ? ',' : '' }}
                  </span>
                </div>
                <div class="card-text mb-2">
                  <span class="mb-0 font-weight-bold">TIPO DE TRABAJO: </span> 
                  <span>{{ workorder.type_work }}</span>
                </div>
              </fieldset>
              <div class="w-100 pb-1"></div>
            </div>
            <div class="card-footer text-muted p-2">
              <div class="d-flex flex-sm-row flex-column">
                <div class="mr-auto p-2">
                  <span class="mb-0 font-weight-bold">{{ workorder.days }} Días en Ejecución.</span>
                </div>
                <div class="p-2">
                  <b-button @click="setDetailWorkOrder(workorder)" class="mr-2" size="sm" variant="dark">
                    <i class="fa fa-search-plus" aria-hidden="true"></i>
                  </b-button>
                  <b-button @click="printWorkOrder(workorder)" size="sm" variant="secondary">
                    <i class="fa fa-list-alt" aria-hidden="true"></i>
                  </b-button>
                </div>
              </div>
            </div>
          </div>
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
  </section>
</template>
<script>
import DesignService from '../../services/design.service'
import WorkOrderService from '../../services/workorder.service'
import TaskService from '../../services/task.service'
import QuotationService from "../../services/quotation.service"
import ModalDetail from "../../components/widgets/Modals/ModalDetail.vue"

export default {
  data() {
    return {
      success: false,
      visibleDetail: false,
      loading: false,
      workorders: null,
      detail: null,
      isBusyProduct: false,
      columnsProduct: [
        'item',
        { key: 'name', label: 'Nombre'},
        { key: 'quantity', label: 'Cantidad'},
        { key: 'dimension', label: 'Dimensión'},
        'opciones',
      ],
      isBusyTask: false,
      columnsTask: [
        'item',
        { key: 'description', label: 'Descripción'},
        { key: 'priority', label: 'Prioridad'},
        { key: 'date_init', label: 'Fecha Inicio'},
        { key: 'date_end', label: 'Fecha Entrega'},
        { key: 'completed', label: 'Realizado'},
      ],
      imgsTable: '',
      showImgTable: false,
      pageOptions: [6, 12, 18],
      currentPage: 1,
      perPage: 6,
      totalItems: 0,
      sort: 'desc',
      sortItems: [
        { text: 'ASC ▲', value: 'asc' },
        { text: 'DESC ▼', value: 'desc' },
      ],
    }
  },

  watch: {
    sort: {
      handler: function(value) {
        this.reloadWorkOrder()
      }
    },
    currentPage: {
      handler: function(value) {
        this.reloadWorkOrder()
      }
    },
    perPage: {
      handler: function(value) {
        this.reloadWorkOrder()
      }
    }
  },

  components: {
    "modal-detail": ModalDetail,
  },

  created() {
    this.showWorkOrder()
  },

  methods: {
    showImageTable(img) {
      if (img) {
        this.imgsTable = img
        this.showImgTable = true
      }
    },

    hideImageTable() {
      this.showImgTable = false
    },

    reloadWorkOrder() {
      this.$store.dispatch("showLoader")
      this.showWorkOrder()
      .then(() => {
        this.$store.dispatch("hideLoader")
      })
    },

    showWorkOrder: async function() {
      const response = await WorkOrderService.showWorkOrder(this.buildURL())
      if (response.status === 200) {
        this.workorders = response.data.data
        this.totalItems = response.data.meta.total
        this.success = true
      }
    },

    buildURL() {
      let sort = `?sort=${this.sort}`
      let current_page = `&page=${this.currentPage}`
      let per_page = `&per_page=${this.perPage}`
      return `workorders/pending${sort}${current_page}${per_page}`
    },

    hideModalDetail() {
      this.detail = null
      this.visibleDetail = false
    },

    setDetailWorkOrder(workorder) {
      this.detail = {
        products: workorder.products,
        total_tasks: workorder.total_tasks,
        tasks: workorder.tasks_items,
      }

      this.visibleDetail = true
    },

    async pdfListPendingWorkOrder() {
      this.$store.dispatch("showLoader")
      try {
        const response = await WorkOrderService.pdfListPendingWorkOrder({workOrders: this.workorders})
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

    async excelListPendingWorkOrder() {
      this.$store.dispatch("showLoader")
      try {
        const response = await WorkOrderService.excelListPendingWorkOrder({workOrders: this.workorders})
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

    async successTask() {
      this.loading = true

      let tasksItems = this.detail.tasks.filter(item => {
        return item.completed === true && item.date_end === null
      }).map(obj => obj.id)

      try {
        const tasks = await TaskService.closeTasks({tasks: tasksItems})
        if (tasks.status === 200) {
          this.detail.tasks = this.detail.tasks.map(obj => tasks.data.data.find(o => o.id === obj.id) || obj)
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    async printQuotation(id) {
      try {
        this.$store.dispatch("showLoader")
        const response = await QuotationService.downloadQuotationSummary(id)
        if (response.status === 200) {
          let file = new Blob([response.data], {type: 'application/pdf'})
          let fileUrl = URL.createObjectURL(file)
          window.open(fileUrl) 
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },

    async printWorkOrder(item) {
      try {
        this.$store.dispatch("showLoader")
        let workOrder = {
          cite: item.quotation.cite,
          attends: item.quotation.attends,
          attends_phone: item.quotation.attends_phone,
          installment: item.quotation.installment,
          work_order: {
            id: item.id,
            number: item.number,
            opening_date: item.opening_date,
            estimated_date: item.estimated_date,
            closing_date: item.closing_date,
            type_work: item.type_work,
            note: item.note,
            name_staff: item.name_staff,
            address_work: item.address_work,
            city_id: item.city_id,
            employees: item.employees,
          }
        }
        const response = await WorkOrderService.downloadWorkOrder({workOrder: workOrder})
        if (response.status === 200) {
          let file = new Blob([response.data], {type: 'application/pdf'})
          let fileUrl = URL.createObjectURL(file)
          window.open(fileUrl) 
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },

    async printDesign(row) {
      try {
        this.loading = true
        const response = await DesignService.downloadDesign({design: row.item.design.id})
        if (response.status === 200) {
          let file = new Blob([response.data], {type: 'application/pdf'})
          let fileUrl = URL.createObjectURL(file)
          window.open(fileUrl) 
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },
  }
}
</script>
<style scoped src="../../assets/css/table.css"></style>
<style scoped>
>>> .pagination .page-item.active .page-link {
  background-color: #9e0207;
  border-color: #9e020754;
}

>>> .page-link:focus {
  box-shadow: 0 0 0 0.2rem #9e020754;
}
.thumbnail {
  margin-left: auto;
  margin-right: auto;
  width: 200px; 
  height: 150px;
}

.wrap {
  height: auto;
  float: left;
  margin-left: 40px;
  margin-right: 15px;
}

.column {
  width: 200px;
  display: block;
  margin-bottom: 15px;
}

.column:nth-child(odd) {
  height: 150px;  
}

.column:nth-child(even) {
  height: 150px;
}

.column img {
  cursor: pointer;
  margin-left: auto;
  margin-right: auto;
  display: block;
  max-width: 200px;
  max-height: 150px;
}

.fieldset {
  background-color: #d4d4d460;
  border-radius: 4px;
  font-size: 0.8em;
}

.legend {
  background-color: #fff;
  border: 1px solid rgb(56, 56, 56);
  border-radius: 4px;
  color: #000;
  font-size: 15px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}

.cite {
  cursor: pointer;
  padding: 2px 8px;
  font-size: 12px;
  font-weight: 300;
  border-radius: 16px;
  color: #9e0207;
  letter-spacing: 0;
  vertical-align: middle;
  line-height: 12px;
  background-color: #f1dcdc;
  margin-left: 12px;
}

.bg-custom {
  background-color: #d8d8d8;
}
</style>