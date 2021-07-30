<template>
  <div v-if="note">
    <modal-note
      :note="noteItem" 
      :visible="visibleNote" 
      @hide="closeModalNote" 
    ></modal-note>
    <b-modal
      v-model="visible"
      :header-bg-variant="'secondary'"
      size="xl"
      no-close-on-backdrop
      no-close-on-esc
      hide-footer
      scrollable
    >
      <template v-slot:modal-header="{ close }">
        <h5 class="text-white">Editar Datos de Nota</h5>
        <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
      </template>
      <a-spin :spinning="success">
        <div class="container">
          <div class="row">
            <div class="col-md-3">
              <span class="font-weight-bold">Nº: {{ note.number }}</span>
            </div>
            <div class="col-md-6">
              <div class="text-center"><h1 class="font-weight-bold">NOTA DE REMISION</h1></div>
            </div>
          </div>
          <small class="float-right font-weight-bold"><i class="fa fa-exclamation-circle fa-lg" style="color:red"></i> Solo podrá editar datos de los items en la nota emitida.</small>
          <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12 mt-2">
            <legend>Datos Generales:</legend>
            <!-- <pre>{{ $data }}</pre> -->
            <div class="container">
              <div class="row bg-secondary">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 border">
                  <div class="d-flex justify-content-between my-2">
                    <span class="text-white font-weight-bold">Registrado:</span>
                    <span class="text-white font-weight-bold">{{ note.created | formatDate('DD/MM/YYYY') }}</span>
                  </div>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 border">
                  <div class="d-flex justify-content-between my-2">
                    <span class="text-white font-weight-bold">Actualizado:</span>
                    <span class="text-white font-weight-bold">{{ note.updated | formatDate('DD/MM/YYYY') }}</span>
                  </div>
                </div>
              </div>
              <div class="row bg-light">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="font-weight-bold pt-2 list">Sucursal:</div>
                  <p>{{ note.voucher.office.name }}</p>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="font-weight-bold pt-2 list">Fecha Emisión:</div>
                  <p>{{ note.date | formatDate('DD/MM/YYYY') }}</p>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="font-weight-bold pt-2 list">Cliente:</div>
                  <p>{{ note.customer_data.business_name }}</p>
                </div>
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class=" font-weight-bold pt-2 list">NIT:</div>
                  <p>{{ note.customer_data.nit }}</p>
                </div>
              </div>
            </div> 
          </fieldset>
          <div class="row mt-2">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div class="border border-dark">
                <div class="container">
                  <div class="row">
                    <div class="col-sm-8 my-2">
                      <div class="d-table-cell w-100">
                        <v-select
                          label="name"
                          :filterable="false"
                          :options="productsList"
                          v-model="product"
                          @search="onSearchProduct"
                        >
                          <template slot="no-options">Buscar productos..</template>
                          <template slot="option" slot-scope="product">
                            <div>
                              <strong>{{ product.name }}</strong>
                            </div>
                          </template>
                          <template slot="selected-option" slot-scope="product">
                            <div>
                              <strong>{{ product.name }}</strong>
                            </div>
                          </template>
                        </v-select>
                      </div>
                      <div class="d-table-cell align-middle">
                        <b-button title="Agregar Producto" @click="addProduct" style="height: 2.5em;" size="sm" class="ml-2" variant="dark">
                          <i class="fa fa-plus-circle" aria-hidden="true"></i>
                        </b-button>
                      </div>
                      <div class="d-table-cell align-middle">
                        <b-button title="Recargar Datos" @click="getProductsNote" style="height: 2.5em;" size="sm" class="mx-2" variant="success">
                          <i class="fa fa-refresh" aria-hidden="true"></i>
                        </b-button>
                      </div>
                      <div class="d-table-cell align-middle">
                        <b-button title="Borrar Todos" @click="removeAllProducts" style="height: 2.5em;" size="sm" variant="danger">
                          <i class="fa fa-trash" aria-hidden="true"></i>
                        </b-button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <div id="light-table"  class="table-responsive" style="margin-top: 5px;">
                <table id="invoice-table" class="table" >
                  <tr class="invoice_line" style="background-color: #FFDBDC;">
                    <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">CANTIDAD</th>
                    <th style="color: #9e0207; letter-spacing: 0.5em; padding:10px; width: 340px; font-weight: bold; font-size: 20px;">DETALLE</th>
                    <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">P. UNIT.</th>
                    <th style="color: #9e0207; padding:10px; width: 120px; font-weight: bold; font-size: 20px;">SUB TOTAL</th>
                  </tr>
                  <tr v-for="(product, index) in products" :key="index" class="invoice_line" style="text-align: center;">
                    <td style="color: #000000; font-size: 15px; font-weight: bold;">
                      <p style="margin-bottom: 0;">&nbsp;</p>
                      <!-- <span>{{ product.quantity }}</span> -->
                      <b-form-input v-model="product.quantity" @focus="$event.target.select()" class="text-center" type="number" min="1" @keydown="filterKey" @keyup="change(product)"></b-form-input>
                    </td>
                    <td style="color: #000000; text-align: justify; font-size: 15px;">
                      <p style="text-align: center; margin-bottom: 0; font-weight: bold;">{{ product.name }}</p>
                      <b-form-textarea
                        rows="3"
                        style="font-size: 12px; font-weight: bold;border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                        v-model="product.description">
                      </b-form-textarea>
                    </td>
                    <td style="color: #000000; font-size: 15px; font-weight: bold;">
                      <p style="margin-bottom: 0;">&nbsp;</p>
                      <!-- <span>{{ product.price }}</span> -->
                      <b-form-input class="text-center" v-model.lazy="product.price" v-money="money"></b-form-input>
                    </td>
                    <td style="color: #000000; font-size: 16px; font-weight: bold;">
                      <p style="margin-bottom: 0; ">&nbsp;</p>
                      <span>{{ total(product) | currency }}</span>
                      <b-button pill class="ml-2 btn-close" @click="removeItem(index)" size="sm" variant="dark"><i class="fa fa-close"></i></b-button>
                    </td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td><div class="text-right font-weight-bold h6" style="margin-bottom: 0;">SUBTOTAL</div></td>
                    <td><div class="text-center font-weight-bold h6" style="margin-bottom: 0;">{{ subTotal | currency }}</div></td>
                  </tr>
                  <tr>
                    <td>&nbsp;</td>
                    <td>&nbsp;</td>
                    <td><div class="text-right font-weight-bold h6 mt-2">DESCUENTO</div></td>
                    <td><b-form-input v-model="note.discount" v-money="money" class="text-center" size="sm"></b-form-input></td>
                  </tr>
                  <tr class="invoice_line">
                    <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 20px; font-weight: bold; padding:16px;">TOTAL Bs.</td>
                    <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 20px; color: #000000; font-weight: bold; padding:16px; background: #FFDBDC;">{{ grandTotal | currency }}</td>
                  </tr>
                </table>
              </div>
              <div class="d-flex flex-sm-row flex-column bg-custom">
                <div class="pl-2 text-dark font-weight-bold">
                  <label style="margin-bottom: 0;" for="set_accounts" class="p-2">Registrar en cuentas por cobrar?</label>
                  <input v-model="note.accounts" type="checkbox" id="set_accounts" class="k-checkbox" checked="checked">
                </div>
              </div>
              <hr/>
              <div class="row">
                <div class="col-md-12">
                  <strong>
                    <label for="note.summary">Resumen (Glosa para reporte):</label>
                  </strong>
                  <b-form-group label-for="note.summary" :invalid-feedback="errors.first('note.summary')" :state="!errors.has('note.summary')">
                    <b-form-textarea
                      v-model="note.summary"
                      :state="errors.has('note.summary') ? false : null"
                      v-validate="'min:3|max:500'"
                      data-vv-name="note.summary"
                      data-vv-as="resumen"
                      placeholder="Resumen (Glosa para reporte)"
                      rows="2"
                      style="font-size: 12px; font-weight: bold;border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                    ></b-form-textarea>
                  </b-form-group>
                </div>
              </div>
              <div class="pt-2" v-if="error">
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
          <b-popover
            target="note-edit-confirm"
            triggers="click"
            :show.sync="popoverEditNote"
            placement="auto"
            container="my-container"
            ref="popover"
          >
            <template #title>
              Alerta
            </template>
            <div>
              <p>Realmente desea modificar esta Nota?</p>
              <b-button class="mr-2" @click="onClosePopoverNote" size="sm" variant="danger">NO</b-button>
              <b-button @click="submit" size="sm" variant="dark">SI</b-button>
            </div>
          </b-popover>
          <div class="row my-2">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <b-button 
                id="note-edit-confirm"
                ref="button"
                class="float-right mr-2"
              >Actualizar Nota</b-button>
              <b-button
                variant="dark" 
                @click="viewNote" 
                class="float-right mr-2"
              >Vista Previa <i class="fa fa-search-plus" aria-hidden="true"></i></b-button>
            </div>
          </div>
        </div>
      </a-spin>
    </b-modal>
  </div>
