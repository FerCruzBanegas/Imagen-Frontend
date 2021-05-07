<template>
  <div class="container">
    <modal-form
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsGeneral"
      :access="'quotations'"
      :alert_message="'Realmente desea eliminar estos datos?'"
      @hide="visibleModal = !visibleModal"
      @deleted="deleted"
    ></modal-form>
    <div class="row">
      <div class="table-responsive">
        <div class="d-flex flex-sm-row flex-column bg-secondary">
          <div class="mr-auto p-2">
            <b-button @click="visibleModal = true" v-if="itemsGeneral.length > 0" squared variant="outline-danger" class="mr-2">
              <i class="fa fa-check-square"></i>
              ({{ itemsGeneral.length }}) Seleccionados
            </b-button>
            <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
              <i class="fa fa-check-square-o"></i>
            </b-button>
            <b-button title="Descargar PDF" @click="pdfListQuotation" variant="danger" class="ml-2">
              <i class="fa fa-file-pdf-o"></i>
              <span v-if="itemsGeneral.length > 0">({{ itemsGeneral.length }})</span>
            </b-button>
            <b-button title="Descargar EXCEL" @click="excelListQuotation" variant="success" class="ml-2">
              <i class="fa fa-file-excel-o"></i>
              <span v-if="itemsGeneral.length > 0">({{ itemsGeneral.length }})</span>
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
          ref="data-quotations"
          :schema-total="'meta.total'"
          :schema-data="'data'"
          :transport-read="{ url: `${url}/quotations`, beforeSend: readData }"
          :transport-parameter-map="parameterMap"
          :page-size="10"
          :server-paging="true"
          :server-filtering="true"
          :server-sorting="true"
          :schema-model-fields="dsSchemaFields"
        ></kendo-datasource>
        <kendo-grid
          ref="gridQuotations"
          :data-source-ref="'data-quotations'"
          :no-records="true"
          :messages-no-records="'NO EXISTEN RESULTADOS'"
          :groupable="true"
          :filterable="filterableConfig"
          :navigatable="true"
          :pageable-always-visible="true"
          :pageable-page-sizes="[10, 20, 50, 100]"
          :pageable-button-count="3"
          :pageable-responsive="false"
          :pageable-refresh="true"
          :sortable="true"
          :resizable="true"
          @change="onChange"
          @databound="dataBound"
        >
          <kendo-grid-column :selectable="true" :width="45"></kendo-grid-column>
          <kendo-grid-column
            :field="'cite'"
            :title="'CITE'"
            :width="130"
            :template="templateCite"
            :filterable-cell-operator="'contains'"
            :filterable-cell-suggestion-operator="'contains'"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'date'"
            :title="'FECHA'"
            :width="150"
            :format="'{0:dd/MM/yyyy}'"
          ></kendo-grid-column>
          <kendo-grid-column :field="'amount'" :title="'MONTO'" :width="80" :filterable="false"></kendo-grid-column>
          <kendo-grid-column
            :field="'state'"
            :title="'ESTADO'"
            :width="170"
            :template="templateState"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="stateFilter"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'customer'"
            :title="'CLIENTE'"
            :width="260"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="customerFilter"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'user'"
            :title="'USUARIO'"
            :width="140"
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
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import QuotationService from "../../services/quotation.service"
import ModalForm from "../widgets/Modals/ModalGridSelected.vue"

export default {
  data() {
    return {
      url: API_URL,
      dsSchemaFields: {
        cite: { type: "string" },
        date: { type: "date", format: "{0:dd/MM/yyyy}" },
        amount: { type: "string" },
        state: { from: "state.title" },
        customer: { from: "customer.business_name" },
        user: { from: "user.name" }
      },
      filterableConfig: {
        // extra: false,
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
      visibleModal: false
    }
  },

  computed: {
    ...mapGetters(["itemsGeneral"])
  },

  components: {
    "modal-form": ModalForm
  },

  mounted() {
    let grid = this.$refs.gridQuotations.kendoWidget()
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
    reloadTable() {
      this.$refs.gridQuotations.kendoWidget().dataSource.filter({})
    },

    async deleted() {
      let data = this.itemsGeneral.map(item => item.id)
      try {
        const response = await QuotationService.deleteQuotation(data)
        if (response.status === 200) {
          this.$store.dispatch("emptyQuotation")
          this.visibleModal = false
          this.$refs.gridQuotations.kendoWidget().dataSource.read()
          this.$bus.$emit('success')
          this.$message.success(response.data.message)
          if (response.data.data.length > 0) {
            this.$notification.warning({
              message: 'Nota',
              description: 'Algunas de las cotizaciones seleccionadas no se eliminaron, por que ya fueron aprobadas.',
              duration: 10,
            })
          }
        }
      } catch (err) {
        this.$store.dispatch("emptyQuotation")
      }
    },

    templateCite(dataItem) {
      return (
        "<a href='/servicios/cotizaciones/" + dataItem.id +"' class='btn btn-link'>" +
        kendo.htmlEncode(dataItem.cite) +
        "</a>"
      )
    },

    templateState(dataItem) {
      switch (dataItem.state) {
        case "PENDIENTE":
          return (
            "<span class='badge badge-purple-2'>" +
            kendo.htmlEncode(dataItem.state) +
            "</span>"
          );
          break;
        case "APROBADO":
          return (
            "<span class='badge badge-primary'>" +
            kendo.htmlEncode(dataItem.state) +
            "</span>"
          );
          break;
        case "EJECUTADO":
          return (
            "<span class='badge badge-secondary'>" +
            kendo.htmlEncode(dataItem.state) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-purple-2'>" +
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
        { title: "PENDIENTE", id: 1 },
        { title: "APROBADO", id: 2 },
        { title: "EJECUTADO", id: 3 }
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

    emptyGridSelected() {
      this.$store.dispatch("emptyQuotation")
      .then(() => {
        let grid = this.$refs.gridQuotations.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsGeneral.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid, ...obj} = grid.dataItem(row)
          obj.date = kendo.toString(obj.date, "dd/MM/yyyy")
          vm.$store.dispatch("setItemQuotation", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemQuotation", index)
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
        let index = vm.itemsGeneral.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      // grid.element.on("click", "tbody tr[data-uid] td:nth-child(2)", function(e) {
      //   let element = e.target || e.srcElement
      //   let data = grid.dataItem($(element).closest("tr"))
      //   vm.$router.push({name: "ShowQuotation", params: { id: data.id }})
      // })
    },

    async pdfListQuotation() {
      this.$store.dispatch("showLoader")
      let data = this.itemsGeneral.map(item => item.id)
      try {
        const quotations = await QuotationService.pdfListQuotation({quotation: data})
        if (quotations.status === 200) {
          let blob = new Blob([quotations.data])
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

    async excelListQuotation() {
      this.$store.dispatch("showLoader")
      let data = this.itemsGeneral.map(item => item.id)
      try {
        const quotations = await QuotationService.excelListQuotation({quotation: data})
        if (quotations.status === 200) {
          let blob = new Blob([quotations.data])
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
