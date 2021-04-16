<template>
  <div class="container" v-if="load">
    <modal-form :title="'Nuevo Cliente'" :visible="visibleModal" @hide="visibleModal = !visibleModal">
      <customer-form @success="successCustomer"/>
    </modal-form>
    <h1>COTIZACIÓN</h1>
    <div class="row bg-secondary">
      <div class="col-md-4 my-2">
        <span class="font-weight-bold text-white">
          SUCURSAL:
        </span>
        <v-select
          label="description"
          v-model="office" 
          :options="offices"
          :clearable="false"
          disabled
        ></v-select>
      </div>
    </div>
    <hr />
    <div class="row">
      <!-- <pre>{{ $data.selectProducts }}</pre> -->
      <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <legend>Datos Generales:</legend>
        <div class="row">
          <div class="col-sm-12 col-md-8 col-lg-8 col-xl-8">
            <div class="fieldset">
              <div class="legend"><strong>Buscar cliente por:</strong></div>
              <b-form-group>
                <b-form-radio-group
                  v-model="selectedFilterCus"
                  :options="filterCustomer"
                  name="radio-customer"
                ></b-form-radio-group>
              </b-form-group>
            </div>
            <b-form-group
              :invalid-feedback="errors.first('quotation.customer_id')"
              :state="!errors.has('quotation.customer_id')"
            >
              <div class="d-table-cell w-100">
                <v-select
                  label="business_name"
                  :filterable="false"
                  :options="customers"
                  v-model="quotation.customer_id"
                  @search="onSearchCustomer"
                  :state="errors.has('quotation.customer_id') ? false : null"
                  v-validate="'required'"
                  data-vv-name="quotation.customer_id"
                  data-vv-as="cliente"
                >
                  <template slot="no-options">Buscar clientes..</template>
                  <template slot="option" slot-scope="customer">
                    <div>
                      <strong>{{ customer.business_name }}</strong>
                    </div>
                  </template>
                  <template slot="selected-option" slot-scope="customer">
                    <div>
                      <strong>{{ customer.business_name }}</strong>
                    </div>
                  </template>
                </v-select>
              </div>
              <div class="d-table-cell align-middle">
                <b-button @click="showModal" class="ml-1" size="sm" style="height: 2.4em;">
                  <i class="fa fa-user-plus"></i>
                </b-button>
              </div>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4">
            <div class="row mt-1">
              <div class="form-group col-sm-12 col-lg-12">
                <b-form-group :invalid-feedback="errors.first('quotation.date')" :state="!errors.has('quotation.date')">
                  <b-form-input 
                    v-model="quotation.date"
                    :state="errors.has('quotation.date') ? false : null"
                    v-validate="'required'"
                    data-vv-name="quotation.date"
                    data-vv-as="fecha"
                    type="date"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row mt-1">
              <div class="form-group col-sm-12 col-lg-12">
                <b-form-group :invalid-feedback="errors.first('quotation.attends')" :state="!errors.has('quotation.attends')">
                  <b-form-input 
                    v-model="quotation.attends"
                    :state="errors.has('quotation.attends') ? false : null"
                    v-validate="'required|min:5|max:64'"
                    data-vv-name="quotation.attends"
                    data-vv-as="contacto"
                    placeholder="Persona de Contacto"
                    type="text"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group :invalid-feedback="errors.first('quotation.attends_phone')" :state="!errors.has('quotation.attends_phone')">
              <b-form-input 
                v-model="quotation.attends_phone"
                :state="errors.has('quotation.attends_phone') ? false : null"
                v-validate="'required|min:8|max:16'"
                data-vv-name="quotation.attends_phone"
                data-vv-as="teléfono contacto"
                placeholder="Teléfono de Contacto"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group :invalid-feedback="errors.first('quotation.installment')" :state="!errors.has('quotation.installment')">
              <b-form-input 
                v-model="quotation.installment"
                :state="errors.has('quotation.installment') ? false : null"
                v-validate="'required|min:5|max:64'"
                data-vv-name="quotation.installment"
                data-vv-as="instalación"
                placeholder="Lugar de Instalación"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="form-group col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <table-customer :data="quotation.customer_id"></table-customer>
          </div>
        </div>
      </fieldset>
    </div>
    <hr />
    <div class="row">
      <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <legend>Productos:</legend>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div class="fieldset">
              <div class="legend"><strong>Cotizar precio:</strong></div>
              <div class="m-4">
                <b-form-radio-group
                  v-model="price_type"
                  :options="priceOptions"
                  class="mb-3"
                  value-field="item"
                  text-field="name"
                  disabled-field="notEnabled"
                ></b-form-radio-group>
              </div>
            </div>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <div class="fieldset">
              <div class="legend"><strong>Buscar producto por:</strong></div>
              <b-form-group>
                <b-form-radio-group
                  v-model="selectedFilterPro"
                  :options="filterProduct"
                  name="radio-product"
                ></b-form-radio-group>
              </b-form-group>
            </div>
            <b-form-group
              :invalid-feedback="errors.first('product_id')"
              :state="!errors.has('product_id')"
            >
              <div class="d-table-cell w-100">
                <v-select
                  label="name"
                  :filterable="false"
                  :options="products"
                  v-model="product"
                  @search="onSearchProduct"
                  v-validate="'required'"
                  data-vv-name="product_id"
                  data-vv-as="producto"
                >
                  <template slot="no-options">Buscar productos..</template>
                  <template slot="option" slot-scope="product">
                    <div>
                      <strong>{{ product.name }}</strong>
                    </div>
                  </template>
                  <template slot="selected-option" slot-scope="product">
                    <div>
                      <!-- <img :src='option.owner.avatar_url'/>  -->
                      <strong>{{ product.name }}</strong>
                    </div>
                  </template>
                </v-select>
              </div>
              <div class="d-table-cell align-middle">
                <b-button @click="addProduct" class="ml-1" size="sm" style="height: 2.4em;">
                  <i class="fa fa-plus-circle"></i>
                </b-button>
              </div>
              <div class="d-table-cell align-middle" v-if="id">
                <b-button @click="getShowQuotation" variant="danger" class="ml-1" size="sm" style="height: 2.4em;">
                  <i class="fa fa-refresh"></i>
                </b-button>
              </div>
            </b-form-group>
            <b-button @click="addGeneralProduct" variant="link" style="text-decoration: underline;">
              [ + Agregar Producto/Servicio General ]
            </b-button>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <div v-if="selectProducts.length > 0">
              <table-product :products="selectProducts" @emptyImages="emptyImages" @removeIt="removeProduct"></table-product>
              <div class="container bg-content">
                <div class="row pt-1">
                  <div class="col-md-5">
                    <div class="d-inline-flex p-2 border">
                      <b-form-checkbox
                        v-model="flagDonwload"
                        name="checkbox-1"
                      >
                        Descargar documento después de realizar cotización?
                      </b-form-checkbox>
                    </div>
                  </div>
                  <div class="col-md-5 ml-auto">
                    <table class="table table-bordered table-hover">
                      <tbody>
                        <tr>
                          <th class="text-center w-25 pt-3">SUBTOTAL (Bs) :</th>
                          <td class="text-center w-25"><b-form-input :value="subTotal | currency" class="text-right" size="sm" disabled></b-form-input></td>
                        </tr>
                        <tr>
                          <th class="text-center w-25 pt-3">DESCUENTO (Bs) :</th>
                          <td class="text-center w-25"><b-form-input v-model.lazy="quotation.discount" v-money="money" class="text-right" size="sm"></b-form-input></td>
                        </tr>
                        <tr>
                          <th class="text-center w-25">TOTAL (Bs) :</th>
                          <td class="text-center w-25"><b-form-input :value="grandTotal | currency" class="text-right" size="sm" disabled></b-form-input></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            </div>
            <div v-else class="bg-light text-center py-3 font-weight-bold">Seleccione un producto.</div>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 mt-3">
            <b-form-group
              label-cols-sm="12"
              label-cols-lg="4"
              label-class="font-weight-bold pt-0"
              label="Plazo De Entrega :"
              label-for="entrega"
            >
              <b-form-input v-model="quotation.term" id="entrega" type="date"></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group
              label-cols-sm="12"
              label-cols-lg="4"
              label-class="font-weight-bold pt-0"
              label="Forma De Pago :"
              label-for="pago"
            >
              <b-form-input v-model="quotation.payment" id="pago"></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group
              label-cols-sm="12"
              label-cols-lg="4"
              label-class="font-weight-bold pt-0"
              label="Validez Cotización :"
              label-for="validez"
            >
              <b-form-input v-model="quotation.validity" id="validez"></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="note">Nota / Observación  :</label>
            </strong>
            <b-form-group label-for="note" :invalid-feedback="errors.first('note')" :state="!errors.has('note')">
              <b-form-input
                v-model="quotation.note" 
                :state="errors.has('note') ? false : null"
                v-validate="'min:3|max:150'"
                data-vv-name="note"
                data-vv-as="nota"
                type="text"
                size="lg"
              ></b-form-input>
            </b-form-group>
            <div v-if="error">
              <b-alert show variant="warning">
                <h4 class="alert-heading">Revisa los siguientes errores!</h4>
                <ul id="v-for-object">
                  <li v-for="value in error">
                    {{ value[0] }}
                  </li>
                </ul>
              </b-alert>
            </div>
          </div>
        </div>
      </fieldset>
    </div>
    <div class="row">
      <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3 mt-2">
        <b-button :disabled="loading" @click="submit" size="lg" class="float-right" block squared>
          <span v-if="!loading">
            {{ id == null ? 'Generar Cotización' : 'Actualizar Cotización' }}
          </span>
          <b-spinner v-else variant="light" type="grow" label="Spinning"></b-spinner>
        </b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapGetters } from 'vuex'
