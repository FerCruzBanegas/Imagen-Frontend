<template>
  <div class="container">
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsInvoice"
      :access="'invoices'"
      @hide="visibleModal = !visibleModal"
    ></modal-grid>
    <modal-invoice v-if="checkInvoice" :invoice="checkInvoice" :visible="visibleInvoice" @hide="closeModalInvoice">
    </modal-invoice>
    <modal-edit-invoice v-if="editInvoice" :invoice="editInvoice" :visible="visibleEdit" @hide="closeModalEditInvoice">
    </modal-edit-invoice>
    <modal-question
      :title="'Alerta'"
      :visible="visibleQuestion"
      :alert_message="'Realmente desea anular esta factura?'"
      :loading="loadingAlert"
      @hide="visibleQuestion = !visibleQuestion"
      @submit="cancelInvoice"
    ></modal-question>
    <div class="row">
      <div class="table-responsive">
        <div class="d-flex flex-sm-row flex-column bg-secondary">
          <div class="mr-auto p-2">
            <b-button @click="visibleModal = true" v-if="itemsInvoice.length > 0" squared variant="outline-danger" class="mr-2">
              <i class="fa fa-check-square"></i>
              ({{ itemsInvoice.length }}) Seleccionados
            </b-button>
            <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
              <i class="fa fa-check-square-o"></i>
            </b-button>
            <b-button title="Descargar PDF" @click="pdfListInvoice" variant="danger" class="ml-2">
              <i class="fa fa-file-pdf-o"></i>
              <span v-if="itemsInvoice.length > 0">({{ itemsInvoice.length }})</span>
            </b-button>
            <b-button title="Descargar EXCEL" @click="excelListInvoice" variant="success" class="ml-2">
              <i class="fa fa-file-excel-o"></i>
              <span v-if="itemsInvoice.length > 0">({{ itemsInvoice.length }})</span>
            </b-button>
          </div>
          <div class="p-2">
            <b-button title="Actualizar Tabla" @click="reloadTable" variant="dark" class="mr-2">
              <i class="fa fa-repeat"></i> Recargar
            </b-button>
            <div class="menu" style="border-radius: 4px; float: right; background: #f6f6f6; padding: 0.2em;"/>
          </div>
        </div>
        <kendo-datasource
          ref="data-invoice"
          :schema-total="'meta.total'"
          :schema-data="'data'"
          :transport-read="{ url: `${url}/invoices`, beforeSend: readData }"
          :transport-parameter-map="parameterMap"
          :page-size="10"
          :server-paging="true"
          :server-filtering="true"
          :server-sorting="true"
          :schema-model-fields="dsSchemaFields"
        ></kendo-datasource>
        <kendo-grid
          ref="gridInvoice"
          :data-source-ref="'data-invoice'"
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
        >
          <kendo-grid-column :selectable="true" :width="45"></kendo-grid-column>
          <kendo-grid-column
            :field="'number'"
            :title="'NÚMERO'"
            :width="140"
            :template="templateNumber"
            :filterable-cell-operator="'contains'"
            :filterable-cell-suggestion-operator="'contains'"
          ></kendo-grid-column>
          <kendo-grid-column
            :filterable="false"
            :field="'date'"
            :title="'FECHA'"
            :width="100"
            :format="'{0:dd/MM/yyyy}'"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'nit_name'"
            :title="'RAZÓN S.'"
            :width="130"
            :filterable="false"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'state'"
            :title="'ESTADO'"
            :width="150"
            :template="templateState"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="stateFilter"
          ></kendo-grid-column>
          <kendo-grid-column :template="templateTotal" :field="'total'" :title="'TOTAL'" :width="80" :filterable="false"></kendo-grid-column>
          <kendo-grid-column
            :field="'customer'"
            :title="'CLIENTE'"
            :width="240"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="customerFilter"
          ></kendo-grid-column>
          <kendo-grid-column
            :command="[{className: 'k-grid-edit', name: 'edit', text: '', iconClass: 'fa fa-edit', click: openModalEdit}]" 
            :width="55"
          ></kendo-grid-column>
          <kendo-grid-column
            :command="[{className: 'k-grid-anuled', name: 'anuled', text: '', iconClass: 'fa fa-ban', click: openModalDelete}]" 
            :width="55"
          ></kendo-grid-column>
        </kendo-grid>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
import permission from '../../mixins/permission'
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import InvoiceService from "../../services/invoice.service"
import ModalGrid from "../widgets/Modals/ModalGridInvoice.vue"
import ModalInvoice from "../widgets/Modals/ModalInvoice.vue"
import ModalEditInvoice from "../widgets/Modals/ModalEditInvoice.vue"
import ModalQuestion from "../widgets/Modals/ModalQuestion.vue"

