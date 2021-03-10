<template>
  <div class="container">
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsProduct"
      :access="'products'"
      :alert_message="'Realmente desea eliminar estos datos?'"
      @hide="visibleModal = !visibleModal"
      @deleted="deleted"
    ></modal-grid>
    <div class="row justify-content-center">
      <div class="table-responsive">
        <div class="container">
          <div class="row p-2 bg-secondary">
            <div class="col-md-6">
              <b-button @click="visibleModal = true" v-if="itemsProduct.length > 0" squared variant="outline-danger" class="mr-2">
                <i class="fa fa-check-square"></i>
                ({{ itemsProduct.length }}) Seleccionados
              </b-button>
              <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
                <i class="fa fa-check-square-o"></i>
              </b-button>
              <b-button title="Descargar PDF" @click="pdfListProduct" variant="danger" class="ml-2">
                <i class="fa fa-file-pdf-o"></i>
                <span v-if="itemsProduct.length > 0">({{ itemsProduct.length }})</span>
              </b-button>
              <b-button title="Descargar EXCEL" @click="excelListProduct" variant="success" class="ml-2">
                <i class="fa fa-file-excel-o"></i>
                <span v-if="itemsProduct.length > 0">({{ itemsProduct.length }})</span>
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
            :transport-read="{ url: `${url}/products`, beforeSend: readData }"
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
            :pageable-responsive="true"
            :pageable-refresh="true"
            :sortable="true"
            @change="onChange"
            @databound="dataBound"
          >
            <kendo-grid-column :selectable="true" :width="45"></kendo-grid-column>
            <kendo-grid-column
              :field="'code'"
              :title="'CÓDIGO'"
              :width="120"
              :template="templateCode"
              :filterable-cell-operator="'contains'"
              :filterable-cell-suggestion-operator="'contains'"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'name'"
              :title="'NOMBRE'"
              :width="220"
              :filterable-cell-operator="'contains'"
              :filterable-cell-suggestion-operator="'contains'"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'category'"
              :title="'CATEGORÍA'"
              :width="150"
              :sortable="false"
              :filterable-cell-show-operators="false"
              :filterable-cell-template="categoryFilter"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'created'"
              :title="'REGISTRADO'"
              :width="120"
              :format="'{0:dd/MM/yyyy}'"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column 
              v-if="permission('products.update')" 
              :command="[{name: ' ', iconClass: 'fa fa-pencil', click: update}]" 
              :width="45"
            ></kendo-grid-column>
          </kendo-grid>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import $ from "jquery"
import permission from '../../mixins/permission'
import { mapGetters } from "vuex"
import { API_URL } from "../../services/config"
import ProductService from "../../services/product.service"
import ModalGrid from "../widgets/Modals/ModalGridSelected.vue"

export default {
  data() {
    return {
      url: API_URL,
      dsSchemaFields: {
        code: { type: "string" },
        name: { type: "string" },
        created: { type: "date", format: "{0:dd/MM/yyyy}" },
        category: { from: "category.name" },
      },

      filterableConfig: {
        mode: "row",
        // extra: false,
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
    }
  },

  computed: {
    ...mapGetters(["itemsProduct"])
  },

  components: {
    "modal-grid": ModalGrid,
  },

  mixins: [permission],

  mounted() {
    let grid = this.$refs.grid.kendoWidget()
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
    update(ev) {
      ev.preventDefault()
      let gridWidget = this.$refs.grid.kendoWidget()
      let tr = $(ev.target).closest('tr')
      let data = gridWidget.dataItem(tr)
      this.$router.push({name: "EditProduct", params: { id: data.id }})
    },

    async deleted() {
      let data = this.itemsProduct.map(item => item.id)
      const response = await ProductService.deleteProduct(data)
      if (response.status === 200) {
        this.$store.dispatch("emptyProduct")
        this.$refs.grid.kendoWidget().dataSource.read()
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
        "<span class='btn btn-link' style='font-size: 13px;'>" +
        kendo.htmlEncode(dataItem.code) +
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

    categoryFilter(element) {
      let dataSource = new kendo.data.DataSource({
        transport: {
          read: {
            url: `${API_URL}/categories/listing`,
            dataType: "json"
          }
        }
      })

      element.element.kendoDropDownList({
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
      this.$store.dispatch("emptyProduct")
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
        let index = vm.itemsProduct.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem(row)
          obj.created = kendo.toString(obj.created, "dd/MM/yyyy")
          vm.$store.dispatch("setItemProduct", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemProduct", index)
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
        let index = vm.itemsProduct.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)

      grid.element.on("click", "tbody tr[data-uid] td:nth-child(2)", function(e) {
         let element = e.target || e.srcElement
         let data = grid.dataItem($(element).closest("tr"))
         vm.$router.push({name: "ShowProduct", params: { id: data.id }})
      })
    },

    async pdfListProduct() {
      this.$store.dispatch("showLoader")
      let data = this.itemsProduct.map(item => item.id)
      try {
        const products = await ProductService.pdfListProduct({product: data})
        if (products.status === 200) {
          let blob = new Blob([products.data])
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

    async excelListProduct() {
      this.$store.dispatch("showLoader")
      let data = this.itemsProduct.map(item => item.id)
      try {
        const products = await ProductService.excelListProduct({product: data})
        if (products.status === 200) {
          let blob = new Blob([products.data])
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
