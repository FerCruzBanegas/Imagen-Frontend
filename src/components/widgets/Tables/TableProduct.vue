<template>
  <div>
    <a-spin :spinning="loaderProduct">
      <table>
        <thead>
          <tr>
            <th scope="col" width="50px">Item</th>
            <th scope="col" width="40px">Cantidad</th>
            <th scope="col" width="50px">Dimensión</th>
            <th scope="col" width="350px">Descripción</th>
            <th scope="col" width="100px">P/U</th>
            <th scope="col" width="80px">SubTotal</th>
            <th scope="col" width="10px"></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(product, index) in products" :key="index">
            <td data-label="Item"><span>{{ index + 1 }}</span></td>
            <td data-label="Cantidad">
              <b-form-input @focus ="$event.target.select()" v-model="product.quantity" class="text-center" size="sm" type="number" min="1" @keydown="filterKey" @keyup="change(product)"></b-form-input>
            </td>
            <!-- <td data-label="Dimensión">{{ product.dimension }}</td> -->
            <td data-label="Dimensión">
              <!-- <b-form-input 
                @focus ="$event.target.select()" 
                v-model="product.dimension"
                class="text-right" size="sm">
              </b-form-input> -->
              <b-input-group size="sm">
                <b-form-input @focus ="$event.target.select()" v-model.lazy="product.dim_a" class="text-center" v-money="money"></b-form-input>
                <b-input-group-append is-text>
                  x
                </b-input-group-append>
                <b-form-input @focus ="$event.target.select()" v-model.lazy="product.dim_b" class="text-center" v-money="money"></b-form-input>
              </b-input-group>
            </td>
            <td data-label="Descripción">
              <p class="h6 font-weight-bold">{{ product.name }}</p>
              <div class="d-flex flex-row">
                <div class="p-2">
                  <b-form-checkbox v-model="product.materialCheck" size="sm">
                    Materiales
                  </b-form-checkbox>
                </div>
                <div class="p-2">
                  <b-form-checkbox v-model="product.qualityCheck" size="sm">
                    Calidad
                  </b-form-checkbox>
                </div>
                <div class="p-2">
                  <b-form-checkbox v-model="product.finishCheck" size="sm">
                    Acabado
                  </b-form-checkbox>
                </div>
              </div>
              <b-form-group v-if="product.materialCheck">
                <b-form-textarea 
                  style="border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                  v-model="product.material">
                </b-form-textarea>
              </b-form-group>
              <b-form-group v-if="product.qualityCheck">
                <b-form-input
                  style="border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"  
                  v-model="product.quality">
                </b-form-input >
              </b-form-group>
              <b-form-group v-if="product.finishCheck">
                <b-form-textarea
                  style="border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                  v-model="product.finish">
                </b-form-textarea>
              </b-form-group>
              <b-form-group>
                <b-input-group class="mb-2">
                  <b-form-input 
                    v-model="product.description"
                    placeholder="Observaciones">
                  </b-form-input>
                  <b-input-group-append is-text>
                    <b-form-checkbox switch class="mr-n2" @change="checkImage(product)" v-model="product.showImage"></b-form-checkbox>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
              <div style="margin-bottom: 1px; display: flex; justify-content: center;" v-if="product.showImage">
                <vue-upload-multiple-image
                  dragText="Arrastrar imagen"
                  browseText="(o) Seleccione Máximo 3M"
                  @upload-success="uploadImageSuccess"
                  @before-remove="beforeRemove"
                  @upload-failed="uploadFailed"
                  :data-images="product.images"
                  :idUpload="product.uuid"
                  :maxImage="2"
                ></vue-upload-multiple-image>
              </div>
            </td>
            <td data-label="P/U">
              <b-input-group class="mb-2">
                <b-input-group-prepend is-text>
                  <input v-model="product.unit" v-b-tooltip.hover title="Marque para cotizar con precio por unidad" type="checkbox" @change="changePrice(product)" :disabled="product.cooldown">
                </b-input-group-prepend>
                <input class="form-control form-control-sm text-right" v-model.lazy="product.price" v-money="money">
              </b-input-group>
              <!-- <input class="form-control form-control-sm text-right" v-model.lazy="product.price" v-money="money"> -->
            </td>
            <td data-label="SubTotal" class="h6">{{ total(product) | currency }}</td>
            <td>
              <b-button @click="removeItem(index)" squared size="sm" variant="outline-secondary"><i class="fa fa-trash"></i></b-button>
            </td>
          </tr>
        </tbody>
      </table>
    </a-spin>
  </div>
