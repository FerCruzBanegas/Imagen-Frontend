<template>
  <div class="container" v-if="success">
    <modal-form :title="'Nuevo Costo'" :visible="visibleModal" @hide="closeModal">
      <cost-form @created="createCost" @updated="updateCost" :item="dataProps" :product="product"/>
    </modal-form>
    <div class="row">
      <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
	      <legend>Datos Generales:</legend>
        <!-- <pre>{{ $data }}</pre> -->
        <div class="container">
          <div class="row bg-secondary">
            <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 border">
              <div class="d-flex justify-content-between my-2">
                <span class="text-white font-weight-bold">Registrado:</span>
                <span class="text-white font-weight-bold">{{ product.created | formatDate('DD/MM/YYYY') }}</span>
              </div>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 border">
              <div class="d-flex justify-content-between my-2">
                <span class="text-white font-weight-bold">Actualizado:</span>
                <span class="text-white font-weight-bold">{{ product.updated | formatDate('DD/MM/YYYY') }}</span>
              </div>
            </div>
          </div>
          <div class="row bg-light">
            <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <div class="font-weight-bold pt-2 list">Código</div>
              <p>{{ product.code }}</p>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <div class="font-weight-bold pt-2 list">Nombre</div>
              <p>{{ product.name }}</p>
            </div>
            <div class="col-sm-12 col-md-5 col-lg-5 col-xl-5">
              <div class="font-weight-bold pt-2 list">Descripción</div>
              <p v-if="product.description">{{ product.description }}</p>
              <p v-else>S/D</p>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
              <div class="font-weight-bold pt-2 list">Categoría</div>
              <p>{{ product.category }}</p>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <div class=" font-weight-bold pt-2 list">Dimensión (mt2/mtl)</div>
              <p>{{ product.dimension | currency }}</p>
            </div>
            <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
              <div class=" font-weight-bold pt-2 list">Calidad</div>
              <p v-if="product.quality">{{ product.quality }}</p>
              <p v-else>S/D</p>
            </div>
          </div>
          <div class="row bg-light mb-2">
            <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="font-weight-bold pt-2 list">Materiales (Descripción)</div>
              <p v-if="product.material">{{ product.material }}</p>
              <p v-else>S/D</p>
            </div>
            <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
              <div class="font-weight-bold pt-2 list">Acabado</div>
              <p v-if="product.finish">{{ product.finish }}</p>
              <p v-else>S/D</p>
            </div>
          </div>
        </div>
	    </fieldset>
    </div>
    <hr />
    <a-spin :spinning="loading">
      <div class="row">
        <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <legend>Costos:</legend>
          <div class="d-flex justify-content-between bg-secondary p-2">
            <span class="text-white font-size-22 font-weight-bold p-2">
              LISTA POR SUCURSAL
            </span>
            <div>
              <b-button v-if="permission('costs.index')" @click="refresh" variant="dark" class="mr-2 btn-refresh">
                <i class="fa fa-refresh"></i>
              </b-button>
              <button
                v-if="permission('costs.create')"
                @click="visibleModal = true"
                type="button"
                class="btn btn-danger btn-with-addon text-nowrap pull-right"
              >
                <span class="btn-addon">
                  <i class="btn-addon-icon fe fe-plus-circle" />
                </span>
                Nuevo Costo
              </button>
            </div>
          </div>
          <div class="pb-4">
            <a-collapse v-if="isEmpty && permission('costs.index')">
              <a-collapse-panel style="background-color: #f2f4f8;" :header="key" v-for="(value, key, index) in product.costs" :key="index">
                <a-collapse :expandIconPosition="'left'">
                  <a-collapse-panel :style= "item.active === 1 ? {'background-color': '#5eff7d'} : {'background-color': '#CCCCCC'}" :header="item.created" v-for="(item, index) in value" :key="index">
                    <table-cost @submit="loading = true" @success="showProduct" :item="item" :dimension="product.dimension"></table-cost>
                    <a-icon v-if="permission('costs.update')" slot="extra" type="edit"  @click.stop="handleEdit(item)"/>
                  </a-collapse-panel>
                </a-collapse>
              </a-collapse-panel>
            </a-collapse>
            <div v-if="product.costs.length === 0" class="d-flex justify-content-center border border-top-0 border-dark">
              <div class="h4 font-weight-bold m-3">
                <i class="fa fa-search-minus"/> Sin Datos
              </div>
            </div>
          </div>
        </fieldset>
      </div>
    </a-spin>
  </div>
</template>
<script>
import permission from '../../mixins/permission'
import Product from '../../models/Product'
import ProductService from '../../services/product.service'
import TableCost from '../../components/widgets/Tables/TableCost.vue'
import ModalForm from '../../components/widgets/Modals/ModalForm.vue'
import CostForm from '../../components/cost/CostForm.vue'

export default {
  data () {
    return {
      id: this.$route.params.id,
      product: new Product(),
      loading: false,
      success: false,
      dataProps: null,
      visibleModal: false,
    }
  },

  components: {
    'table-cost': TableCost,
    'modal-form': ModalForm,
    'cost-form': CostForm,
  },

  mixins: [permission],

  created() {
    this.showProduct()
  },

  methods: {
    isEmpty() {
      return !this.product.costs || Object.keys(this.product.costs).length === 0
    },

    refresh() {
      this.loading = true
      this.showProduct()
    },

    showProduct: async function() {
      const response = await ProductService.showProduct(`products/${this.id}/detail`)
      if (response.status === 200) {
        this.product = response.data.data
        this.loading = false
        this.success = true
      }
    },

    showModal() {
      this.visibleModal = true
    },

    closeModal() {
      this.visibleModal = false
      this.dataProps = null
    },

    handleEdit(item) {
      this.visibleModal = true
      this.dataProps = item
    },

    createCost() {
      this.showProduct()
      this.closeModal()
    },

    updateCost(data) {
      this.product.costs[data.office][this.product.costs[data.office].findIndex(el => el.id === data.id)] = data
      this.closeModal()
    }
  },
}
</script>
<style scoped>
  .list {
    margin: 0;
  }

  .btn-refresh {
    height: 2.3em;
  }

  fieldset {
    background-color: #fff;
    border-radius: 4px;
    border: 1px solid black;
  }

  legend {
    background-color: #fff;
    border: 1px solid #ddd;
    border-radius: 4px;
    color: #000;
    font-size: 17px;
    font-weight: bold;
    padding: 3px 5px 3px 7px;
    width: auto;
  }
</style>