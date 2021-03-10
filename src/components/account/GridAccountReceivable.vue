<template>
  <div class="container">
    <!-- revisar props access -->
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsAccountsReceivable"
      :access="'invoices'"
      @hide="visibleModal = !visibleModal"
    ></modal-grid>
    <modal-detail :title="'Registro de Pagos'" :visible="visibleDetail" @hide="hideDetailPayment">
      <a-spin :spinning="loading">
        <div class="container">
          <!-- <pre>{{ $data }}</pre> -->
          <div class="row bg-light">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            </div>
          </div>
          <div class="d-flex justify-content-between row bg-light p-2">
            <div>
              <button @click="showForm = !showForm" type="button" class="btn btn-danger btn-with-addon mr-auto text-nowrap">
                <span class="btn-addon">
                  <i class="btn-addon-icon fe fe-plus-circle" />
                </span>
                Nuevo Pago
              </button>
              <b-button id="btn-close" v-if="totalItem == total && permission('accounts.close')" class="ml-2 btn btn-dark btn-with-addon mr-auto text-nowrap">
                <span class="btn-addon">
                  <i class="btn-addon-icon fa fa-archive" aria-hidden="true"></i>
                </span>
                Cerrar Cuenta
              </b-button>
              <b-popover
                v-if="totalItem == total && permission('accounts.close')"
                target="btn-close"
                triggers="click"
                :show.sync="popoverShow"
                placement="right"
                ref="popover"
              >
                <a-alert
                  message="Alerta"
                  description="Realmente desea cerrar esta cuenta?"
                  type="warning"
                  showIcon
                />
                <br /> 
                <div>
                  <b-button  class="mr-2" squared @click="popoverShow = false" size="sm" variant="outline-secondary">Cancelar</b-button>
                  <b-button squared @click="closeAccount" size="sm" variant="danger">Si</b-button>
                </div>
              </b-popover>
            </div>
            <div v-if="showForm">
              <b-button @click="submit" class="float-right" variant="dark" squared>
                <i class="fa fa-check-circle-o" aria-hidden="true"></i>
                Guardar
              </b-button>
              <b-button @click="cleanFormPayment" class="float-right mr-2" variant="secondary" squared>
                <i class="fa fa-refresh" aria-hidden="true"></i>
                Limpiar Datos
              </b-button>
            </div>
          </div>
          <div class="row justify-content-end bg-light" v-if="showForm">
            <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <small class="float-right font-weight-bold"><i class="fa fa-exclamation-circle fa-lg" style="color:red"></i> Ingrese los datos para registrar un nuevo pago, Los campos con (*) son obligatorios.</small>
            </div>
          </div>
          <div class="row p-2 bg-light" v-if="showForm">
            <fieldset class="fieldset col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <b-alert
                :show="dismissCountDown"
                dismissible
                :variant="variantAlert"
                @dismissed="dismissCountDown=0"
                @dismiss-count-down="countDownChanged"
              >
                {{ message }}
              </b-alert>
              <legend>Datos Generales:</legend>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-2">
                  <strong><label for="date">Fecha * :</label></strong>
                  <b-form-group :invalid-feedback="errors.first('date')" :state="!errors.has('date')">
                    <b-form-input 
                      v-model="payment.date"
                      :state="errors.has('date') ? false : null"
                      v-validate="'required'"
                      data-vv-name="date"
                      data-vv-as="fecha"
                      type="date"
                    ></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-3 col-xl-3 mb-2">
                  <strong><label for="type">Tipo de Pago * :</label></strong> 
                  <b-form-group :invalid-feedback="errors.first('type')" :state="!errors.has('type')">
                    <v-select 
                      v-model="payment.type"
                      :reduce="type => type.label"
                      :state="errors.has('type') ? false : null"
                      v-validate="'required'"
                      data-vv-name="type"
                      data-vv-as="tipo de pago"
                      :options="types"
                    >
                      <template slot="option" slot-scope="option">
                        <div class="d-center">
                          {{ option.description }}
                        </div>
                      </template>
                    </v-select>
                  </b-form-group>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-2 col-xl-2 mb-2">
                  <strong><label for="amount">Monto * :</label></strong>
                  <b-form-group :invalid-feedback="errors.first('amount')" :state="!errors.has('amount')">
                    <b-form-input 
                      v-model="payment.amount" 
                      v-money="money"
                      :state="errors.has('amount') ? false : null"
                      v-validate="'required'"
                      data-vv-name="amount"
                      data-vv-as="monto" 
                      class="text-right"
                    ></b-form-input>
                  </b-form-group>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4 mb-2">
                  <strong><label for="path.url">Imagen Comprobante * :</label></strong>
                  <b-form-group :invalid-feedback="errors.first('path.url')" :state="!errors.has('path.url')">
                    <b-form-file 
                      v-on:change="onImageChange($event, payment)"
                      :state="errors.has('path.url') ? false : null"
                      v-validate="'required'"
                      data-vv-name="path.url"
                      data-vv-as="imagen"
                      placeholder="Seleccione una imagen..."
                    ></b-form-file>
                  </b-form-group>
                </div>
              </div>
              <div class="d-flex justify-content-center" v-if="payment.path">
                <div class="demo-gallery">
                  <div class="item-gallery">
                    <a v-on:click.prevent="showImageForm(payment.path.url)">
                      <img class="img-responsive" :src="getImage(payment.path)">
                      <div class="demo-gallery-poster">
                        <img src="/img/zoom.png">
                      </div>
                    </a>
                  </div>
                </div>
                <vue-easy-lightbox
                  escDisabled
                  moveDisabled
                  :visible="showImgForm"
                  :imgs="imgsForm"
                  @hide="hideImageForm"
                ></vue-easy-lightbox>
              </div>
            </fieldset>    
          </div>
        </div>
        <b-table
          class="text-center" 
          thead-class="bg-danger text-white" 
          small 
          fixed 
          striped 
          hover 
          responsive="sm" 
          stacked="sm" 
          show-empty 
          :items="payments"
          :fields="columns"
          :sort-by.sync="sortBy"
          :sort-desc.sync="sortDesc"
        >
          <template v-slot:empty="scope">
            <div class="text-center">
              <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
              <h6>No existen resultados</h6>
            </div>
          </template>
          <template v-slot:cell(opciones)="row">
            <b-button @click="editPayment(row)" size="sm" class="mr-2" variant="outline-dark">
              <i class="fa fa-pencil" aria-hidden="true"></i>
            </b-button>
            <b-button @click="questionDeletePayment(row)" size="sm" class="mr-2" variant="outline-dark">
              <i class="fa fa-trash-o" aria-hidden="true"></i>
            </b-button>
          </template>
          <template v-slot:cell(item)="data">
            <strong>{{ data.index + 1 }}</strong>
          </template>
          <template v-slot:cell(date)="data">
            <strong>{{ data.value | formatDate('DD/MM/YYYY') }}</strong>
          </template>
          <template v-slot:cell(type)="data">
            <strong>{{ data.value }}</strong>
          </template>
          <template v-slot:cell(path)="data">
            <div class="air__utils__avatar air__utils__avatar--size50" style="margin:0 auto;">
              <div class="item-gallery">
                <a v-on:click.prevent="showImageTable(data.value.url)">
                  <img class="img-responsive" :src="data.value.url">
                  <div class="demo-gallery-poster">
                    <img src="/img/zoom.png">
                  </div>
                </a>
              </div>
            </div>
            <vue-easy-lightbox
              escDisabled
              moveDisabled
              :visible="showImgTable"
              :imgs="imgsTable"
              @hide="hideImageTable"
            ></vue-easy-lightbox>
          </template>
          <template v-slot:cell(amount)="data">
            <strong>{{ data.value }}</strong>
          </template>
        </b-table>
        <div class="container text-center">
          <div class="row border border-dark">
            <div class="col-md-3 border">
              <div class="h5 font-weight-bold pt-2">Total Cuenta: (BS) {{ totalItem | currency }}</div>
            </div>
            <div class="col-md-3 border">
              <div class="h5 font-weight-bold pt-2">Saldo: (BS) {{ totalItem - total | currency }}</div>
            </div>
            <div class="col-md-3 ml-auto border">
              <div class="h5 font-weight-bold pt-2">TOTAL PAGOS (BS)&nbsp:</div>
            </div>
            <div class="col-md-2 border" style="background: #4e4e4e;">
              <div class="text-white h6 font-weight-bold pt-2">{{ total | currency }}</div>
            </div>
          </div>
        </div>
      </a-spin>
    </modal-detail>
    <modal-question
      :title="'Alerta'"
      :visible="visibleQuestion"
      :alert_message="'Realmente desea eliminar este registro?'"
      :loading="loadingAlert"
      @hide="visibleQuestion = !visibleQuestion"
      @submit="deletePayment"
    ></modal-question>
    <div class="row justify-content-center">
      <div class="table-responsive">
        <div class="container">
          <div class="row p-2 bg-secondary">
            <div class="col-md-6">
              <b-button @click="visibleModal = true" v-if="itemsAccountsReceivable.length > 0" squared variant="outline-danger" class="mr-2">
                <i class="fa fa-check-square"></i>
                ({{ itemsAccountsReceivable.length }}) Seleccionados
              </b-button>
              <b-button title="Quitar Seleccionados" @click="emptyAccountReceivable" variant="outline-dark">
                <i class="fa fa-check-square-o"></i>
              </b-button>
              <b-button title="Descargar PDF" @click="pdfListAccountReceivable" variant="danger" class="ml-2">
                <i class="fa fa-file-pdf-o"></i>
                <span v-if="itemsAccountsReceivable.length > 0">({{ itemsAccountsReceivable.length }})</span>
              </b-button>
              <b-button title="Descargar EXCEL" @click="excelListAccountReceivable" variant="success" class="ml-2">
                <i class="fa fa-file-excel-o"></i>
                <span v-if="itemsAccountsReceivable.length > 0">({{ itemsAccountsReceivable.length }})</span>
              </b-button>
              <b-button title="Actualizar Tabla" @click="reloadTable" variant="dark" class="ml-2">
                <i class="fa fa-repeat"></i>
              </b-button>
            </div>
            <div class="col-md-2 ml-auto">
              <div class="menu" style="border-radius: 4px; max-width: 180px; float: right; background: #f6f6f6; padding: 0.2em;"/>
              </div>
            </div>
          </div>
          <kendo-datasource
            ref="datasource1"
            :schema-total="'meta.total'"
            :schema-data="'data'"
            :transport-read="{ url: `${url}/accounts/receivable`, beforeSend: readData }"
            :transport-parameter-map="parameterMap"
            :page-size="10"
            :server-paging="true"
            :server-filtering="true"
            :server-sorting="true"
            :schema-model-fields="dsSchemaFields"
          ></kendo-datasource>
          <kendo-grid
            ref="gridReceivable"
            :data-source-ref="'datasource1'"
            :no-records="true"
            :messages-no-records="'NO EXISTEN RESULTADOS'"
            :groupable="true"
            :filterable="filterableConfig"
            :navigatable="true"
            :pageable-always-visible="true"
            :pageable-page-sizes="[10, 20, 50, 100]"
            :pageable-button-count="3"
            :pageable-responsive="true"
            :pageable-refresh="true"
            :sortable="true"
            @change="onChange"
            @databound="dataBound"
            :detailTemplate="itemTemplate"
          >
            <kendo-grid-column :selectable="true" :width="30"></kendo-grid-column>
            <kendo-grid-column
              :field="'cite'"
              :title="'CITE'"
              :width="70"
              :template="templateCite"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'type'"
              :title="'COMPROBANTE'"
              :width="100"
              :template="templateType"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="stateType"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'number'"
              :title="'NÚMERO'"
              :width="90"
              :filterable-cell-operator="'contains'"
              :filterable-cell-suggestion-operator="'contains'"
            ></kendo-grid-column>
            <kendo-grid-column 
              :field="'amount'" 
              :title="'TOTAL'" 
              :width="50"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column 
              :field="'amount_paid'" 
              :title="'PAGADO'" 
              :width="50" 
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column 
              :field="'balance'" 
              :title="'SALDO'" 
              :width="50" 
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'user'"
              :title="'USUARIO'"
              :width="85"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="userFilter"
            ></kendo-grid-column>
          </kendo-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