export default {
  data() {
    return {
      url: API_URL,
      dsSchemaFields: {
        number: { type: "string" },
        date: { type: "date", format: "{0:dd/MM/yyyy}" },
        nit_name: { type: "string" },
        state: { from: "state.title" },
        total: { type: "string" },
        customer: { from: "customer.name" },
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
      invoice: null,
      columns: [
        { key: 'number', label: 'Número'},
        { key: 'opening_date', label: 'Apertura'},
        { key: 'estimated_date', label: 'Estimada'},
        { key: 'cite', label: 'Cotización'},
        { key: 'type_work', label: 'Tipo de Trabajo'},
      ],
      invoiceId: null,
      visibleModal: false,
      visibleInvoice: false,
      visibleQuestion: false,
      visibleEdit: false,
      loadingAlert: false,
      checkInvoice: null,
      editInvoice: null,
    }
  },

  computed: {
    ...mapGetters(["itemsInvoice"])
  },

  components: {
    "modal-grid": ModalGrid,
    "modal-invoice": ModalInvoice,
    "modal-edit-invoice": ModalEditInvoice,
    "modal-question": ModalQuestion,
  },

  mixins: [permission],

  created () {
    this.$bus.$on('searchInvoice', (data) => {
      let array = []
      Object.entries(data).forEach(entry => {
        const [key, value] = entry;
        if(value) {
          let obj = {
            operator: 'custom',
            value: value,
            field: key.toString()
          }
          array.push(obj)
        }
      })
      this.$refs.gridInvoice.kendoWidget().dataSource.filter(array)
    })
  },

  mounted() {
    let grid = this.$refs.gridInvoice.kendoWidget()
    let ds = []
    for (let i = 1, max = grid.columns.length; i < max; i++) {
      if (grid.columns[i].field) {
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
    reloadTable() {
      this.$refs.gridInvoice.kendoWidget().dataSource.filter({})
    },

    openModalEdit(ev) {
      ev.preventDefault()
      // this.visibleEdit = true
    },

    openModalDelete(ev) {
      ev.preventDefault()
      this.visibleQuestion = true
    },

    async cancelInvoice() {
      try {
        this.loadingAlert = true
        const response = await InvoiceService.cancelInvoice(this.invoiceId)
        if (response.status === 200) {
          if(response.data.success == undefined) {
            this.$refs.gridInvoice.kendoWidget().dataSource.read()
            this.loadingAlert = false
            this.visibleQuestion = false
            this.$message.success(response.data.message)
          } else {
            throw new Error(response.data.message)
          }
        }
      } catch (err) {
        this.visibleQuestion = false
        this.loadingAlert = false
        this.$message.warning(err.message)
      }
    },

    closeModalInvoice() {
      this.visibleInvoice = false
      this.checkInvoice = null
    },

    closeModalEditInvoice() {
      this.$refs.gridInvoice.kendoWidget().dataSource.read()
      this.visibleEdit = false
    },

    templateNumber(dataItem) {
      return (
        "<span class='btn btn-link'>" +
        kendo.htmlEncode(dataItem.number) +
        "</span>"
      )
    },

    templateTotal(dataItem) {
      return parseFloat(kendo.htmlEncode(dataItem.total)).toLocaleString('en-US', { minimumFractionDigits: 2 })
    },

    templateState(dataItem) {
      switch (dataItem.state) {
        case "VÁLIDO":
          return (
            "<span class='badge badge-success'>" +
            kendo.htmlEncode(dataItem.state) +
            "</span>"
          );
          break;
        case "ANULADO":
          return (
            "<span class='badge badge-danger'>" +
            kendo.htmlEncode(dataItem.state) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-success'>" +
            kendo.htmlEncode(dataItem.state) +
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
        self.$emit("general", false)
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

    stateFilter(element) {
      let condition = [
        { title: "VÁLIDO", id: 1 },
        { title: "ANULADO", id: 0 },
      ]

      element.element.kendoDropDownList({
        dataSource: condition,
        dataTextField: "title",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          title: "-Seleccione-",
          id: ""
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
        filter: "contains",
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
    parameterMap: function(data, type) {
      if (type == "read" && data.filter) {
        let dates = data.filter.filters.filter(
          e => e.operator == "lte" || e.operator == "gte"
        )
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

    emptyGridSelected() {
      this.$store.dispatch("emptyInvoice")
      .then(() => {
        let grid = this.$refs.gridInvoice.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsInvoice.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem(row)
          obj.date = kendo.toString(obj.date, "dd/MM/yyyy")
          vm.$store.dispatch("setItemInvoice", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemInvoice", index)
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
        let state = grid.dataItem(row).get("state")
        if (state == 'ANULADO') {
            $(this).find(".k-grid-anuled").addClass("k-state-disabled");
        }
        
        let index = vm.itemsInvoice.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(2)", function(e) {
        let element = e.target || e.srcElement
        let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem($(element).closest("tr"))
        vm.checkInvoice = obj
        vm.visibleInvoice = true
      })

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(7)", function(e) {
        let element = e.target || e.srcElement
        let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem($(element).closest("tr"))
        obj.date = kendo.toString(obj.date, "yyyy-MM-dd")
        vm.editInvoice = obj
        // console.log(obj)
        vm.visibleEdit = true
      })

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(8)", function(e) {
        let element = e.target || e.srcElement
        let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem($(element).closest("tr"))
        vm.invoiceId = obj.id
      })
    },

    async pdfListInvoice() {
      this.$store.dispatch("showLoader")
      let data = this.itemsInvoice.map(item => item.id)
      try {
        const invoices = await InvoiceService.pdfListInvoice({invoice: data})
        if (invoices.status === 200) {
          let blob = new Blob([invoices.data])
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

    async excelListInvoice() {
      this.$store.dispatch("showLoader")
      let data = this.itemsInvoice.map(item => item.id)
      try {
        const invoices = await InvoiceService.excelListInvoice({invoice: data})
        if (invoices.status === 200) {
          let blob = new Blob([invoices.data])
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
