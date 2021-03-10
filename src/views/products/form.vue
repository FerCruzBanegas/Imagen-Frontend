<template>
  <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <legend>Datos Generales:</legend>
    <a-spin :spinning="success">
      <div class="container">
        <div class="d-flex flex-row-reverse bd-highlight">
          <small><strong>Los campos con (*) son obligatorios.</strong></small>
        </div>
        <b-form @submit.stop.prevent="submit">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="name">Nombre* :</label>
              </strong>
              <b-form-group label-for="name" :invalid-feedback="errors.first('name')" :state="!errors.has('name')">
                <b-form-input 
                  v-model="product.name" 
                  :state="errors.has('name') ? false : null"
                  v-validate="'required|min:3|max:120'"
                  data-vv-name="name"
                  data-vv-as="nombre"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-3 col-xl-3">
              <strong>
                <label for="code">Código* :</label>
              </strong>
              <b-form-group label-for="code" :invalid-feedback="errors.first('code')" :state="!errors.has('code')">
                <b-form-input 
                  v-model="product.code" 
                  :state="errors.has('code') ? false : null"
                  v-validate="'required|max:16'"
                  data-vv-name="code"
                  data-vv-as="código"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-3 col-xl-3">
              <strong>
                <label for="dimension">Dimensión MT2* :</label>
              </strong>
              <b-form-group label-for="dimension" :invalid-feedback="errors.first('dimension')" :state="!errors.has('dimension')">
                <b-form-input 
                  class="text-right"
                  v-money="money"
                  v-model.lazy="product.dimension" 
                  :state="errors.has('dimension') ? false : null"
                  v-validate="'required|max:10'"
                  data-vv-name="dimension"
                  data-vv-as="dimensión"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="description">Descripción :</label>
              </strong>
              <b-form-group label-for="description" :invalid-feedback="errors.first('description')" :state="!errors.has('description')">
                <b-form-input 
                  v-model="product.description" 
                  :state="errors.has('description') ? false : null"
                  v-validate="'max:100'"
                  data-vv-name="descripción"
                  data-vv-as="código"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="category_id">Categoría * :</label>
              </strong>
              <b-form-group label-for="category_id" :invalid-feedback="errors.first('category_id')" :state="!errors.has('category_id')">
                <v-select
                  v-model="product.category_id" 
                  :options="categories"
                  :reduce="category => category.id"
                  label="name"
                  :state="errors.has('category_id') ? false : null"
                  v-validate="'required'"
                  data-vv-name="category_id"
                  data-vv-as="categoría"
                ></v-select>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="material">Materiales (Descripción) :</label>
              </strong>
              <b-form-group label-for="material" :invalid-feedback="errors.first('material')" :state="!errors.has('material')">
                <b-form-textarea
                  style="border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                  v-model="product.material"
                  :state="errors.has('material') ? false : null"
                  v-validate="'max:512'"
                  data-vv-name="material"
                  data-vv-as="materiales">
                </b-form-textarea>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="quality">Calidad :</label>
              </strong>
              <b-form-group label-for="quality" :invalid-feedback="errors.first('quality')" :state="!errors.has('quality')">
                <b-form-textarea
                  style="border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                  v-model="product.quality"
                  :state="errors.has('quality') ? false : null"
                  v-validate="'max:512'"
                  data-vv-name="quality"
                  data-vv-as="calidad">
                </b-form-textarea>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="finish">Acabado :</label>
              </strong>
              <b-form-group label-for="finish" :invalid-feedback="errors.first('finish')" :state="!errors.has('finish')">
                <b-form-textarea
                  style="border-color: #9e0207;outline: 0px;box-shadow: rgba(0, 0, 0, 0.075) 0px 1px 1px inset, #9e020761 0px 0px 8px;"
                  v-model="product.finish"
                  :state="errors.has('finish') ? false : null"
                  v-validate="'max:512'"
                  data-vv-name="finish"
                  data-vv-as="acabado">
                </b-form-textarea>
              </b-form-group>
            </div>
          </div>
          <div class="row my-2">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <b-form-checkbox v-model="retry">
    			      Quedarme en la página después de registrar los datos.
    			    </b-form-checkbox>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <b-button 
                type="submit" 
                class="float-right" 
              >{{ id == null ? 'REGISTRAR' : 'ACTUALIZAR' }}</b-button>
            </div>
          </div>
        </b-form>
      </div>
    </a-spin>
  </fieldset>
</template>

<script>
import {VMoney} from 'v-money'
import Money from '../../models/Money'
import Product from '../../models/Product'
import formatter from '../../mixins/formatter'
import CategoryService from '../../services/category.service'
import ProductService from '../../services/product.service'

export default {
  data() {
    return {
      money: new Money(),
      product: new Product(),
      success: true,
      retry: false,
      id: this.$route.params.id,
      categories: [],
    };
  },

  directives: {
    money: VMoney,
  },

  mixins: [formatter],

  created() {
    this.listCategories()
    if (this.id) {
      this.showProduct()
    }
  },

  methods: {
    showProduct:async function() {
      const response = await ProductService.showProduct(`products/${this.id}/edit`)
      if (response.status === 200) {
        this.product = response.data.data
        this.success = false
      }
    },

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        this.product.dimension = Number(this.toFloat(this.product.dimension))
        if(this.id) {
          this._save = await ProductService.updateProduct(this.id, this.product)
        } else {
          this._save = await ProductService.storeProduct(this.product)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.success = false
          this.$message.success(this._save.data.message)
          if (this.retry && !this.id) {
            this.product = new Product()
          } else {
            this.$router.push({ name: 'ShowProduct', params: {id: this._save.data.data.id }})
            // this.$router.push({ path: '/servicios/productos'})
          }
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },

    listCategories: async function() {
      const categories = await CategoryService.listCategories();
      if (categories.status === 200) {
        this.categories = categories.data
        this.success = false
      }
    }
  }
}
</script>
<style scoped>
  fieldset {
    background-color: #e9e4e6;
    border-radius: 4px;
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
