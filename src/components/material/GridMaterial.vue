<template>
  <div class="container">
    <modal-grid
      :title="'Lista de Seleccionados'"
      :visible="visibleModal"
      :data="itemsMaterial"
      :access="'materials'"
      :alert_message="'Realmente desea eliminar estos datos?'"
      @hide="visibleModal = !visibleModal"
      @deleted="deleted"
    ></modal-grid>
    <modal-form :title="addSubtitle" :visible="visibleForm" @hide="closeModalForm">
      <a-spin :spinning="success">
        <div class="container">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="name">Nombre * :</label>
              </strong>
              <b-form-group label-for="name" :invalid-feedback="errors.first('name')" :state="!errors.has('name')">
                <b-form-input 
                  v-model="material.name" 
                  :state="errors.has('name') ? false : null"
                  v-validate="'required|min:3|max:64'"
                  data-vv-name="name"
                  data-vv-as="nombre"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="unity">Unidad * :</label>
              </strong>
              <b-form-group label-for="unity" :invalid-feedback="errors.first('unity')" :state="!errors.has('unity')">
                <v-select 
                  v-model="material.unity"
                  :reduce="unity => unity.value"
                  :state="errors.has('unity') ? false : null"
                  v-validate="'required'"
                  data-vv-name="unity"
                  data-vv-as="estado"
                  :options="units"
                >
                  <template slot="option" slot-scope="option">
                    <div class="d-center">
                      {{ option.label }}
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="description">Descripción :</label>
              </strong>
              <b-form-group label-for="description" :invalid-feedback="errors.first('description')" :state="!errors.has('description')">
                <b-form-input 
                  v-model="material.description" 
                  :state="errors.has('description') ? false : null"
                  v-validate="'required|max:64'"
                  data-vv-name="description"
                  data-vv-as="teléfono"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <small><strong>Los campos con (*) son obligatorios.</strong></small>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <b-button
                @click="submit" 
                type="submit" 
                class="float-right" 
              >{{ material.id ? 'ACTUALIZAR' : 'REGISTRAR' }}</b-button>
            </div>
          </div>
        </div>
      </a-spin>
    </modal-form>
    <div class="row justify-content-center">
      <div class="table-responsive">
        <div class="container">
          <div class="row p-2 bg-secondary">
            <div class="col-md-6">
              <b-button @click="visibleModal = true" v-if="itemsMaterial.length > 0" squared variant="outline-danger" class="mr-2">
                <i class="fa fa-check-square"></i>
                ({{ itemsMaterial.length }}) Seleccionados
              </b-button>
              <b-button @click="visibleForm = true" variant="warning" class="mr-2">
                <i class="fa fa-plus-circle"></i> Nuevo Registro
              </b-button>
              <b-button title="Quitar Seleccionados" @click="emptyGridSelected" variant="outline-dark">
                <i class="fa fa-refresh"></i>
              </b-button>
            </div>
            <div class="col-md-2 ml-auto">
              <div class="menu" style="max-width: 150px; float: right; background: #e8e8e8; padding: 0.2em;"/>
              </div>
            </div>
          </div>
          <kendo-datasource
            ref="datasource1"
            :schema-total="'meta.total'"
            :schema-data="'data'"
            :transport-read="{ url: `${url}/materials`, beforeSend: readData }"
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
            :scrollable="true"
            @change="onChange"
            @databound="dataBound"
          >
            <kendo-grid-column :selectable="true" :width="45"></kendo-grid-column>
            <kendo-grid-column
              :field="'name'"
              :title="'NOMBRE'"
              :width="120"
              :filterable-cell-operator="'contains'"
              :filterable-cell-suggestion-operator="'contains'"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'unity'"
              :title="'UNIDAD'"
              :width="120"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'description'"
              :title="'DESCRIPCIÓN'"
              :width="120"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'created'"
              :title="'REGISTRADO'"
              :width="120"
              :format="'{0:dd/MM/yyyy}'"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column
              :field="'updated'"
              :title="'ACTUALIZADO'"
              :width="120"
              :format="'{0:dd/MM/yyyy}'"
              :filterable="false"
            ></kendo-grid-column>
            <kendo-grid-column
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
import Material from '../../models/Material'
import MaterialService from "../../services/material.service"
import ModalGrid from "../widgets/Modals/ModalGridSelected.vue"
import ModalForm from '../../components/widgets/Modals/ModalForm.vue'