</template>
<script>
import {VMoney} from 'v-money'
import Money from '../../../models/Money'
import formatter from '../../../mixins/formatter'
import ModalNote from "./ModalNote.vue"
import ProductService from '../../../services/product.service'
import NoteService from '../../../services/note.service'

export default {
  props: {
    visible: Boolean,
  },

  data() {
    return {
      money: new Money(),
      success: false,
      noteItem: null,
      popoverEditNote: false,
      visibleNote: false,
      error: null,
      productsList: [],
      product: null,
      note: null,
      products: [],
    }
  },
 
  mixins: [formatter],

  directives: {
    money: VMoney,
  },

  components: {
    "modal-note": ModalNote,
  },

  watch: {
    product: function (value) {
      if(value) this.addProduct()
    }
  },

  computed: {
    subTotal() {
      let total = this.products.reduce((acc, item) => {
        let val = 0
        val = parseInt(item.quantity) * parseFloat(this.toFloat(item.price)).toFixed(2)
        item.subtotal = parseFloat(val).toFixed(2)
        return acc + val
      }, 0)
      return isNaN(total) ? 0 : total
    },

    grandTotal() 
    {
      let total = 0
      total = (this.subTotal - this.toFloat(this.note.discount))
      this.note.total = this.toFloat(total)
      return isNaN(total) ? 0 : Number(parseFloat(total).toFixed(2))
    }
  },

  created() {
    this.$bus.$on('setObjNote', data => {
      this.note = data
      this.products = Array.from(data.products)
    })
  },

  methods: {
    onSearchProduct(search, loading) {
      loading(true)
      this.searchProduct(loading, search, this)
    },

    searchProduct: _.debounce(async (loading, search, vm) => {
      const data = {
        column: 'name',
        value: search
      }
      try {
        const products = await ProductService.searchProduct(data)
        if (products.status === 200) {
          vm.productsList = products.data
          loading(false)
        }
      } catch (err) {
        if (err.response.status === 404) {
          vm.productsList = []
          loading(false)
        }
      }
    }, 350),

    addProduct() {
      if (this.product) {
        let obj = {
          id: this.product.id,
          name: this.product.name,
          quantity: 1,
          description: '',
          price: 0,
          subtotal: 0,
        }
        this.products.push(obj)
      }
    },

    getProductsNote: async function(note) {
      try {
        this.success = true
        const response = await NoteService.showNote(`notes/products/${this.note.id}`)
        if (response.status === 200) {
          this.products = response.data.data.products
          this.success = false
        }
      } catch (err) {
        this.success = false
      }
    },

    removeAllProducts() {
      this.products = []
    },

    total(product) {
      return parseInt(product.quantity) * this.toFloat(product.price) 
    },

    change(product) {
      if (product.quantity == '' || product.quantity == 0) product.quantity = 1
    },

    filterKey(e){
      const key = e.key;
      if (key === '-') return e.preventDefault();
      if (key === '+') return e.preventDefault();
      if (key === '.') return e.preventDefault();
      if (key === 'e') return e.preventDefault();
    },

    closeModalNote() {
      this.visibleNote = false
    },

    onClosePopoverNote() {
      this.popoverEditNote = false
    },

    removeItem(index) {
      if (index > -1) this.products.splice(index, 1)
    },
    
    async viewNote() {
      try {
        let note = {
          number: this.note.number,
          date: this.note.date,
          subtotal: this.subTotal,
          total: this.note.total,
          discount: this.note.discount,
          voucher: this.note.voucher,
          products: this.products,
          customer_data: {
            business_name: this.note.customer_data.business_name,
            nit: this.note.customer_data.nit
          }
        }

        this.noteItem = note
        this.visibleNote = true
      } catch (err) {
        this.visibleNote = false
      }
    },

    async submit() {
      this.error = null
      this.success = true
      
      let note = {
        total: this.note.total,
        discount: this.note.discount,
        summary: this.note.summary,
        accounts: this.note.accounts,
      }

      let products = this.products.map(item => {
        let obj = new Object()
        obj.id = item.id
        obj.quantity = item.quantity
        obj.description = item.description
        obj.price = this.toFloat(item.price)
        obj.subtotal = this.toFloat(item.subtotal)
        return obj
      })

      this.onClosePopoverNote()
      try {
        const response = await NoteService.updateNote(this.note.id, {note: note, products: products})
        if (response.status === 200) {
          this.success = false
          this.onClose()
          this.$message.success(response.data.message)
        }
      } catch (err) {
        this.onClosePopoverNote()
        if (err.response.status === 422) {
          this.$setErrorsFromResponse(err.response.data)
          this.error = err.response.data.errors
        }
        if (err.response.status === 406) {
          this.onClose()
          this.$notification.warning({
            message: 'Alerta',
            description: err.response.data,
            duration: 10,
            placement: 'bottomRight'
          })
        }
        this.success = false
      }
    },

    onClose() {
      this.error = null
      this.$emit("hide")
    }
  }
}
</script>
<style scoped>
.bg-custom {
  background-color: #d8d8d8;
}

.btn-close {
  font-size: .650rem;
  line-height: 1.5;
  border-radius: .2rem;
}

.fade-enter-active, .fade-leave-active {
  transition: opacity .1s
}
.fade-enter, .fade-leave-to {
  opacity: 0
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

input[type=number] {
  -moz-appearance: textfield;
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

#light-table {
  width: 100%;  
  padding-top: 0;
  padding-bottom: 0;
  text-align: left;
}

#invoice-table {
  border: 2px solid #9e0207;
  border-radius: 7px;
  border-spacing: 0;
  box-sizing: border-box;
  clear: both;
  margin: 2mm 0mm;
  height: 50mm;
  width: 100%;
}

#invoice-table th, td { border-left: 2px solid #9e0207; }
#invoice-table th:first-child, td:first-child { border-left: none; }
#invoice-table th { border-bottom: 2px solid #9e0207; }
#invoice-table td { vertical-align: top; font-size: 8pt; }
th { text-align: center; font-weight: normal; }
.amount { text-align: center; }
.invoice_line { height: 6mm; }
.invoice_line td, .invoice_line th { padding: 1mm; }
</style>