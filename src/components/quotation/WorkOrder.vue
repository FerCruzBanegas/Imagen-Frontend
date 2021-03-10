<template>
  <div>
    <modal-form :title="'Nuevo Empleado'" :visible="modalEmployee" @hide="modalEmployee = !modalEmployee">
      <employee-form @success="successEmployee"/>
    </modal-form>
    <modal-form :title="'Nueva Orden de Trabajo'" :visible="visibleModal" @hide="visibleModal = false">
      <a-spin :spinning="success">
        <b-card class="text-left" title="DATOS OT" sub-title="Los campos con (*) son obligatorios">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="opening_date">Fecha de Inicio * :</label>
              </strong>
              <b-form-group label-for="opening_date" :invalid-feedback="errors.first('opening_date')" :state="!errors.has('opening_date')">
                <b-form-input
                  v-model="work_order.opening_date"
                  :state="errors.has('opening_date') ? false : null"
                  v-validate="'required'"
                  data-vv-name="opening_date"
                  data-vv-as="fecha inicio"
                  type="date"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="estimated_date">Fecha Estimada de Entrega * :</label>
              </strong>
              <b-form-group label-for="estimated_date" :invalid-feedback="errors.first('estimated_date')" :state="!errors.has('estimated_date')">
                <b-form-input
                  v-model="work_order.estimated_date"
                  :state="errors.has('estimated_date') ? false : null"
                  v-validate="'required'"
                  data-vv-name="estimated_date"
                  data-vv-as="fecha estimada"
                  type="date"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-7 col-xl-7">
              <strong>
                <label for="employees">Responsable del Trabajo * :</label>
              </strong>
              <b-form-group label-for="employees" :invalid-feedback="errors.first('employees')" :state="!errors.has('employees')">
                <div class="d-table-cell w-100">
                  <v-select
                    multiple
                    label="name"
                    v-model="work_order.employees" 
                    :options="employees"
                    :reduce="employee => employee.id"
                    :selectable="() => work_order.employees.length < 2"
                    :state="errors.has('employees') ? false : null"
                    v-validate="'required'"
                    data-vv-name="employees"
                    data-vv-as="responsable"
                  ></v-select>
                </div>
                <div class="d-table-cell align-middle">
                  <b-button @click="modalEmployee = true" class="ml-1 btn-add" size="sm">
                    <i class="fa fa-user-plus"></i>
                  </b-button>
                </div>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-5 col-xl-5">
              <strong>
                <label for="type_work">Tipo de Trabajo * :</label>
              </strong>
              <b-form-group label-for="type_work" :invalid-feedback="errors.first('type_work')" :state="!errors.has('type_work')">
                <b-form-input
                  v-model="work_order.type_work"
                  :state="errors.has('type_work') ? false : null"
                  v-validate="'required|max:64'"
                  data-vv-name="type_work"
                  data-vv-as="tipo trabajo"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-12 col-xl-12">
              <strong>
                <label for="note">Observaciones :</label>
              </strong>
              <b-form-group label-for="note" :invalid-feedback="errors.first('note')" :state="!errors.has('note')">
                <b-form-input
                  v-model="work_order.note"
                  :state="errors.has('note') ? false : null"
                  v-validate="'min:5|max:120'"
                  data-vv-name="note"
                  data-vv-as="observaciones"
                  size="lg"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <b-form-checkbox
            v-model="installation"
            :value="true"
            :unchecked-value="false"
            aria-controls="collapse"
          >
            Instalación o entrega en el interior? 
          </b-form-checkbox>
          <b-collapse id="collapse" v-model="installation" class="mt-2">
            <b-card>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="city_id">Ciudad de Instalación/Entrega * :</label>
                  </strong>
                  <b-form-group label-for="city_id" :invalid-feedback="errors.first('city_id')" :state="!errors.has('city_id')">
                    <v-select
                      label="name"
                      v-model="work_order.city_id" 
                      :options="cities"
                      :reduce="cities => cities.id"
                      :state="errors.has('city_id') ? false : null"
                      v-validate="'required'"
                      data-vv-name="city_id"
                      data-vv-as="ciudad"
                    ></v-select>
                  </b-form-group>
                </div>
                <div class="col-12 col-md-12 col-lg-6 col-xl-6">
                  <strong>
                    <label for="name_staff">Persona a Cargo Instalación/Entrega* :</label>
                  </strong>
                  <b-form-group label-for="name_staff" :invalid-feedback="errors.first('name_staff')" :state="!errors.has('name_staff')">
                    <b-form-input
                      v-model="work_order.name_staff" 
                      :state="errors.has('name_staff') ? false : null"
                      v-validate="'max:64'"
                      data-vv-name="name_staff"
                      data-vv-as="personal a cargo"
                    ></b-form-input>
                  </b-form-group>
                </div>
              </div>
              <div class="row">
                <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                  <strong>
                    <label for="address_work">Dirección del Trabajo * :</label>
                  </strong>
                  <b-form-group label-for="address_work" :invalid-feedback="errors.first('address_work')" :state="!errors.has('address_work')">
                    <b-form-input
                      v-model="work_order.address_work" 
                      :state="errors.has('address_work') ? false : null"
                      v-validate="'max:64'"
                      data-vv-name="address_work"
                      data-vv-as="dirección trabajo"
                      size="lg"
                    ></b-form-input>
                  </b-form-group>
                </div>
              </div>
            </b-card>
          </b-collapse>
          <hr>
          <b-button @click="submit" variant="danger">REGISTRAR</b-button>
        </b-card>
      </a-spin>
    </modal-form>
    <a-alert
      v-if="quotation.state == 1"
      message="Nota"
      description="No es posible generar una orden de trabajo hasta que la cotización sea aprobada."
      type="warning"
      show-icon
    />
    <div v-else>
      <a-spin :spinning="loading">
        <div class="container">
          <div class="row border" style="background-color: #D7D3D3;">
            <div class="col-12 col-md-12 col-lg-12 col-xl-12">
              <button
                v-available
                @click="showModal"
                type="button"
                class="btn btn-danger my-2 btn-with-addon text-nowrap"
              >
                <span class="btn-addon">
                  <i class="btn-addon-icon fa fa-pencil" />
                </span>
                {{  !quotation.work_order ? 'Registrar Datos' : 'Editar Datos' }}
              </button>
              <a-popconfirm
                placement="right"
                title="Desea cerrar la OT y marcarlo como entregado?"
                ok-text="Si"
                cancel-text="No"
                @confirm="finishWorkOrder"
              >
                <button
                  v-if="quotation.work_order"
                  v-available
                  type="button"
                  class="btn btn-secondary m-2 btn-with-addon text-nowrap"
                >
                  <span class="btn-addon">
                    <i class="btn-addon-icon fa fa-calendar-check-o"/>
                  </span>
                  Terminar OT
                </button>
              </a-popconfirm>

              <b-button 
                @click="downloadWorkOrder" 
                v-if="quotation.work_order" 
                variant="secondary"
                 class="pull-right my-2"
              ><i class="fa fa-download"></i></b-button>
              <b-button
                @click="printWorkOrder"
                v-if="quotation.work_order"
                variant="dark" 
                class="pull-right m-2"
              ><i class="fa fa-print"></i></b-button>
            </div>
          </div>
        </div>
        <div class="row" v-if="quotation.work_order">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <table class="table table-bordered table-sm">
              <tr class="text-center">
                <td width="200" class="font-weight-bold">Número de OT</td>
                <td rowspan="3" width="500" style="padding: 30px"><h1>ORDEN DE TRABAJO</h1></td>
                <td width="200" class="font-weight-bold">Nro de Cotización</td>
              </tr>
              <tr class="text-center">
                <td rowspan="2" style="padding: 18px">{{ quotation.work_order.number | codeString }}</td>
                <td>{{ quotation.cite }}</td>
              </tr>
              <tr class="text-center">
                <td>
                  <span v-if="quotation.work_order.closing_date" class='badge badge-success'>ENTREGADO</span>
                  <span v-else class='badge badge-primary'>EN CURSO</span>
                </td>
              </tr>
            </table>
            <table class="table table-striped table-bordered table-hover">
              <tbody>
                <tr class="text-center">
                  <th width="300">FECHA DE INICIO:</th>
                  <th width="300">FECHA ESTIMADA:</th>
                  <th width="300">FECHA DE ENTREGA:</th>
                </tr>
                <tr class="text-center">
                  <td>{{ quotation.work_order.opening_date | formatDate('DD/MM/YYYY') }}</td>
                  <td>{{ quotation.work_order.estimated_date | formatDate('DD/MM/YYYY') }}</td>
                  <td v-if="quotation.work_order.closing_date">{{ quotation.work_order.closing_date | formatDate('DD/MM/YYYY') }}</td>
                  <td v-else>-------</td>
                </tr>
                <tr>
                  <th colspan="3">RESPONSABLES DEL TRABAJO:</th>
                </tr>
                <tr>
                  <td colspan="3">
                    <div>
                      <span v-for="(employee, index) in quotation.work_order.employees" :key="index">
                        {{ employee.name }} {{ index+1 < quotation.work_order.employees.length ? ',' : '' }}
                      </span>
                    </div>
                  </td>
                </tr>
                <tr>
                  <th colspan="3">TIPO DE TRABAJO:</th>
                </tr>
                <tr>
                  <td colspan="3">{{ quotation.work_order.type_work }}</td>
                </tr>
                <tr>
                  <th colspan="3">OBSERVACIONES:</th>
                </tr>
                <tr>
                  <td colspan="3">{{ quotation.work_order.note }}</td>
                </tr>
                <tr>
                  <th colspan="3" class="text-center"><span class="h5 font-weight-bold">DATOS DE ENTREGA</span></th>
                </tr>
                <tr>
                  <td colspan="3"><strong>Persona de Contacto:</strong> {{ quotation.attends }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Teléfono Persona de Contacto:</strong> {{ quotation.attends_phone }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Dirección de Entrega:</strong> {{ quotation.installment }}</td>
                </tr>
              </tbody>
            </table>
            <table v-if="quotation.work_order.city_id" class="table table-striped table-bordered table-hover">
              <tbody>
                <tr>
                  <th colspan="3" class="text-center"><span class="h5 font-weight-bold">INSTALACIÓN O ENTREGA EN EL INTERIOR</span></th>
                </tr>
                <tr>
                  <td colspan="3"><strong>Ciudad de Instalación/Entrega:</strong> {{ quotation.work_order.city_id.name }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Normbre del Personal Acargo de la Instalación/Entrega:</strong> {{ quotation.work_order.name_staff }}</td>
                </tr>
                <tr>
                  <td colspan="3"><strong>Dirección del Trabajo:</strong> {{ quotation.work_order.address_work }}</td>
                </tr>
              </tbody>
            </table>
            <a-spin :spinning="loadingTasks">
              <div class="container">
                <div class="row border">
                  <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12"> 
                    <b-card no-body>
                      <b-tabs 
                        small 
                        card 
                        active-nav-item-class="font-weight-bold text-uppercase text-danger" 
                      >
                        <b-tab title="TAREAS">
                          <!-- <pre>{{ $data  }}</pre> -->
                          <small class="font-weight-bold">Asigne tareas específicas para poder completar con el trabajo.</small>
                          <div class="container">
                            <div class="d-flex justify-content-between row bg-light p-2">
                              <button :disabled="quotation.work_order.closing_date" @click="addTaskItem" type="button" class="btn btn-danger btn-with-addon mr-auto text-nowrap">
                                <span class="btn-addon">
                                  <i class="btn-addon-icon fe fe-plus-circle" />
                                </span>
                                Agregar
                              </button>
                              <button :disabled="quotation.work_order.closing_date" @click="submitTasks" type="button" class="btn btn-secondary btn-with-addon text-nowrap">
                                <span class="btn-addon">
                                  <i class="btn-addon-icon fe fe-check-circle"  />
                                </span>
                                Guardar Cambios
                              </button>
                            </div>
                          </div>
                          <div v-if="error">
                            <b-alert show variant="warning" dismissible>
                              <h4 class="alert-heading">Revisa los siguientes errores!</h4>
                              <ul id="v-for-object">
                                <li v-for="value in error">
                                  {{ value[0] }}
                                </li>
                              </ul>
                            </b-alert>
                          </div>
                          <table class="task">
                            <thead>
                              <tr>
                                <th scope="col" width="10px">Nº</th>
                                <th scope="col" width="140px">Descripción</th>
                                <th scope="col" width="100px">Prioridad</th>
                                <th scope="col" width="150px">Encargado</th>
                                <th scope="col" width="60px">Fecha/Hora</th>
                                <th scope="col" width="30px">Estado</th>
                                <th scope="col" width="10px"></th>
                              </tr>
                            </thead>
                            <tbody v-if="quotation.work_order.tasks.length > 0">
                              <tr v-for="(item, index) in quotation.work_order.tasks" :key="index">
                                <td data-label="Nº"><span>{{ index + 1 }}</span></td>
                                <td data-label="Descripción">
                                  <div v-if="item.date_end">
                                    <span style="font-size: 13px; color: #000000;">{{ item.description }}</span>
                                  </div>
                                  <b-form-textarea
                                    v-else 
                                    style="font-size: 12px; font-weight: bold;border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                                    v-model="item.description">
                                  </b-form-textarea>
                                </td>
                                <td data-label="Prioridad">
                                  <div v-if="item.date_end">
                                    <span style="font-size: 13px; color: #000000;">{{ item.priority }}</span>
                                  </div>
                                  <v-select
                                    v-else 
                                    v-model="item.priority"
                                    :reduce="type => type.label"
                                    :options="types"
                                  >
                                    <template slot="option" slot-scope="option">
                                      <div class="d-center">
                                        {{ option.label }}
                                      </div>
                                    </template>
                                  </v-select>
                                </td>
                                <td data-label="Encargado">
                                  <div v-if="item.date_end">
                                    <span style="font-size: 13px; color: #000000;">{{ item.employee_id.name }}</span>
                                  </div>
                                  <v-select
                                    v-else
                                    label="name"
                                    :filterable="false"
                                    :options="employees_task"
                                    v-model="item.employee_id"
                                    @search="onSearchEmployee"
                                  >
                                    <template slot="no-options">Buscar Empleado..</template>
                                    <template slot="option" slot-scope="employee">
                                      <div>
                                        <strong>{{ employee.name }}</strong>
                                      </div>
                                    </template>
                                    <template slot="selected-option" slot-scope="employee">
                                      <div>
                                        <strong>{{ employee.name }}</strong>
                                      </div>
                                    </template>
                                  </v-select>
                                </td>
                                <td data-label="Fecha/Hora">
                                  <div class="text-left" v-if="item.date_end">
                                    <div><span  style="font-size: 12px; color: #000000;">Inicio:</span> {{ item.date_init | formatDate('DD/MM/YYYY LT') }}</div>
                                    <div><span  style="font-size: 12px; color: #000000;">Fin:</span> {{ item.date_end | formatDate('DD/MM/YYYY LT') }}</div>
                                  </div>
                                  <b-form-input
                                    v-else
                                    type="datetime-local"
                                    size="sm"
                                    v-model="item.date_init"
                                  >
                                  </b-form-input>
                                </td>
                                <td data-label="Estado">
                                  <span class="font-weight-bold" v-if="item.date_end"><b-badge variant="dark">Realizado</b-badge></span>
                                  <span class="font-weight-bold" v-else><b-badge variant="dark">Pendiente</b-badge></span>
                                </td>
                                <td>
                                  <!-- <b-button @click="removeTaskItem(index)" squared size="sm" variant="dark"><i class="fa fa-pencil"></i></b-button> -->
                                  <b-button v-if="!item.date_end" @click="removeTaskItem(index)" squared size="sm" variant="danger"><i class="fa fa-trash"></i></b-button>
                                </td>
                              </tr>
                            </tbody>
                          </table>
                          <div class="container" v-if="quotation.work_order.tasks.length === 0">
                            <div class="d-flex justify-content-center row" style="background-color: #dcdcdc;">
                              <div class="text-center">
                                <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i> 
                                <div class="p-2"><small class="font-weight-bold">Sin tareas asignadas</small></div>
                              </div>
                            </div>
                          </div>
                        </b-tab>
                      </b-tabs>
                    </b-card>
                  </div>
                </div>
              </div>
            </a-spin>
          </div>
        </div>
      </a-spin>
    </div>
  </div>
</template>

<script>
import moment from 'moment'
import ModalForm from '../../components/widgets/Modals/ModalForm.vue'
import WorkOrder from '../../models/WorkOrder'
import EmployeeService from "../../services/employee.service"
import CityService from '../../services/city.service'
import WorkOrderService from '../../services/workorder.service'
import TaskService from '../../services/task.service'
import EmployeeForm from '../employee/EmployeeForm.vue'

export default {
  props: {
    quotation: {
      type: Object
    },
  },

  components: {
    'modal-form': ModalForm,
    'employee-form': EmployeeForm,
  },

  data() {
    return {
      moment,
      tasksItems: [
        { description: 'test ', priority: 'Alta', date_init: '2021-02-27 15:17', date_end: '2021-02-22 11:24:59', work_order_id: 165, employee_id: {id: 3, name: 'Luis Aguilar'} }
      ],
      types: [
        {label:'Baja', description: 'Baja'}, 
        {label:'Media', description: 'Media'}, 
        {label:'Alta', description: 'Alta'}
      ],
      work_order: new WorkOrder(),
      employees: [],
      employees_task: [],
      cities: [],
      visibleModal: false,
      modalEmployee: false,
      installation: false,
      success: true,
      loading: false,
      loadingTasks: false,
      error: null,
    }
  },

  directives: {
    available: {
      inserted: (el, binding, vnode) => {
        if(vnode.context.quotation.state == 3) {
          el.disabled = true
        }
      },

      update: (el, binding, vnode) => {
        if(vnode.context.quotation.state == 3) {
          el.disabled = true
        }
      }
    }
  },

  created() {
    if(this.quotation.work_order) {
      this.work_order = Object.assign({}, this.quotation.work_order)
      this.work_order['employees'] = this.work_order.employees.map(obj => obj.id)
      if (this.work_order.city_id) {
        this.installation = true
        this.work_order['city_id'] = this.work_order.city_id.id
      }
    }
  },

  methods: {
    addTaskItem() {
      this.quotation.work_order.tasks.push(
        { description: '', priority: '', date_init: '', date_end: null, work_order_id: this.work_order.id, employee_id: null }
      )
    },

    removeTaskItem(index) {
      if (index > -1) this.quotation.work_order.tasks.splice(index, 1)
    },

    showModal() {
      this.visibleModal = true
      Promise.all([this.listEmployees(), this.listCities()])
      .then(() =>{
        this.success = false
      })
    },

    successEmployee() {
      this.listEmployees()
      this.modalEmployee = false
    },

    listEmployees: async function() {
      const employees = await EmployeeService.listEmployees()
      if (employees.status === 200) {
        this.employees = employees.data
      }
    },

    listCities: async function() {
      const cities = await CityService.listCities()
      if (cities.status === 200) {
        this.cities = cities.data
      }
    },

    onSearchEmployee(search, loading) {
      loading(true)
      this.searchEmployee(loading, search, this)
    },

    searchEmployee: _.debounce(async (loading, search, vm) => {
      const data = {
        column: 'name',
        value: search
      }
      try {
        const employees = await EmployeeService.searchEmployee(data)
        if (employees.status === 200) {
          vm.employees_task = employees.data.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.employees_task = []
          loading(false)
        }
      }
    }, 350),

    downloadWorkOrder: async function() { 
      this.loading = true
      let workOrder = {
        cite: this.quotation.cite,
        attends: this.quotation.attends,
        attends_phone: this.quotation.attends_phone,
        installment: this.quotation.installment,
        work_order: this.quotation.work_order
      }
      const response = await WorkOrderService.downloadWorkOrder({workOrder: workOrder})
      if (response.status === 200) {
        let blob = new Blob([response.data])
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `OT.pdf`
        link.click()
        this.loading = false
      }
    },

    async printWorkOrder(item) {
      try {
        this.loading = true
        let workOrder = {
          cite: this.quotation.cite,
          attends: this.quotation.attends,
          attends_phone: this.quotation.attends_phone,
          installment: this.quotation.installment,
          work_order: this.quotation.work_order
        }
        const response = await WorkOrderService.downloadWorkOrder({workOrder: workOrder})
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

    finishWorkOrder: async function() { 
      this.loading = true
      try {
        const response = await WorkOrderService.finishWorkOrder(this.quotation.work_order.id)
        if (response.status === 200) {
          this.quotation.work_order = response.data.data
          this.quotation.state = 3
          this.loading = false
        }
      } catch (err) {
        if (err.response.status === 406) {
          this.$notification.warning({
            message: 'Nota',
            description: err.response.data,
            duration: 10,
            placement: 'bottomRight'
          })
        }
        this.loading = false
      }
    },

    submit: async function() {
      this.work_order['installation'] = this.installation
      this.$validator.errors.clear()
      this.success = true
      try {
        if(this.quotation.work_order) {
          this.work_order['id'] = this.quotation.work_order.id
          if (!this.installation) {
            this.work_order['city_id'] = null
            this.work_order['name_staff'] = ''
            this.work_order['address_work'] = ''
          }
          this._save = await WorkOrderService.updateWorkOrder(this.work_order)
        } else {
          this.work_order['quotation_id'] = this.quotation.id
          this._save = await WorkOrderService.storeWorkOrder(this.work_order)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.quotation.work_order = this._save.data.data
          this.visibleModal = false
          this.success = false
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },

    submitTasks: async function() {
      this.error = null
      this.loadingTasks = true
      let data = this.quotation.work_order.tasks.map(item => {
        let newObj = {}
        newObj.id = item.id ? item.id : null,
        newObj.description = item.description
        newObj.priority = item.priority
        newObj.date_init = item.date_init ? moment(item.date_init).format('YYYY-MM-DD HH:mm:ss') : null
        newObj.employee_id = item.employee_id ? item.employee_id.id : null 
        return newObj
      })
      try {
        this._save = await TaskService.storeTask({tasks: data, work_order: this.work_order.id})
        if (this._save.status === 201 || this._save.status === 200) {
          this.quotation.work_order.tasks = this._save.data.data
          this.loadingTasks = false
          this.$message.success(this._save.data.message)
        }
      } catch (err) {
        if (err.response.status === 422) {
          this.$setErrorsFromResponse(err.response.data)
          this.error = err.response.data.errors
        }
        if (err.response.status === 406) {
          this.$notification.warning({
            message: 'Nota',
            description: err.response.data,
            duration: 10,
            placement: 'bottomRight'
          })
        }
        this.loadingTasks = false
      }
    }
  }
}
</script>
<style lang="css" scoped>
  .btn-group-sm > .btn, .btn-sm {
    padding: .25rem .4rem;
    font-size: .650rem;
    line-height: 1.5;
    border-radius: .2rem;
    margin: 2px;
  }

  .btn-add {
    height: 2.5em;
  }
  .card {
    margin-bottom: 1rem;
    margin-top: 1rem;
    background: #fff;
  }

  >>> .vs__spinner, .vs__spinner:after {
    border-radius: 50%;
    width: 3em;
    height: 3em;
  }

  .task {
    border-collapse: collapse;
    width: 100%;
  }

  .task th,
  .task td {
    border: 1px solid #807979;
    padding: 0.625em;
    text-align: center;
    font-weight: bold;
  }

  .task tbody tr {
    background-color: rgb(212, 212, 212);
    border: 1px solid #ddd;
    padding: 0.35em;
    font-size: 0.70em;
  }

  .task tfoot tr {
    background-color: #fff;
  }

  .task tr:nth-child(even){background-color: #f2f2f2;}

  .task tr:hover {background-color: #ececec;}

  .task thead th {
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: #9e0207;
    color: white;
    text-transform: uppercase;
    font-size: 0.85em;
  }

  @media screen and (max-width: 800px) {
    .task {
      border: 0;
    }

    .task caption {
      font-size: 1.3em;
    }

    .task thead {
      border: none;
      clip: rect(0 0 0 0);
      height: 1px;
      margin: -1px;
      overflow: hidden;
      padding: 0;
      position: absolute;
      width: 1px;
    }

    .task tfoot th {
      border: none;
    }

    .task tr {
      border-bottom: 3px solid #ddd;
      display: block;
      margin-bottom: 0.625em;
    }

    .task td {
      border-bottom: 1px solid #ddd;
      display: block;
      font-size: 0.8em;
      text-align: right;
    }

    .task td::before {
      content: attr(data-label);
      float: left;
      font-weight: bold;
      text-transform: uppercase;
    }

    .task td:last-child {
      border-bottom: 0;
    }
  }
</style>