import { uuid } from 'vue-uuid'
import {VMoney} from 'v-money'
import formatter from '../../mixins/formatter'
import Quotation from '../../models/Quotation'
import QuotationService from '../../services/quotation.service'
import CustomerService from '../../services/customer.service'
import ProductService from '../../services/product.service'
import OfficeService from '../../services/office.service'
import TableCustomer from '../../components/widgets/Tables/TableCustomer.vue'
import TableProduct from '../../components/widgets/Tables/TableProduct.vue'
import ModalForm from '../../components/widgets/Modals/ModalForm.vue'
import CustomerForm from '../../components/customer/CustomerForm.vue'

export default {
  mixins: [formatter],

  directives: {money: VMoney},

  data() {
    return {
      load: false,
      id: this.$route.params.id,
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      },
      quotation: new Quotation(),
      customers: [],
      products: [],
      product: null,
      selectProducts: [],
      selectedFilterCus: 'business_name',
      filterCustomer: [
        { text: 'Nombre', value: 'business_name' },
        { text: 'NIT', value: 'nit' }
      ],
      selectedFilterPro: 'name',
      filterProduct: [
        { text: 'Nombre', value: 'name' },
        { text: 'Código', value: 'code' },
      ],
      visibleModal: false,
      loading: false,
      flagDonwload: false,
      price_type: 'normal_price',
      priceOptions: [
        { item: 'price_with_tax', name: 'Mínimo C/F' },
        { item: 'price_without_tax', name: 'Mínimo S/F' },
        { item: 'normal_price', name: 'Normal', },
        { item: 'volume_price', name: 'Volumen' },
      ],
      offices: [],
      office: null,
      error: null,
    }
  },

  watch: {
    '$route' (to, from) {
      this.id = null
      this.quotation = new Quotation()
      this.selectProducts = []
    },

    'quotation.discount': function (newValue) {
      this.quotation.discount = this.toFloat(newValue)
    },

    product: function (value) {
      if (value) {
        this.product['price_type'] = this.price_type
        this.product['type'] = this.price_type
        this.product['office'] = this.office.id
      }
    },
  },

  computed: {
    ...mapGetters([
      'currentUser'
    ]),

    subTotal() {
      let vm = this
      let total = vm.selectProducts.reduce(function(acc, item) {
        let val = 0
        item.dimension == '' ? item.dimension = '0' : ''
        // let dimension = parseFloat(item.dim_a * item.dim_b).toFixed(2)
        let dimension = vm.toFloat(item.dim_a) * vm.toFloat(item.dim_b)
        // console.log(dimension)
        if (item.price_type === 'price_service') {
          val = parseInt(item.quantity) * parseFloat(vm.toFloat(item.price)).toFixed(2)
        } else {
          val = parseInt(item.quantity) * parseFloat((dimension * vm.toFloat(item.price))).toFixed(2)
        }
        item.subtotal = val
        return acc + val
      }, 0)
      this.quotation.amount = parseFloat(total).toFixed(2)
      return isNaN(total) ? 0 : total
    },

    grandTotal: function() {
      let total = (this.subTotal - this.toFloat(this.quotation.discount))
      return total
    }
  },

  components: {
    'table-customer': TableCustomer,
    'table-product': TableProduct,
    'modal-form': ModalForm,
    'customer-form': CustomerForm,
  },

  created() {
    this.listOffices()
    if (this.id) this.showQuotation()
  },

  methods: {
    listOffices: async function() {
      const offices = await OfficeService.listOffices()
      if (offices.status === 200) {
        if (!this.id) {
          this.office = this.currentUser.office
          this.load = true
        }
        this.offices = offices.data
      }
    },

    getShowQuotation() {
      this.$store.commit('SHOW_LOAD_QUOTES')
      this.showQuotation()
    },

    showQuotation: async function() {
      const response = await QuotationService.showQuotation(`quotations/${this.id}/edit`)
      if (response.status === 200) {
        this.quotation.id = response.data.data.id
        this.quotation.attends = response.data.data.attends
        this.quotation.attends_phone = response.data.data.attends_phone
        this.quotation.installment = response.data.data.installment
        this.quotation.date = response.data.data.date
        this.quotation.amount = response.data.data.amount
        this.quotation.discount = response.data.data.discount
        this.quotation.term = response.data.data.term
        this.quotation.payment = response.data.data.payment
        this.quotation.validity = response.data.data.validity
        this.quotation.note = response.data.data.note
        this.quotation.customer_id = response.data.data.customer
        this.office = response.data.data.office
        this.selectProducts = response.data.data.products.map(item => {
          let obj = Object.assign({}, item)
          let dim = obj.dimension.split(" x ");
          obj['price_type'] = item.price_type
          obj['office'] = response.data.data.office.id
          obj['dim_a'] = dim[0]
          obj['dim_b'] = dim[1]
          return obj
        })
        this.load = true
        this.$store.commit('CLOSE_LOAD_QUOTES')
      }
    },

    emptyImages(product) {
      if (product.showImage) {
        let index = this.selectProducts.findIndex(element => element.uuid == product.uuid)
        this.selectProducts[index].images = []
      }
    },

    successCustomer(v) {
      if (v) {
        this.visibleModal = false
        this.customers.push(v)
        this.quotation.customer_id = v
      }
    },

    showModal() {
      this.visibleModal = true
    },
    
    removeProduct(index) {
      if (index > -1) this.selectProducts.splice(index, 1)
    },

    addProduct() {
      if (this.product) {
        let obj = Object.assign({}, this.product)
        obj.uuid = this.$uuid.v4()
        obj.quantity = 1
        obj.dimension = ''
        obj.dim_a = 0
        obj.dim_b = 0
        obj.materialCheck = false
        obj.qualityCheck = false
        obj.finishCheck = false
        obj.description = ''
        obj.subtotal = 0
        obj.showImage = false
        obj.unit = false
        obj.cooldown = false
        obj.images = []
        this.selectProducts.push(obj)
      }
    },

    addGeneralProduct() {
      const obj = {
        id: 31,
        name: "Producto/Servicio General",
        price: 0,
        price_type: "price_service",
        type: "price_service",
        office: this.office.id,
        uuid : this.$uuid.v4(),
        quantity : 1,
        dimension : '',
        dim_a : 0,
        dim_b : 0,
        materialCheck : false,
        qualityCheck : false,
        finishCheck : false,
        material : null,
        quality : null,
        finish : null,
        description : '',
        subtotal : 0,
        showImage : false,
        unit : true,
        cooldown : true,
        images : []
      }
      this.selectProducts.push(obj)
    },

    onSearchCustomer(search, loading) {
      loading(true)
      this.searchCustomer(loading, search, this)
    },

    searchCustomer: _.debounce(async (loading, search, vm) => {
      const data = {
        column: vm.selectedFilterCus,
        value: search
      }
      try {
        const customers = await CustomerService.searchCustomer(data)
        if (customers.status === 200) {
          vm.customers = customers.data.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.customers = []
          loading(false)
        }
      }
    }, 350),

    onSearchProduct(search, loading) {
      loading(true)
      this.searchProduct(loading, search, this)
    },

    searchProduct: _.debounce(async (loading, search, vm) => {
      const data = {
        column: vm.selectedFilterPro,
        value: search,
        price_type: vm.price_type,
        office: vm.office.id
      }
      try {
        const products = await ProductService.searchProduct(data)
        if (products.status === 200) {
          vm.products = products.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.products = []
          loading(false)
        }
      }
    }, 350),

    checkToDownload(quotation) {
      if(this.flagDonwload) {
        this.downloadQuotation(quotation)
      }
      this.loading = false
      this.$router.push({ name: 'ShowQuotation', params: {id: this._save.data.data.id }})
    },

    submit: async function() {
      let products = this.selectProducts.map(item => {
        let price = this.toFloat(item.price)
        let obj = Object.assign({}, item)
        obj['dimension'] = `${item.dim_a} x ${item.dim_b}`
        obj['price'] = price
        obj['filters'] = {
          product: item.id,
          new_price: price,
          price_type: item.price_type,
          office: item.office,
        }
        const {office, ...newObj} = obj
        return newObj
      })

      this.error = null
      this.loading = true
      this.$validator.errors.clear()
      try {
        this.quotation.user_id = this.currentUser.id
        this.quotation.office_id = this.office.id
        let data = {quotation: this.quotation, products: products}
        if(this.id) {
          this._save = await QuotationService.updateQuotation(this.quotation.id, data)
        } else {
          this._save = await QuotationService.storeQuotation(data)
        }

        if (this._save.status === 201 || this._save.status === 200) {
          this.checkToDownload(this._save.data.data)
          this.$message.success(this._save.data.message)
        }
      } catch (err) {
        if (err.response.status === 422) {
          this.$setErrorsFromResponse(err.response.data)
          this.error = err.response.data.errors
        }
        this.loading = false
      }
    },

    downloadQuotation: async function(quotation) {
      const key = 'updatable'
      try {
        this.$message.loading({ content: 'Descargando pdf espere...', key, duration: 4})
        const response = await QuotationService.downloadQuotation(quotation.id)
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = `${quotation.cite}.pdf`
          link.click()
          this.$message.success({ content: 'Documento Listo!', key, duration: 2 })
        }
      } catch (err) {
        this.$message.error({ content: 'No es posible descargar el documento', key })
      }
    }
  }
}
</script>

<style scoped src="../../assets/css/table_quotation.css"></style>