import Vue from "vue"
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import {VMoney} from 'v-money'
import formatter from '../../mixins/formatter'
import permission from '../../mixins/permission'
import Payment from '../../models/Payment'
import AccountService from "../../services/account.service"
import PaymentService from "../../services/payment.service"
import ModalGrid from "../widgets/Modals/ModalGridInvoice.vue"
import ModalDetail from "../widgets/Modals/ModalAccount.vue"
import ModalQuestion from "../widgets/Modals/ModalQuestion.vue"
import Template from "./DetailTemplate.vue"
// import {PDFJS} from "../../assets/js/pdf.js"
import * as pdfjslib from "pdfjs-dist";
const PDFJS = (pdfjslib)
PDFJS.GlobalWorkerOptions.workerSrc = require("pdfjs-dist/build/pdf.worker.entry.js");
export default {
  data() {
    return {
      url: API_URL,
      payment: new Payment(),
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      },
      dsSchemaFields: {
        cite: { type: "string" },
        number: { type: "string" },
        type: { type: "string" },
        amount: { type: "string" },
        amount_paid: { type: "string" },
        balance: { type: "string" },
        user: { from: "user.name" }
      },
      filterableConfig: {
        mode: "row",
        operators: {
          string: {
            qe: "Es igual a",
            neq: "No es igual a",
            contains: "Contiene",
            doesnotcontain: "No contiene",
            startswitch: "Comienza con",
            endswitch: "Termina en"
          },
          date: {
            lte: "Antes o igual a",
            gte: "Después o igual a"
          }
        }
      },
      loading: false,
      visibleDetail: false,
      visibleQuestion: false,
      visibleModal: false,
      model: null,
      type_id: null,
      payments: [],
      showForm: false,
      popoverShow: false,
      types: [
        {label:'Tarjeta', description: 'Tarjeta'}, 
        {label:'Efectivo', description: 'Efectivo'}, 
        {label:'Cheque', description: 'Cheque'},
        {label:'Transferencia', description: 'Transferencia'},
        {label:'Deposito', description: 'Deposito'},
      ],
      sortBy: 'id',
      sortDesc: true,
      dismissSecs: 5,
      dismissCountDown: 0,
      variantAlert: 'success',
      message: null,
      paymentId: null,
      totalItem: null,
      loadingAlert: false,
      columns: [
        'opciones',
        'item',
        { key: 'date', label: 'Fecha'},
        { key: 'type', label: 'Comprobante'},
        { key: 'path', label: 'Imagen'},
        { key: 'amount', label: 'Monto'},
      ],
      imgsTable: '',
      imgsForm: '',
      showImgTable: false,
      showImgForm: false,
      base64_marker: ';base64,'
    }
  },

  directives: {money: VMoney},

  mixins: [formatter, permission],

  computed: {
    ...mapGetters(["itemsAccountsReceivable"]),
    total() {
      let total = this.payments.reduce((acc, item) => {
        return acc + Number(this.toFloat(item.amount))
      }, 0)
      return isNaN(total) ? 0 : total
    },
  },

  components: {
    "modal-grid": ModalGrid,
    "modal-detail": ModalDetail,
    "modal-question": ModalQuestion,
  },

  created () {
    this.$bus.$on('searchAccounts', (data) => {
      let array = []
      Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        if(value) {
          let obj = {
            operator: key.toString() == 'customer' ? 'qe' : 'custom',
            value: value,
            field: key.toString() == 'customer' ? 'customer.name' : key.toString()
          }
          array.push(obj)
        }
      })
      this.$refs.gridReceivable.kendoWidget().dataSource.filter(array)
    })
  },

  mounted() {
    let grid = this.$refs.gridReceivable.kendoWidget()
    let ds = []
    for (let i = 1, max = grid.columns.length; i < max; i++) {
      ds.push({
        encoded: false,
        text:
          "<label class='k-checkbox-label' for='"+ i +"'><input id='"+ i +"' type='checkbox' checked='checked' " +
          " class='check k-checkbox' data-field='" +
          grid.columns[i].field +
          "'/>" +
          "<strong class='ml-2'> "+ grid.columns[i].title + "</strong>" +
          "</label>"
      })
    }

    $(".menu").kendoMenu({
      dataSource: [
        {
          text: "Columnas",
          items: ds
        }
      ],
      openOnClick: {
        rootMenuItems: true
      },
      closeOnClick: true,
      open: function() {
        let selector
        $.each(grid.columns, function() {
          if (this.hidden) {
            selector = "input[data-field='" + this.field + "']"
            $(selector).prop("checked", false)
          }
        })
      },
      select: function(e) {
        if ($(e.item).parent().filter("div").length) return
        let input = $(e.item).find("input.check")
        let field = $(input).data("field")
        if ($(input).is(":checked")) {
          grid.showColumn(field)
        } else {
          grid.hideColumn(field)
        }
      }
    })
  },

  methods: {
    itemTemplate: function(e) {
      return {
        template: Vue.component(Template.name, Template),
        templateArgs: Object.assign({}, e, {
            parentComponent: this.$refs.gridReceivable
        })
      }
    },

    async closeAccount() {
      try {
        this.loading = true
        const response = await AccountService.closeAccount({model: this.model, type_id: this.type_id})
        if (response.status === 200) {
          this.loading = false
          this.hideDetailPayment()
        }
      } catch (err) {
        this.loading = false
      }
    },

    reloadTable() {
      this.$refs.gridReceivable.kendoWidget().dataSource.filter({})
    },

    countDownChanged(dismissCountDown) {
      this.dismissCountDown = dismissCountDown
    },

    showMessage() {
      this.dismissCountDown = this.dismissSecs
    },

    questionDeletePayment(row) {
      this.paymentId = row.item.id
      this.visibleQuestion = true
    },

    showImageTable(img) {
      if (img) {
        this.imgsTable = img
        this.showImgTable = true
      }
    },

    showImageForm(img) {
      if (img) {
        this.imgsForm = img
        this.showImgForm = true
      }
    },

    hideImageTable() {
      this.showImgTable = false
    },

    hideImageForm() {
      this.showImgForm = false
    },

    getImage(path) {
      if (path.url) {
        return path.url
      } else {
        return 'img/no-image.jpg'
      }
    },

    onImageChange(e, payment) {
      payment.path.name = null
      payment.path.url = null
      let files = e.target.files || e.dataTransfer.files
      if (!files.length) {
        e.target.labels[0].textContent = 'Seleccione una imagen...'
        return
      }
      if (files[0].size > 3000000) {
        e.target.labels[0].textContent = 'Seleccione una imagen...'
        alert('La imagen no debe superar los 3MB')
      } else {
        e.target.labels[0].textContent = files[0].name
        this.createImage(files[0], payment.path)
        payment.path.name = files[0].name
      }
    },

    createImage(file, path) {
      let reader = new FileReader()
      let vm = this;
      reader.onload = (e) => {
        path.url = e.target.result
        let pdfAsArray = vm.convertDataURIToBinary(e.target.result)
        let imageData = vm.getPdf(pdfAsArray)
        // path.url = imageData
        // console.log(e.target.result)
      }
      reader.readAsDataURL(file)
    },

    convertDataURIToBinary(dataURI) {
			let base64Index = dataURI.indexOf(this.base64_marker) + this.base64_marker.length;
			let base64 = dataURI.substring(base64Index);
			let raw = window.atob(base64);
			let rawLength = raw.length;
			let array = new Uint8Array(new ArrayBuffer(rawLength));

			for(let i = 0; i < rawLength; i++) {
				array[i] = raw.charCodeAt(i);
			}
			return array;
		},

    getPdf(pdfAsArray) {
      let data
      // PDFJS.getDocument(pdfAsArray).then(function (pdf) {
      //   getPage();
      //   function getPage() {
      //     pdf.getPage(1).then(function(page) {
      //         var viewport = page.getViewport(1.5);
      //         var canvas = document.createElement('canvas') , ctx = canvas.getContext('2d');
      //         var renderContext = { canvasContext: ctx, viewport: viewport };

      //         canvas.height = viewport.height;
      //         canvas.width = viewport.width;
      //         data = canvas.toDataURL()
      //     })
      //   }
      // })
      
      PDFJS.getDocument(pdfAsArray).promise.then(pdf => {
        console.log(pdf)
      });
      // loadingTask.promise.then(pdf => {
      //   pdf.getPage(1).then(function(page) {
      //       let viewport = page.getViewport(1.5);
      //       let canvas = document.createElement('canvas') , ctx = canvas.getContext('2d');
      //       let renderContext = { canvasContext: ctx, viewport: viewport };

      //       canvas.height = viewport.height;
      //       canvas.width = viewport.width;
      //       data = canvas.toDataURL()
      //       console.log(canvas.toDataURL())
      //   })
      //   // console.log(pdf)
      // });
      // return data
    },

    editPayment(row) {
      let {parent, _events, _handlers, uid,...obj} = row.item
      this.payment = obj
      this.showForm = true
    },

    cleanFormPayment() {
      this.payment = new Payment()
      // this.payment.paymentable_id = this.paymentable_id 
      this.$validator.errors.clear()
    },

    hideDetailPayment() {
      this.$refs.gridReceivable.kendoWidget().dataSource.read()
      this.visibleDetail = false
      this.showForm = false
      this.totalItem = null
      this.payment = new Payment()
    },

    async deletePayment() {
      this.loadingAlert = true
      const response = await PaymentService.deletePayment(this.paymentId)
      if (response.status === 200) {
        let index = this.payments.findIndex(element => element.id === this.paymentId)
        this.payments.splice(index, 1)
        this.loadingAlert = false
        this.visibleQuestion = false
      }
    },

    async submit() {
      this.variantAlert = 'success'
      this.$validator.errors.clear()
      this.loading = true
      try {
        this.payment['model'] = this.model
        this.payment['type_id'] = this.type_id
        this.payment.amount = Number(this.toFloat(this.payment.amount))
        if(this.payment.id) {
          this._save = await PaymentService.updatePayment(this.payment.id, this.payment)
        } else {
          this._save = await PaymentService.storePayment(this.payment)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          if(this.payments.some(item => item.id === this._save.data.data.id)) {
            let index = this.payments.findIndex(element => element.id === this._save.data.data.id)
            this.payments.splice(index, 1, this._save.data.data)
          } else {
            this.payments.unshift(this._save.data.data)
          }
          this.loading = false
          this.message = this._save.data.message
          this.showMessage()
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.message = err.response.data.message
        this.variantAlert = 'warning'
        this.showMessage()
        this.loading = false
      }
    },

    templateCite(dataItem) {
      return (
        "<span class='btn btn-link'>" +
        kendo.htmlEncode(dataItem.cite) +
        "</span>"
      )
    },

    templateType(dataItem) {
      switch (dataItem.type) {
        case 'FACTURA':
          return (
            "<span class='badge badge-custom-1'>" +
            kendo.htmlEncode(dataItem.type) +
            "</span>"
          );
          break;
        case 'N.REMISION':
          return (
            "<span class='badge badge-custom-3'>" +
            kendo.htmlEncode(dataItem.type) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-3'>" +
            'REMITIDO' +
            "</span>"
          );
      }
    },

    readData: function(xhr) {
      let self = this
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"))
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      xhr.setRequestHeader("Accept-Language", "en")
      xhr.setRequestHeader("Accept", "application/json")
      xhr.done(function(data) {
        self.$emit("receivable", false)
      })
      xhr.fail(function(data) {
        if (data.status === 403) self.$router.push({ path: '/system/403' })
        if (data.status === 401 || data.responseJSON.message == "Unauthenticated.") {
          self.$store.dispatch('responseMessage', {
            type: 'warning',
            text: 'No tiene una sesión activa, por favor vuelva a iniciar sesión.',
            title: 'Sesión Expirada!',
            modal: true
          })
          .then(async() => {
            await self.$store.dispatch('cleanSession')
            self.$router.push({ path: '/system/login' })
          })
        }
      })
    },

    stateType(element) {
      let type = [
        { title: "FACTURA", value: "FACTURA" },
        { title: "N.REMISION", value: "N.REMISION" },
      ]

      element.element.kendoDropDownList({
        dataSource: type,
        dataTextField: "title",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "value",
        optionLabel: {
          title: "-Seleccione-",
          value: ""
        }
      })
    },

    customerFilter(element) {
      let dataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: `${API_URL}/customers/listing`,
            dataType: "json"
          }
        }
      })

      element.element.kendoDropDownList({
        dataSource: dataSource,
        dataTextField: "business_name",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          business_name: "-Seleccione-",
          id: ""
        }
      })
    },

    userFilter(element) {
      let dataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: `${API_URL}/users/listing`,
            dataType: "json"
          }
        }
      })

      element.element.kendoDropDownList({
        filter: "contains",
        dataSource: dataSource,
        dataTextField: "name",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          name: "-Seleccione-",
          id: ""
        }
      })
    },

    parameterMap: function(data, type) {
      if (type == "read" && data.filter !== undefined) {
        let dates = data.filter.filters.filter(e => e.operator == "lte" || e.operator == "gte")
        if (dates.length > 0) {
          data.filter.filters.forEach(item => {
            if (dates.includes(item)) {
              item.value = kendo.toString(item.value, "yyyy-MM-dd")
            }
          })
        }
        return data
      } else return data
    },

    emptyAccountReceivable() {
      this.$store.dispatch("emptyAccountReceivable")
      .then(() => {
        let grid = this.$refs.gridReceivable.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsAccountsReceivable.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid, ...obj} = grid.dataItem(row)
          obj.date = kendo.toString(obj.date, "dd/MM/yyyy")
          vm.$store.dispatch("setItemAccountReceivable", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemAccountReceivable", index)
        }
      })
    },

    dataBound(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      let itemsToSelect = []
      items.each(function(idx, row) {
        let dataItem = grid.dataItem(row).get("id")
        let index = vm.itemsAccountsReceivable.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(3)", function(e) {
        let element = e.target || e.srcElement
        let data = grid.dataItem($(element).closest("tr"))
        vm.payments = Array.from(data.payments.data)
        vm.model = data.type
        vm.type_id = data.id
        vm.totalItem = Number(vm.toFloat(data.amount))
        vm.visibleDetail = true
      })
    },

    async pdfListAccountReceivable() {
      this.$store.dispatch("showLoader")
      let data = this.itemsAccountsReceivable.map(item => item.id)
      try {
        const accounts = await AccountService.pdfListAccountReceivable({accounts: data})
        if (accounts.status === 200) {
          let blob = new Blob([accounts.data])
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

    async excelListAccountReceivable() {
      this.$store.dispatch("showLoader")
      let data = this.itemsAccountsReceivable.map(item => item.id)
      try {
        const accounts = await AccountService.excelListAccountReceivable({accounts: data})
        if (accounts.status === 200) {
          let blob = new Blob([accounts.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = "Lista.xlsx"
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/grid.css"></style>
<style lang="css">
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Buscar';
}

.fieldset {
  border-radius: 4px;
  border: 1px solid black;
}

legend {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  font-size: 13px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}

.demo-gallery > div {
  width: 150px;
  height: 150px;
  display: inline-block;
  margin:0 auto;
  list-style: outside none none;
}

.demo-gallery > div > a {
  border: 3px solid #FFF;
  border-radius: 3px;
  display: block;
  overflow: hidden;
  position: relative;
}

.demo-gallery > div > a > img {
  -webkit-transition: -webkit-transform 0.15s ease 0s;
  -moz-transition: -moz-transform 0.15s ease 0s;
  -o-transition: -o-transform 0.15s ease 0s;
  transition: transform 0.15s ease 0s;
  -webkit-transform: scale3d(1, 1, 1);
  transform: scale3d(1, 1, 1);
  height: 100%;
  width: 100%;
}

.demo-gallery > div > a:hover > img {
  -webkit-transform: scale3d(1.1, 1.1, 1.1);
  transform: scale3d(1.1, 1.1, 1.1);
}

.demo-gallery > div > a:hover .demo-gallery-poster > img {
  opacity: 1;
}

.demo-gallery > div > a .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transition: background-color 0.15s ease 0s;
  -o-transition: background-color 0.15s ease 0s;
  transition: background-color 0.15s ease 0s;
}

.demo-gallery > div > a .demo-gallery-poster > img {
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  opacity: 0;
  position: absolute;
  top: 50%;
  -webkit-transition: opacity 0.3s ease 0s;
  -o-transition: opacity 0.3s ease 0s;
  transition: opacity 0.3s ease 0s;
}

.demo-gallery > div > a:hover .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.5);
}

.air__utils__avatar > div > a {
  display: block;
  overflow: hidden;
  position: relative;
  float: left;
}

.air__utils__avatar > div > a:hover > img {
  -webkit-transform: scale3d(1.1, 1.1, 1.1);
  transform: scale3d(1.1, 1.1, 1.1);
}

.air__utils__avatar > div > a:hover .demo-gallery-poster > img {
  opacity: 1;
}

.air__utils__avatar > div > a .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transition: background-color 0.15s ease 0s;
  -o-transition: background-color 0.15s ease 0s;
  transition: background-color 0.15s ease 0s;
}

.air__utils__avatar > div > a .demo-gallery-poster > img {
  left: 40%;
  margin-left: -5px;
  margin-top: -5px;
  opacity: 0;
  position: absolute;
  top: 40%;
  width: 20px;
  -webkit-transition: opacity 0.3s ease 0s;
  -o-transition: opacity 0.3s ease 0s;
  transition: opacity 0.3s ease 0s;
}

.air__utils__avatar > div > a:hover .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>