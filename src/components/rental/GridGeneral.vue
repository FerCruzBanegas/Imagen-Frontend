<template>
  <div class="container">
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsRental"
      :access="'Rentals'"
      :alert_message="'Realmente desea eliminar estos datos?'"
      @hide="visibleModal = !visibleModal"
      @deleted="deleted"
    ></modal-grid> 
    <div class="row">
      <div class="table-responsive">
        <div class="d-flex flex-sm-row flex-column bg-secondary">
          <div class="mr-auto p-2">
            <b-button @click="visibleModal = true" v-if="itemsRental.length > 0" squared variant="outline-danger" class="mr-2">
              <i class="fa fa-check-square"></i>
              ({{ itemsRental.length }}) Seleccionados
            </b-button>
            <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
              <i class="fa fa-check-square-o"></i>
            </b-button>
            <b-button title="Descargar Lista PDF" @click="pdfListRental" variant="danger" class="ml-2">
              <i class="fa fa-file-pdf-o"></i>
              <span v-if="itemsRental.length > 0">({{ itemsRental.length }})</span>
            </b-button>
            <b-button title="Descargar Detalle PDF" @click="pdfDetailRental" variant="warning" class="ml-2">
              <i class="fa fa-file-image-o"></i>
              <span v-if="itemsRental.length > 0">({{ itemsRental.length }})</span>
            </b-button>
            <b-button title="Descargar Lista EXCEL" @click="excelListRental" variant="success" class="ml-2">
              <i class="fa fa-file-excel-o"></i>
              <span v-if="itemsRental.length > 0">({{ itemsRental.length }})</span>
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
          ref="data-rental"
          :schema-total="'meta.total'"
          :schema-data="'data'"
          :transport-read="{ url: `${url}/rentals`, beforeSend: readData }"
          :transport-parameter-map="parameterMap"
          :page-size="10"
          :server-paging="true"
          :server-filtering="true"
          :server-sorting="true"
          :schema-model-fields="dsSchemaFields"
        ></kendo-datasource>
        <kendo-grid
          ref="gridRental"
          :data-source-ref="'data-rental'"
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
          <kendo-grid-column :selectable="true" :width="40"></kendo-grid-column>
          <kendo-grid-column
            :command="[{className: 'k-grid-edit', name: 'edit', text: '', iconClass: 'fa fa-eye', click: show}]" 
            :width="45"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'date_start'"
            :title="'F.INICIO'"
            :width="100"
            :format="'{0:dd/MM/yyyy}'"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'date_end'"
            :title="'F.FIN'"
            :width="100"
            :format="'{0:dd/MM/yyyy}'"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'condition'"
            :title="'CONDICIÓN'"
            :width="120"
            :template="templateCondition"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="conditionFilter"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'customer'"
            :title="'CLIENTE'"
            :width="150"
            :sortable="false"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="customerFilter"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'location'"
            :title="'UBICACIÓN'"
            :width="150"
            :filterable-cell-operator="'contains'"
            :filterable-cell-suggestion-operator="'contains'"
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
import RentalService from "../../services/rental.service"
import CustomerService from '../../services/customer.service'
import ModalDetail from "../widgets/Modals/ModalDetail.vue"
import ModalGrid from "../widgets/Modals/ModalGridSelected.vue"

