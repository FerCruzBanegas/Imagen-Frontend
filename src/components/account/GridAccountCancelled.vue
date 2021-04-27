<template>
  <div class="container">
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsAccountsCancelled"
      :access="'invoices'"
      @hide="visibleModal = !visibleModal"
    ></modal-grid>
    <modal-detail :title="'Registro de Pagos'" :visible="visibleDetail" @hide="hideDetailPayment">
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
          <div class="col-md-2 ml-auto border">
            <div class="h5 font-weight-bold pt-2">TOTAL (BS)&nbsp:</div>
          </div>
          <div class="col-md-2 border" style="background: #4e4e4e;">
            <div class="text-white h6 font-weight-bold pt-2">{{ total | currency }}</div>
          </div>
        </div>
      </div>
    </modal-detail>
    <div class="row">
      <div class="table-responsive">
        <div class="d-flex flex-sm-row flex-column bg-secondary">
          <div class="mr-auto p-2">
            <b-button @click="visibleModal = true" v-if="itemsAccountsCancelled.length > 0" squared variant="outline-danger" class="mr-2">
              <i class="fa fa-check-square"></i>
              ({{ itemsAccountsCancelled.length }}) Seleccionados
            </b-button>
            <b-button title="Quitar Seleccionados" @click="emptyAccountCancelled" variant="outline-dark">
              <i class="fa fa-check-square-o"></i>
            </b-button>
            <b-button title="Descargar PDF" @click="pdfListAccountCancelled" variant="danger" class="ml-2">
              <i class="fa fa-file-pdf-o"></i>
              <span v-if="itemsAccountsCancelled.length > 0">({{ itemsAccountsCancelled.length }})</span>
            </b-button>
            <b-button title="Descargar EXCEL" @click="excelListAccountCancelled" variant="success" class="ml-2">
              <i class="fa fa-file-excel-o"></i>
              <span v-if="itemsAccountsCancelled.length > 0">({{ itemsAccountsCancelled.length }})</span>
            </b-button>
          </div>
          <div class="p-2">
            <b-button title="Actualizar Tabla" @click="reloadTable" variant="dark"  class="mr-2">
              <i class="fa fa-repeat"></i> Recargar
            </b-button>
            <div class="menu" style="border-radius: 4px; max-width: 180px; float: right; background: #f6f6f6; padding: 0.2em;"/>
          </div>
        </div>
        <kendo-datasource
          ref="datasource2"
          :schema-total="'meta.total'"
          :schema-data="'data'"
          :transport-read="{ url: `${url}/accounts/cancelled`, beforeSend: readData }"
          :transport-parameter-map="parameterMap"
          :page-size="10"
          :server-paging="true"
          :server-filtering="true"
          :server-sorting="true"
          :schema-model-fields="dsSchemaFields"
        ></kendo-datasource>
        <kendo-grid
          ref="gridCancelled"
          :data-source-ref="'datasource2'"
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
          :resizable="true"
          @change="onChange"
          @databound="dataBound"
          :detailTemplate="itemTemplate"
        >
          <kendo-grid-column :selectable="true" :width="30"></kendo-grid-column>
          <kendo-grid-column
            :field="'cite'"
            :title="'CITE'"
            :width="90"
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
            :field="'closing_date'"
            :title="'FECHA CIERRE'"
            :width="100"
            :format="'{0:dd/MM/yyyy}'"
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
</template>

<script>
import $ from "jquery"
import Vue from "vue"
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import formatter from '../../mixins/formatter'
import Payment from '../../models/Payment'
import AccountService from "../../services/account.service"
import ModalGrid from "../widgets/Modals/ModalGridInvoice.vue"
import ModalDetail from "../widgets/Modals/ModalAccount.vue"
import Template from "./DetailTemplate.vue"

export default {
  data() {
    return {
      url: API_URL,
      payment: new Payment(),
      dsSchemaFields: {
        cite: { type: "string" },
        number: { type: "string" },
        type: { type: "string" },
        amount: { type: "string" },
        closing_date: { type: "date", format: "{0:dd/MM/yyyy}" },
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
      visibleModal: false,
      visibleDetail: false,
      payments: [],
      sortBy: 'id',
      sortDesc: true,
      columns: [
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
    }
  },

  mixins: [formatter],

  computed: {
    ...mapGetters(["itemsAccountsCancelled"]),
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
      this.$refs.gridCancelled.kendoWidget().dataSource.filter(array)
    })
  },

  mounted() {
    let grid = this.$refs.gridCancelled.kendoWidget()
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
            parentComponent: this.$refs.gridCancelled
        })
      }
    },

    reloadTable() {
      this.$refs.gridCancelled.kendoWidget().dataSource.filter({})
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
      }
      reader.readAsDataURL(file)
    },

    hideDetailPayment() {
      this.$refs.gridCancelled.kendoWidget().dataSource.read()
      this.visibleDetail = false
      this.payment = new Payment()
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
        self.$emit("cancelled", false)
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

    emptyAccountCancelled() {
      this.$store.dispatch("emptyAccountCancelled")
      .then(() => {
        let grid = this.$refs.gridCancelled.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsAccountsCancelled.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid, ...obj} = grid.dataItem(row)
          obj.closing_date = kendo.toString(obj.closing_date, "dd/MM/yyyy")
          vm.$store.dispatch("setItemAccountCancelled", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemAccountCancelled", index)
        }
      })
    },

    detailInit: function (e) {
      let data = {
        'CLIENTE' : e.data.customer_data.business_name,
        'CIUDAD' : e.data.customer_data.city.name
      }
      $('<div />').appendTo(e.detailCell).kendoGrid({
        dataSource: [data],
      })
    },

    dataBound(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      let itemsToSelect = []
      items.each(function(idx, row) {
        let dataItem = grid.dataItem(row).get("id")
        let index = vm.itemsAccountsCancelled.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(3)", function(e) {
        let element = e.target || e.srcElement
        let data = grid.dataItem($(element).closest("tr"))
        vm.payments = Array.from(data.payments.data)
        vm.visibleDetail = true
      })
    },

    async pdfListAccountCancelled() {
      this.$store.dispatch("showLoader")
      let data = this.itemsAccountsCancelled.map(item => item.id)
      try {
        const accounts = await AccountService.pdfListAccountCancelled({accounts: data})
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

    async excelListAccountCancelled() {
      this.$store.dispatch("showLoader")
      let data = this.itemsAccountsCancelled.map(item => item.id)
      try {
        const accounts = await AccountService.excelListAccountCancelled({accounts: data})
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