export default {
  data() {
    return {
      url: API_URL,
      dsSchemaFields: {
        name: { type: "string" },
        unity: { type: "string" },
        description: { type: "string" },
        created: { type: "date", format: "{0:dd/MM/yyyy}" },
        updated: { type: "date", format: "{0:dd/MM/yyyy}" },
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
      visibleForm: false,
      success: false,
      material: new Material(),
      units: [
        { label: 'amarro', value: 'amarro'},
        { label: 'barra', value: 'barra'},
        { label: 'bolsa', value: 'bolsa'},
        { label: 'caja', value: 'caja'},
        { label: 'cajón', value: 'cajón'},
        { label: 'carga', value: 'carga'},
        { label: 'dm³', value: 'dm³'},
        { label: 'fajo', value: 'fajo'},
        { label: 'fardo', value: 'fardo'},
        { label: 'g', value: 'g'},
        { label: 'galón', value: 'galón'},
        { label: 'glb', value: 'glb'},
        { label: 'ha', value: 'ha'},
        { label: 'juego', value: 'juego'},
        { label: 'kg', value: 'kg'},
        { label: 'l', value: 'l'},
        { label: 'lata', value: 'lata'},
        { label: 'lb', value: 'lb'},
        { label: 'm', value: 'm'},
        { label: 'm²', value: 'm²'},
        { label: 'm³', value: 'm³'},
        { label: 'mm', value: 'mm'},
        { label: 'perfil', value: 'perfil'},
        { label: 'pie', value: 'pie'},
        { label: 'pie²', value: 'pie²'},
        { label: 'placa', value: 'placa'},
        { label: 'plomo', value: 'plomo'},
        { label: 'pqte', value: 'pqte'},
        { label: 'pto', value: 'plomo'},
        { label: 'pza', value: 'pza'},
        { label: 'resma', value: 'resma'},
        { label: 'rollo', value: 'rollo'},
        { label: 't', value: 't'},
        { label: 'tubo', value: 'tubo'},
        { label: 'turril', value: 'turril'},
        { label: 'unds', value: 'unds'},
      ],
    }
  },

  computed: {
    ...mapGetters(["itemsMaterial"]),
    addSubtitle () {
      if(this.material.id) {
        return 'Editar Material'
      }
      return 'Registrar Material'
    }
  },

  components: {
    "modal-grid": ModalGrid,
    "modal-form": ModalForm
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
            "<label><input type='checkbox' checked='checked' " +
            " class='check' data-field='" +
            grid.columns[i].field +
            "'/>" +
            grid.columns[i].title +
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
      openOnClick: true,
      closeOnClick: false,
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
    closeModalForm() {
      this.visibleForm = false
      this.material = new Material()
    },

    update(ev) {
      ev.preventDefault()
      let gridWidget = this.$refs.grid.kendoWidget()
      let tr = $(ev.target).closest('tr')
      let data = gridWidget.dataItem(tr)
      let {created, updated, parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = data
      this.material = obj
      this.visibleForm = true
    },

    async deleted() {
      let data = this.itemsMaterial.map(item => item.id)
      const response = await MaterialService.deleteMaterial(data)
      if (response.status === 200) {
        this.$store.dispatch("emptyMaterial")
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

    readData: function(xhr) {
      let self = this
      xhr.setRequestHeader("Authorization", "Bearer " + localStorage.getItem("access_token"))
      xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest")
      xhr.setRequestHeader("Accept-Language", "en")
      xhr.setRequestHeader("Accept", "application/json")
      xhr.done(function(data) {
        self.$emit("material", false)
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
      this.$store.dispatch("emptyMaterial")
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
        let index = vm.itemsMaterial.findIndex(x => x.id == idValue)
        if (row.className.indexOf("k-state-selected") >= 0) {
          let {parent, dirty, dirtyFields, _events, _handlers, uid,...obj} = grid.dataItem(row)
          obj.created = kendo.toString(obj.created, "dd/MM/yyyy")
          obj.updated = kendo.toString(obj.updated, "dd/MM/yyyy")
          vm.$store.dispatch("setItemMaterial", obj)
        } else if (index > -1) {
          vm.$store.dispatch("deleteItemMaterial", index)
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
        let index = vm.itemsMaterial.some(item => item.id === dataItem)
        if (index) {
          itemsToSelect.push(row)
        }
      })

      e.sender.select(itemsToSelect)
    },

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        if(this.material.id) {
          this._save = await MaterialService.updateMaterial(this.material.id, this.material)
        } else {
          this._save = await MaterialService.storeMaterial(this.material)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.$refs.grid.kendoWidget().dataSource.read()
          this.$message.success(this._save.data.message)
          this.success = false
          this.closeModalForm()
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },
  }
}
</script>

<style scoped src="../../assets/css/grid.css"></style>