</template>
<script>
import { mapGetters } from 'vuex'  
import {VMoney} from 'v-money'
import formatter from '../../../mixins/formatter'
import VueUploadMultipleImage from 'vue-upload-multiple-image'

export default {
  props: {
    products: {
      type: Array
    },
  },

  computed: {
    ...mapGetters(["loaderProduct"])
  },

  mixins: [formatter],

  directives: {
    money: VMoney,
    empty: {
      inserted: function (el) {
        el.value == '' ? el.value = 0 : ''
      }
    }
  },

  components: {
    VueUploadMultipleImage,
  },

  data() {
    return {
      money: {
        decimal: '.',
        thousands: ',',
        prefix: '',
        suffix: '',
        precision: 2,
        masked: false
      },
      checked1: false,
      checked2: false
    }
  },

  methods: {
    filterKey(e){
      const key = e.key;
      if (key === '-') return e.preventDefault();
      if (key === '+') return e.preventDefault();
      if (key === '.') return e.preventDefault();
      if (key === 'e') return e.preventDefault();
    },

    changePrice(product) {
      if (product.type) {
        if (product.unit) {
          product.price_type = 'price_service'
        } else {
          product.price_type = product.type
        }
      }
    },

    change(product) {
      if (product.quantity == '' || product.quantity == 0) product.quantity = 1
    },

    changeFloat(product) {
      if (product.dim_a === '')
        product.dim_a = 0
      else if (product.dim_b === '')
        product.dim_b = 0
    },

    checkImage(product) {
      this.$emit('emptyImages', product)
    },

    uploadFailed(flag) {
      if (flag) {
        this.$notification.warning({
          message: 'Nota',
          description: 'La imagen debe tener un peso máximo de 3MB',
          duration: 10,
        })
      }
    },

    uploadImageSuccess(formData, index, fileList, e) {
      let a = this.products.find(element => element.uuid == e.idUpload)
      a.images = fileList
    },

    beforeRemove (index, done, fileList, e) {
      const productHasImages = images => {
        const map = new Map(
          images.map(image => [image.name, image])
        );

        return product => (
          product.images.length === images.length &&
          product.images.every(
            ({ name, path }) => {
              const image = map.get(name);

              if (!image) return false;

              return image.path === path;
            }
          )
        )
      }

      const product = this.products.find(productHasImages(e.dataImages))

      let r = confirm("quitar esta imagen de la lista?")
      if (r == true) {
        done() 
        if (fileList.length === 0) product.showImage = false
        product.images = fileList
      }
    },

    total(product) {
      if (product.price_type === 'price_service') {
        return parseInt(product.quantity) * parseFloat(this.toFloat(product.price)).toFixed(2)
      } else {
        let dimension = this.toFloat(product.dim_a) * this.toFloat(product.dim_b)
        return parseInt(product.quantity) * parseFloat((dimension * this.toFloat(product.price))).toFixed(2) 
      }
    },

    removeItem(index) {
      this.$emit('removeIt', index)      
    },
  }
}
</script>
<style scoped>
/* Chrome, Safari, Edge, Opera */
input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
  -webkit-appearance: none;
  margin: 0;
}

/* Firefox */
input[type=number] {
  -moz-appearance: textfield;
}

table {
  border-collapse: collapse;
  width: 100%;
}

table th,
table td {
  border: 1px solid #807979;
  padding: 0.625em;
  text-align: center;
  font-weight: bold;
}

table tbody tr {
  background-color: rgb(212, 212, 212);
  border: 1px solid #ddd;
  padding: 0.35em;
  font-size: 0.70em;
}

table tfoot tr {
  background-color: #fff;
}

table tr:nth-child(even){background-color: #f2f2f2;}

table tr:hover {background-color: #ececec;}

table thead th {
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #9e0207;
  color: white;
  text-transform: uppercase;
  font-size: 0.85em;
}

@media screen and (max-width: 800px) {
  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tfoot th {
    border: none;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>