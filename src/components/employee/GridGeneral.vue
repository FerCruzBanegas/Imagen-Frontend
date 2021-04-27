<template>
  <div class="container">
    <modal-detail :title="'Detalles del Registro'" :visible="visibleDetail" @hide="visibleDetail = !visibleDetail">
      <b-card no-body header-bg-variant="primary">
        <b-tabs 
          small card 
          active-nav-item-class="font-weight-bold text-uppercase"
        >
          <b-tab title="DATOS">
            <div class="container" v-if="employee">
              <div class="row bg-secondary">
                <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                  <span class="text-white font-weight-bold">Registrado:</span>
                  <span class="text-white font-weight-bold float-right">{{ employee.created | formatDate('DD/MM/YYYY') }}</span>
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                  <span class="text-white font-weight-bold">Actualizado:</span>
                  <span class="text-white font-weight-bold float-right">{{ employee.updated | formatDate('DD/MM/YYYY') }}</span>
                </div>
              </div>
              <div class="row bg-light">
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                  <div class="font-weight-bold pt-2 list">Nombre</div>
                  <p>{{ employee.name }}</p>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                  <div class="font-weight-bold pt-2 list">Documento</div>
                  <p>{{ employee.num_document }}</p>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                  <div class="font-weight-bold pt-2 list">Teléfono</div>
                  <p>{{ employee.phone }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                  <div class=" font-weight-bold pt-2 list">Dirección</div>
                  <p v-if="employee.address">{{ employee.address }}</p>
                  <p v-else>S/D</p>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                  <div class=" font-weight-bold pt-2 list">Correo</div>
                  <p v-if="employee.email">{{ employee.email }}</p>
                  <p v-else>S/D</p>
                </div>
                <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
                  <div class=" font-weight-bold pt-2 list">Oficina</div>
                  <p>{{ employee.office }}</p>
                </div>
              </div>
            </div>
          </b-tab>
          <b-tab title="TRABAJOS PENDIENTES">
            <b-table class="text-center" :items="work_orders" :fields="columns"fixed hover small responsive="sm" stacked="sm" head-variant="light">
              <template v-slot:cell(number)="data">
                <b class="text-info">{{ data.value | codeString }}</b>
              </template>
              <template v-slot:cell(opening_date)="data">
                {{ data.value | formatDate('DD/MM/YYYY')}}
              </template>
              <template v-slot:cell(estimated_date)="data">
                {{ data.value | formatDate('DD/MM/YYYY')}}
              </template>
            </b-table>
          </b-tab>
        </b-tabs>
      </b-card>
    </modal-detail>
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsEmployee"
      :access="'employees'"
      :alert_message="'Realmente desea eliminar estos datos?'"
      @hide="visibleModal = !visibleModal"
      @deleted="deleted"
    ></modal-grid>
    <div class="row">
      <div class="table-responsive">
        <div class="d-flex flex-sm-row flex-column bg-secondary">
          <div class="mr-auto p-2">
            <b-button @click="visibleModal = true" v-if="itemsEmployee.length > 0" squared variant="outline-danger" class="mr-2">
              <i class="fa fa-check-square"></i>
              ({{ itemsEmployee.length }}) Seleccionados
            </b-button>
            <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
              <i class="fa fa-check-square-o"></i>
            </b-button>
            <b-button title="Descargar PDF" @click="pdfListEmployee" variant="danger" class="ml-2">
              <i class="fa fa-file-pdf-o"></i>
              <span v-if="itemsEmployee.length > 0">({{ itemsEmployee.length }})</span>
            </b-button>
            <b-button title="Descargar EXCEL" @click="excelListEmployee" variant="success" class="ml-2">
              <i class="fa fa-file-excel-o"></i>
              <span v-if="itemsEmployee.length > 0">({{ itemsEmployee.length }})</span>
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
          ref="data-employee"
          :schema-total="'meta.total'"
          :schema-data="'data'"
          :transport-read="{ url: `${url}/employees`, beforeSend: readData }"
          :transport-parameter-map="parameterMap"
          :page-size="10"
          :server-paging="true"
          :server-filtering="true"
          :server-sorting="true"
          :schema-model-fields="dsSchemaFields"
        ></kendo-datasource>
        <kendo-grid
          ref="gridEmployee"
          :data-source-ref="'data-employee'"
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
            :field="'name'"
            :title="'NOMBRE'"
            :width="120"
            :template="templateName"
            :filterable-cell-operator="'contains'"
            :filterable-cell-suggestion-operator="'contains'"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'num_document'"
            :title="'DOCUMENTO'"
            :width="150"
            :filterable-cell-operator="'contains'"
            :filterable-cell-suggestion-operator="'contains'"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'phone'"
            :title="'TELÉFONO'"
            :width="100"
            :filterable="false"
          ></kendo-grid-column>
          <kendo-grid-column
            :field="'office'"
            :title="'OFICINA'"
            :width="160"
            :sortable="false"
            :filterable-cell-show-operators="false"
            :filterable-cell-template="officeFilter"
          ></kendo-grid-column>
          <kendo-grid-column
            v-if="permission('employees.update')" 
            :command="[{name: ' ', iconClass: 'fa fa-pencil', click: update}]" 
            :width="45"
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
import EmployeeService from "../../services/employee.service"
import ModalDetail from "../widgets/Modals/ModalDetail.vue"
import ModalGrid from "../widgets/Modals/ModalGridSelected.vue"

export default {
  data() {
    return {
      url: API_URL,
      dsSchemaFields: {
        name: { type: "string" },
        num_document: { type: "string" },
        address: { type: "string" },
        phone: { type: "string" },
        email: { type: "string" },
        office: { from: "office.description" },
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
      employee: null,
      work_orders: [],
      columns: [
        { key: 'number', label: 'Número'},
        { key: 'opening_date', label: 'Apertura'},
        { key: 'estimated_date', label: 'Estimada'},
        { key: 'cite', label: 'Cotización'},
        { key: 'type_work', label: 'Tipo de Trabajo'},
      ],
      visibleModal: false,
      visibleDetail: false,
    }
  },

  computed: {
    ...mapGetters(["itemsEmployee"])
  },

  components: {
    "modal-detail": ModalDetail,
    "modal-grid": ModalGrid
  },

  mixins: [permission],

  mounted() {
    let grid = this.$refs.gridEmployee.kendoWidget()
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
      this.$refs.gridEmployee.kendoWidget().dataSource.filter({})
    },

    update(ev) {
      ev.preventDefault()
      let gridWidget = this.$refs.gridEmployee.kendoWidget()
      let tr = $(ev.target).closest('tr')
      let data = gridWidget.dataItem(tr)
      this.$router.push({name: "EditEmployee", params: { id: data.id }})
    },

    async deleted() {
      let data = this.itemsEmployee.map(item => item.id)
      const response = await EmployeeService.deleteEmployee(data)
      if (response.status === 200) {
        this.$store.dispatch("emptyEmployee")
        this.$refs.gridEmployee.kendoWidget().dataSource.read()
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

    templateName(dataItem) {
      return (
        "<span class='btn btn-link' style='font-size: 13px;'>" +
        kendo.htmlEncode(dataItem.name) +
        "</span>"
      )
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

    officeFilter(element) {
      let dataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: `${API_URL}/offices/listing`,
            dataType: "json"
          }
        }
      })

      element.element.kendoDropDownList({
        dataSource: dataSource,
        dataTextField: "description",
        change: function(e) {},
        valuePrimitive: true,
        dataValueField: "id",
        optionLabel: {
          description: "-Seleccione-",
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
      this.$store.dispatch("emptyEmployee")
      .then(() => {
        let grid = this.$refs.gridEmployee.kendoWidget()
        grid.clearSelection()
      })
    },

    onChange(e) {
      let vm = this
      let grid = e.sender
      let items = grid.items()
      items.each(function(idx, row) {
        let idValue = grid.dataItem(row).get("id")
        let index = vm.itemsEmployee.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem(row)
          vm.$store.dispatch("setItemEmployee", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemEmployee", index)
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
        let index = vm.itemsEmployee.some(item => item.id === dataItem)
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

    async pdfListEmployee() {
      this.$store.dispatch("showLoader")
      let data = this.itemsEmployee.map(item => item.id)
      try {
        const employees = await EmployeeService.pdfListEmployee({employee: data})
        if (employees.status === 200) {
          let blob = new Blob([employees.data])
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

    async excelListEmployee() {
      this.$store.dispatch("showLoader")
      let data = this.itemsEmployee.map(item => item.id)
      try {
        const employees = await EmployeeService.excelListEmployee({employee: data})
        if (employees.status === 200) {
          let blob = new Blob([employees.data])
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
