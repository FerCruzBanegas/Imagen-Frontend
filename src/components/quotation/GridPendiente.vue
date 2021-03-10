<template>
  <div class="container">
    <div class="row justify-content-center">
      <div class="table-responsive">
        <div class="container">
          <div class="row p-2 bg-secondary">
            <div class="col-md-6">
              <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
                <i class="fa fa-check-square-o"></i>
              </b-button>
              <b-button title="Descargar PDF" @click="pdfListQuotation" variant="danger" class="ml-2">
                <i class="fa fa-file-pdf-o"></i>
                <span v-if="itemsPending.length > 0">({{ itemsPending.length }})</span>
              </b-button>
              <b-button title="Descargar EXCEL" @click="excelListQuotation" variant="success" class="ml-2">
                <i class="fa fa-file-excel-o"></i>
                <span v-if="itemsPending.length > 0">({{ itemsPending.length }})</span>
              </b-button>
            </div>
            <div class="col-md-2 ml-auto">
              <div class="menu" style="border-radius: 4px; float: right; background: #f6f6f6; padding: 0.2em;"/>
              </div>
            </div>
          </div>
          <kendo-datasource
            ref="datasource1"
            :schema-total="'meta.total'"
            :schema-data="'data'"
            :transport-read="{ url: `${url}/quotations/pending`, beforeSend: readData }"
            :transport-parameter-map="parameterMap"
            :page-size="10"
            :server-paging="true"
            :server-filtering="true"
            :server-sorting="true"
            :schema-model-fields="dsSchemaFields"
          ></kendo-datasource>

          <kendo-grid
            ref="grid"
            :data-source-ref="'datasource1'"
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
            @change="onChange"
            @databound="dataBound"
          >
            <kendo-grid-column :selectable="true" :width="30"></kendo-grid-column>
            <kendo-grid-column
              :field="'cite'"
              :title="'CITE'"
              :width="105"
              :template="templateCite"
              :filterable-cell-operator="'contains'"
              :filterable-cell-suggestion-operator="'contains'"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'date'"
              :title="'FECHA'"
              :format="'{0:dd/MM/yyyy}'"
              :width="110"
            ></kendo-grid-column>
            <kendo-grid-column :field="'amount'" :title="'MONTO'" :width="50" :filterable="false"></kendo-grid-column>
            <kendo-grid-column
              :field="'customer'"
              :title="'CLIENTE'"
              :width="150"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="customerFilter"
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
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import QuotationService from "../../services/quotation.service"

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
    }
  },

  computed: {
    ...mapGetters(["itemsGeneral", "itemsPending"])
  },

  mounted() {
    let grid = this.$refs.grid.kendoWidget()
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
    templateCite(dataItem) {
      return (
        "<a href='/servicios/cotizaciones/" + dataItem.id +"' class='btn btn-link'>" +
        kendo.htmlEncode(dataItem.cite) +
        "</a>"
      )
    },

    readData: function(xhr) {
      let self = this
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"))
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      xhr.setRequestHeader("Accept-Language", "en")
      xhr.setRequestHeader("Accept", "application/json")
      xhr.done(function(data) {
        self.$emit("pendiente", false)
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
        let grid = this.$refs.grid.kendoWidget()
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

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(2)", function(e) {
        let element = e.target || e.srcElement
        let data = grid.dataItem($(element).closest("tr"))
        vm.$router.push({name: "ShowQuotation", params: { id: data.id }})
      })
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
