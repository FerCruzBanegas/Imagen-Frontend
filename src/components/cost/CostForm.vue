<template>
  <a-spin :spinning="success">
    <div class="container">
      <!-- <pre>{{ $data }}</pre> -->
      <div class="d-flex flex-row-reverse bd-highlight">
        <small><strong>Los campos con (*) son obligatorios.</strong></small>
      </div>
      <b-form>
        <a-divider orientation="left">Materiales</a-divider>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group>
              <div class="d-table-cell w-100">
                <v-select
                  label="name"
                  :filterable="false"
                  :options="materials"
                  v-model="material"
                  @search="onSearchMaterial"
                >
                  <template slot="no-options">Buscar materiales..</template>
                  <template slot="option" slot-scope="material">
                    <div>
                      <strong>{{ material.name }}</strong>
                    </div>
                  </template>
                  <template slot="selected-option" slot-scope="material">
                    <div>
                      <strong>{{ material.name }}</strong>
                    </div>
                  </template>
                </v-select>
              </div>
              <div class="d-table-cell align-middle">
                <b-button @click="addMaterial" class="ml-1 btn-add" size="sm">
                  <i class="fa fa-plus-circle"></i>
                </b-button>
              </div>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group label-for="cost.office_id" :invalid-feedback="errors.first('cost.office_id')" :state="!errors.has('cost.office_id')">
              <v-select
                label="description"
                v-model="cost.office_id" 
                :options="offices"
                :reduce="office => office.id"
                :state="errors.has('cost.office_id') ? false : null"
                v-validate="'required'"
                data-vv-name="cost.office_id"
                data-vv-as="sucursal"
              ></v-select>
            </b-form-group>
          </div>
        </div>
        <div class="row" v-if="selectMaterials.length > 0">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <table>
              <thead>
                <tr>
                  <th scope="col" width="150px">Material</th>
                  <th scope="col" width="30px">Unidad</th>
                  <th scope="col" width="30px">Cantidad</th>
                  <th scope="col" width="70px">Precio</th>
                  <th scope="col" width="70px">Total</th>
                  <th scope="col" width="10px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(material, index) in selectMaterials" :key="index">
                  <td data-label="Material"><span>{{ material.name }}</span></td>
                  <td data-label="Unidad"><span>{{ material.unity }}</span></td>
                  <td data-label="Cantidad">
                    <b-form-input v-model.lazy="material.quantity" v-money="money" class="text-right" size="sm"></b-form-input>
                  </td>
                  <td data-label="Precio">
                    <b-form-input v-model.lazy="material.price" v-money="money" class="text-right" size="sm"></b-form-input>
                  </td>
                  <td data-label="Total">
                    {{ subTotalMaterial(material) | currency }}
                  </td>
                  <td>
                    <b-button @click="removeMaterial(material.id)" squared size="sm" variant="outline-secondary"><i class="fa fa-trash"></i></b-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="container text-center">
              <div class="row bg-light border border-top-0 border-dark">
                <div class="col-md-3 ml-auto border">
                  <div class="h6 font-weight-bold pt-2">Total materiales &nbsp:</div>
                </div>
                <div class="col-md-3 borderr">
                  <div class="h6 font-weight-bold pt-2">{{ totalMaterials | currency }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <a-divider orientation="left">Mano de Obra <b-button @click="addWorker" variant="link" size="sm">[+ Nuevo]</b-button></a-divider>
        <div class="row" v-if="workers.length > 0">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <table>
              <thead>
                <tr>
                  <th scope="col" width="180px">Descripción</th>
                  <th scope="col" width="20px">Unidad</th>
                  <th scope="col" width="30px">Cantidad</th>
                  <th scope="col" width="70px">Precio</th>
                  <th scope="col" width="70px">Total</th>
                  <th scope="col" width="10px"></th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(worker, index) in workers" :key="index">
                  <td data-label="Descripción"><b-form-input v-model="worker.description" size="sm" type="text"></b-form-input></td>
                  <td data-label="Unidad"><span>Hrs</span></td>
                  <td data-label="Cantidad"><b-form-input v-model.lazy="worker.quantity" v-money="money" class="text-right" size="sm"></b-form-input></td>
                  <td data-label="Precio"><b-form-input v-model.lazy="worker.price" v-money="money" class="text-right" size="sm"></b-form-input></td>
                  <td data-label="Total">
                    {{ subTotalWorker(worker) | currency }}
                  </td>
                  <td>
                    <b-button @click="removeWorker(index)" squared size="sm" variant="outline-secondary"><i class="fa fa-trash"></i></b-button>
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="container text-center">
              <div class="row bg-light border border-top-0 border-dark">
                <div class="col-md-3 ml-auto border">
                  <div class="h6 font-weight-bold pt-2">Total mano de obra &nbsp:</div>
                </div>
                <div class="col-md-3 border">
                  <div class="h6 font-weight-bold pt-2">{{ totalWorkers | currency }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="d-flex justify-content-between border border-dark p-2">
          <div class="font-weight-bold">EQUIPO, MAQUINARIA Y HERRAMIENTAS</div>
          <div>
            <b-input-group size="sm" prepend="Bs." class="mb-2 mr-sm-2 mb-sm-0">
              <b-form-input class="text-right" v-model.lazy="cost.tool" v-money="money" size="sm" placeholder="Bs"></b-form-input>
            </b-input-group>
          </div>
        </div>
        <div class="d-flex justify-content-between border border-dark p-2">
          <div class="font-weight-bold">GASTOS GENERALES Y ADMINISTRATIVOS</div>
          <div>
            <b-form inline>
              <b-input-group size="sm" prepend="%" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input class="text-right" v-model.lazy="cost.admin_expense" v-money="money" size="sm"></b-form-input>
              </b-input-group>
              <b-form-input class="text-right" size="sm" v-money="money" :value="avg1 | currency" disabled ></b-form-input>
            </b-form>
          </div>
        </div>
        <div class="d-flex justify-content-between border border-dark p-2">
          <div class="font-weight-bold">UTILIDAD</div>
          <div>
            <b-form inline>
              <b-input-group size="sm" prepend="%" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input class="text-right" v-model.lazy="cost.utility" v-money="money" size="sm"></b-form-input>
              </b-input-group>
              <b-form-input class="text-right" size="sm" v-money="money" :value="avg2 | currency" disabled></b-form-input>
            </b-form>
          </div>
        </div>
        <div class="d-flex justify-content-between border border-dark p-2">
          <div class="font-weight-bold">IMPUESTOS</div>
          <div>
            <b-form inline>
              <b-input-group size="sm" prepend="%" class="mb-2 mr-sm-2 mb-sm-0">
                <b-form-input class="text-right" v-model.lazy="cost.tax" v-money="money" size="sm"></b-form-input>
              </b-input-group>
              <b-form-input class="text-right" size="sm" v-money="money" :value="avg3 | currency" disabled></b-form-input>
            </b-form>
          </div>
        </div>
        <div class="container text-center">
          <div class="row bg-light border border-top-0 border-dark">
            <div class="col-md-3 ml-auto border">
              <div class="h6 font-weight-bold pt-2">TOTAL PRECIO &nbsp:</div>
            </div>
            <div class="col-md-3 border">
              <div class="h6 font-weight-bold pt-2">{{ total | currency }}</div>
            </div>
          </div>
        </div>
        <div class="container text-center">
          <div class="row bg-light border border-top-0 border-dark">
            <div class="col-md-3 ml-auto border">
              <div class="h6 font-weight-bold pt-2">TOTAL MT2 &nbsp:</div>
            </div>
            <div class="col-md-3 border">
              <div class="h6 font-weight-bold pt-2">{{ totalMt2 | currency }}</div>
            </div>
          </div>
        </div>
        <!-- <b-button @click="testclick" squared size="sm" variant="outline-secondary"><i class="fa fa-trash"></i></b-button> -->
        <div class="row pt-2">
          <div class="col-md-6">
            <strong><label for="business_name">Precio normal * :</label></strong>
            <b-form-group label-for="business_name">
              <b-form-input class="text-right" v-model.lazy="cost.normal_price" v-money="money"></b-form-input>
            </b-form-group>
          </div>
          <div class="col-md-6">
            <strong><label for="name">Precio volumen * :</label></strong>
            <b-form-group label-for="name">
              <b-form-input class="text-right" v-model.lazy="cost.volume_price" v-money="money"></b-form-input>
            </b-form-group>
          </div>
        </div>
        <b-button @click="clear" size="sm" class="mr-2"><i class="fe fe-refresh-ccw"/> LIMPIAR</b-button>
        <b-button @click="submit" size="sm" variant="danger"><i class="fe fe-save"/> GUARDAR</b-button>
      </b-form>
    </div>
  </a-spin>
</template>
<script>
import {VMoney} from 'v-money'
import Money from '../../models/Money'
import Cost from '../../models/Cost'
import CostService from '../../services/cost.service'
import MaterialService from '../../services/material.service'
import OfficeService from '../../services/office.service'
import formatter from '../../mixins/formatter'


export default {
  props: ['product', 'item'],

  data() {
    return {
      money: new Money(),
      cost: new Cost(),
      success: true,
      offices: [],
      materials: [],
      material: null,
      selectMaterials: [],
      selectedFilterMat: 'name',
      workers: []
    }
  },

  mixins: [formatter],

  directives: {
    money: VMoney,
  },

  watch: {
    material: function (value) {
      if(value) this.addMaterial()
    }
  },

  computed: {
    totalMaterials() {
      let total = this.selectMaterials.reduce((acc, item) => {
        let val = Number(this.toFloat(item.quantity)) * Number(this.toFloat(item.price))
        item.total = val
        return acc + val
      }, 0)
      return isNaN(total) ? 0 : total
    },

    totalWorkers() {
      let total = this.workers.reduce((acc, item) => {
        let val = Number(this.toFloat(item.quantity)) * Number(this.toFloat(item.price))
        item.total = val
        return acc + val
      }, 0)
      return isNaN(total) ? 0 : total
    },

    sum1() {
      return this.totalMaterials + this.totalWorkers + Number(this.toFloat(this.cost.tool))
    },

    avg1() {
      return parseFloat((Number(this.toFloat(this.cost.admin_expense)) * this.sum1) / 100).toFixed(2)
    },

    sum2() {
      return this.sum1 + Number(this.avg1)
    },

    avg2() {
      return parseFloat((Number(this.toFloat(this.cost.utility)) * this.sum2) / 100).toFixed(2)
    },

    sum3() {
      return this.sum2 + Number(this.avg2)
    },

    avg3() {
      return parseFloat((Number(this.toFloat(this.cost.tax)) * this.sum3) / 100).toFixed(2)
    },

    total() {
      let total = parseFloat(this.sum3 + Number(this.avg3)).toFixed(2)
      this.cost.total_amount = total
      return total
    },

    totalMt2() {
      let dimension = Number(this.product.dimension) === 0 ? 1 : Number(this.product.dimension)
      let price_without_tax = parseFloat((this.total - this.avg3) / dimension).toFixed(2)
      this.cost.price_without_tax = price_without_tax
      let price_with_tax = parseFloat(Number(this.total) / dimension).toFixed(2)
      this.cost.price_with_tax = price_with_tax
      return price_with_tax
    },
  },

  created() {
    this.listOffices()

    if (this.item) {
      let {materials, workers, ...cost} = this.item
      this.cost = cost
      this.selectMaterials = this.transformAmounts(this.item.materials)
      this.workers = this.transformAmounts(this.item.workers)
    }
  },

  methods: {
    listOffices: async function() {
      const offices = await OfficeService.listOffices()
      if (offices.status === 200) {
        this.offices = offices.data
        this.success = false
      }
    },

    subTotalMaterial(material) {
      return parseFloat(this.toFloat(material.quantity)).toFixed(2) * parseFloat(this.toFloat(material.price)).toFixed(2)
    },

    subTotalWorker(worker) {
      return parseFloat(this.toFloat(worker.quantity)).toFixed(2) * parseFloat(this.toFloat(worker.price)).toFixed(2)
    },

    addMaterial() {
      if (this.material) {
        let obj = {
          id: this.material.id,
          name: this.material.name,
          unity: this.material.unity,
          quantity: 0,
          price: 0,
          total: 0
        }
        const flag = this.selectMaterials.some(item => item.id === obj.id)
        if (!flag) this.selectMaterials.push(obj)
      }
    },

    removeMaterial(id){
      const index = this.selectMaterials.findIndex(x => x.id == id)
      if (index > -1) this.selectMaterials.splice(index, 1)
    },

    addWorker() {
      let obj = {
        description: '',
        quantity: 0,
        price: 0,
        total: 0
      }
      this.workers.push(obj)
    },

    removeWorker(index){
      if (index > -1) {
        this.workers.splice(index, 1)
      }
    },

    onSearchMaterial(search, loading) {
      loading(true)
      this.searchMaterial(loading, search, this)
    },

    transformAmounts(array) {
      return array.map(item => {
        let obj = {}
        obj.id = item.id
        if (item.name){
          obj.name = item.name
        } else {
          obj.description = item.description
        }
        obj.unity = item.unity
        obj.quantity = this.toFloat(item.quantity)
        obj.price = this.toFloat(item.price)
        obj.total = this.toFloat(item.total)
        return obj
      })
    },

    searchMaterial: _.debounce(async (loading, search, vm) => {
      const data = {
        column: vm.selectedFilterMat,
        value: search
      }
      try {
        const materials = await MaterialService.searchMaterial(data)
        if (materials.status === 200) {
          vm.materials = materials.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.materials = []
          loading(false)
        }
      }
    }, 350),

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        let cost = Object.assign({}, this.cost)
        cost.tool = this.toFloat(cost.tool)
        cost.admin_expense = this.toFloat(cost.admin_expense)
        cost.utility = this.toFloat(cost.utility)
        cost.tax = this.toFloat(cost.tax)
        cost.total_amount = cost.total_amount
        cost.price_without_tax = cost.price_without_tax
        cost.price_with_tax = cost.price_with_tax
        cost.normal_price = this.toFloat(cost.normal_price)
        cost.volume_price = this.toFloat(cost.volume_price)
        cost.product_id = Number(this.product.id)

        let materials = this.transformAmounts(this.selectMaterials)
        let workers = this.transformAmounts(this.workers)

        let data = {cost: cost, materials: materials, workers: workers}

        if(this.item) {
          this._save = await CostService.updateCost(this.item.id, data)
        } else {
          this._save = await CostService.storeCost(data)
        }

        if (this._save.status === 201) {
          this.$message.success(this._save.data.message)
          this.$emit('created')
        }

        if (this._save.status === 200) {
          this.cost.materials = materials
          this.cost.workers = workers
          this.$message.success(this._save.data.message)
          this.$emit('updated', this.cost)
        }
      } catch (err) {
        if (err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },

    clear() {
      this.cost = new Cost()
      this.selectMaterials = []
      this.workers = []
    }
  }
}
</script>
<style scoped src="../../assets/css/table_cost.css"></style>