export default {
  data() {
    return {
      url: API_URL,
      dsSchemaFields: {
        date_start: { type: "date", format: "{0:dd/MM/yyyy}" },
        date_end: { type: "date", format: "{0:dd/MM/yyyy}" },
        condition: { from: "condition.title" },
        customer: { from: "customer.business_name" },
        location: { from: "billboard.location" },
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
    }
  },

  computed: {
    ...mapGetters(["itemsRental"])
  },

  components: {
    "modal-detail": ModalDetail,
    "modal-grid": ModalGrid
  },

  mixins: [permission],

  // created() {
  //   this.listCities()
  // },

  mounted() {
    let grid = this.$refs.gridRental.kendoWidget()
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
    listCities: async function() {
      const cities = await CityService.listCities()
      if (cities.status === 200) {
        this.cities = cities.data
      }
    },

    reloadTable() {
      this.$refs.gridRental.kendoWidget().dataSource.filter({})
    },

    show(ev) {
      ev.preventDefault()
      let gridWidget = this.$refs.gridRental.kendoWidget()
      let tr = $(ev.target).closest('tr')
      let data = gridWidget.dataItem(tr)
      this.$router.push({name: "ShowRental", params: { id: data.id }})
    },

    async deleted() {
      let data = this.itemsRental.map(item => item.id)
      const response = await RentalService.deleteRental(data)
      if (response.status === 200) {
        this.$store.dispatch("emptyRental")
        this.$refs.gridRental.kendoWidget().dataSource.read()
        this.visibleModal = false
        this.$bus.$emit('success')
        this.$message.success(response.data.message)
        if (response.data.data.length > 0) {
          this.$notification.warning({
            message: 'Nota',
            description: 'Alguno de los items seleccionados no se eliminaron, por que son utilizados en otros registros.',
            duration: 10,
          })
        }
      }
    },

    templateCode(dataItem) {
      return (
        "<a href='/servicios/vallas/" + dataItem.id +"' class='btn btn-link'>" +
        kendo.htmlEncode(dataItem.code) +
        "</a>"
      )
    },

    templateCondition(dataItem) {
      switch (dataItem.condition) {
        case 'Activo':
          return (
            "<span class='badge badge-custom-6'>" +
            kendo.htmlEncode(dataItem.condition) +
            "</span>"
          );
          break;
        case 'Terminado':
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(dataItem.condition) +
            "</span>"
          );
          break;
        case 'Renovado':
          return (
            "<span class='badge badge-custom-5'>" +
            kendo.htmlEncode(dataItem.condition) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(dataItem.condition) +
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

    conditionFilter(element) {
      let condition = [
        { title: "ACTIVO", id: 1 },
        { title: "TERMINADO", id: 0 },
        { title: "RENOVADO", id: 2 }
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
          read: function(options) {
            $.ajax({
              url: `${API_URL}/customers/listing`,
              dataType: "json",
              success: function(result) {
                options.success(result)
              },
              error: function(result) {
                options.error(result)
              }
            })
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
      this.$store.dispatch("emptyRental")
      .then(() => {
        let grid = this.$refs.gridRental.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsRental.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem(row)
          obj.date_start = kendo.toString(obj.date_start, "dd/MM/yyyy")
          obj.date_end= kendo.toString(obj.date_end, "dd/MM/yyyy")
          vm.$store.dispatch("setItemRental", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemRental", index)
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
        let index = vm.itemsRental.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(2)", function(e) {
        let element = e.target || e.srcElement
        let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem($(element).closest("tr"))
        vm.employee = obj
        vm.work_orders = Array.from(obj.work_orders)
        vm.visibleDetail = true
      })
    },

    async pdfListRental() {
      this.$store.dispatch("showLoader")
      let data = this.itemsRental.map(item => item.id)
      try {
        const rentals = await RentalService.pdfListRental({rental: data})
        if (rentals.status === 200) {
          let blob = new Blob([rentals.data])
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

    async pdfDetailRental() {
      this.$store.dispatch("showLoader")
      let data = this.itemsRental.map(item => item.id)
      try {
        const rentals = await RentalService.pdfDetailRental({rental: data})
        if (rentals.status === 200) {
          let blob = new Blob([rentals.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = "Detalle.pdf"
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },

    async excelListRental() {
      this.$store.dispatch("showLoader")
      let data = this.itemsRental.map(item => item.id)
      try {
        const rentals = await RentalService.excelListRental({rental: data})
        if (rentals.status === 200) {
          let blob = new Blob([rentals.data])
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
<style scoped>
.download {
  background: #868686 !important; 
  border-color: #0a0a0a !important;
}

.download:hover {
  background: #0a0a0a !important;
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
  font-size: 15px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}
</style>