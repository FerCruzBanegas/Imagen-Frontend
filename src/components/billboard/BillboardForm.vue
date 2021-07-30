<template>
  <a-spin :spinning="success">
    <div class="container">
      <b-form @submit.stop.prevent="submit">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="city_id">Ciudad * :</label>
            </strong>
            <b-form-group label-for="city_id" :invalid-feedback="errors.first('city_id')" :state="!errors.has('city_id')">
              <div class="d-table-cell w-100">
                <v-select
                  :disabled="id !== undefined"
                  label="name"
                  v-model="billboard.city_id" 
                  :options="cities"
                  :reduce="city => city.id"
                  :state="errors.has('city_id') ? false : null"
                  v-validate="'required'"
                  data-vv-name="city_id"
                  data-vv-as="ciudad"
                ></v-select>
              </div>
              <div class="d-table-cell align-middle">
                <b-popover
                  target="popover-city"
                  triggers="click"
                  :show.sync="popoverCity"
                  placement="auto"
                  container="my-container"
                  ref="popover"
                >
                  <template #title>
                    Nueva Ciudad
                  </template>
                  <div>
                    <strong>
                      <label for="name">Nombre * :</label>
                    </strong>
                    <b-form-group label-for="name" :invalid-feedback="errors.first('name')" :state="!errors.has('name')" class="mb-2">
                      <b-form-input
                        v-model="city.name" 
                        :state="errors.has('name') ? false : null"
                        v-validate="'required|min:3|max:60'"
                        data-vv-name="name"
                        data-vv-as="nombre"
                        size="sm"
                      ></b-form-input>
                    </b-form-group>

                    <strong>
                      <label for="code_city">Código * :</label>
                    </strong>
                    <b-form-group label-for="code_city" :invalid-feedback="errors.first('code_city')" :state="!errors.has('code_city')" class="mb-2">
                      <b-form-input
                        v-model="city.code_city" 
                        :state="errors.has('code_city') ? false : null"
                        v-validate="'required|min:3|max:60'"
                        data-vv-name="code_city"
                        data-vv-as="código ciudad"
                        size="sm"
                      ></b-form-input>
                    </b-form-group>

                    <b-button :disabled="loaderCity" @click="onClose" class="btn-add" size="sm" variant="outline-danger">Cancelar</b-button>
                    <b-button :disabled="loaderCity" @click="submitCity" class="btn-add ml-2" size="sm" variant="outline-secondary">
                      <b-spinner v-if="loaderCity" small label="Small Spinner" type="grow"></b-spinner> Registrar
                    </b-button>
                  </div>
                </b-popover>
                <b-button id="popover-city" style="height: 2.5em;" class="ml-1" size="sm" variant="dark">
                  <i class="fa fa-plus-circle" aria-hidden="true"></i>
                </b-button>
              </div>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="zone">Zona * :</label>
            </strong>
            <b-form-group label-for="zone" :invalid-feedback="errors.first('zone')" :state="!errors.has('zone')">
              <b-form-input 
                v-model="billboard.zone" 
                :state="errors.has('zone') ? false : null"
                v-validate="'required|min:5|max:64'"
                data-vv-name="zone"
                data-vv-as="zona"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="location">Ubicación * :</label>
            </strong>
            <b-form-group label-for="location" :invalid-feedback="errors.first('location')" :state="!errors.has('location')">
              <b-form-input 
                v-model="billboard.location" 
                :state="errors.has('location') ? false : null"
                v-validate="'required|min:5|max:128'"
                data-vv-name="location"
                data-vv-as="ubicación"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="billboard_type_id">Tipo de Espacio * :</label>
            </strong>
            <b-form-group label-for="billboard_type_id" :invalid-feedback="errors.first('billboard_type_id')" :state="!errors.has('billboard_type_id')">
              <v-select 
                label="description"
                v-model="billboard.billboard_type_id"
                :reduce="type => type.id"
                :state="errors.has('billboard_type_id') ? false : null"
                v-validate="'required'"
                data-vv-name="billboard_type_id"
                data-vv-as="tipo"
                :options="types"
              ></v-select>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <b-form-group label-for="illumination" :invalid-feedback="errors.first('illumination')" :state="!errors.has('illumination')">
              <strong class="pr-2">
                <label for="illumination">Tiene Iluminación? * :</label>
              </strong>
              <b-form-radio-group
                v-model="billboard.illumination"
                :options="illumination"
                button-variant="outline-danger"
                size="sm"
                name="radio-btn-outline"
                buttons
                :state="errors.has('illumination') ? false : null"
                v-validate="'required'"
                data-vv-name="illumination"
                data-vv-as="iluminación"
              ></b-form-radio-group>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong class="pr-2">
              <label for="dimension">Dimensión * :</label>
            </strong>
            <b-form-group label-for="dimension" :invalid-feedback="errors.first('dimension')" :state="!errors.has('dimension')">
              <b-input-group>
                <b-form-input 
                  @focus ="$event.target.select()"
                  v-model="dim_a" 
                  class="text-center" 
                  v-money="money"
                  :state="errors.has('dimension') ? false : null"
                  v-validate="'required|max:6'"
                  data-vv-name="dimension"
                  data-vv-as="dimensión"
                ></b-form-input>
                <b-input-group-append is-text>
                  x
                </b-input-group-append>
                <b-form-input 
                  @focus ="$event.target.select()"
                  v-model="dim_b" 
                  class="text-center" 
                  v-money="money"
                  :state="errors.has('dimension') ? false : null"
                  v-validate="'required|max:6'"
                  data-vv-name="dimension"
                  data-vv-as="dimensión"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="price">Costo * :</label>
            </strong>
            <b-form-group label-for="price" :invalid-feedback="errors.first('price')" :state="!errors.has('price')">
              <b-input-group size="md" append="Bs.">
                <b-form-input 
                  class="text-center" 
                  v-model.lazy="billboard.price" 
                  v-money="money"
                  :state="errors.has('price') ? false : null"
                  v-validate="'required'"
                  data-vv-name="price"
                  data-vv-as="costo"
                ></b-form-input>
              </b-input-group>
            </b-form-group>
          </div>
        </div>
        <!-- <pre>{{ $data }}</pre> -->
        <div class="row my-2">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <small><strong>Los campos con (*) son obligatorios.</strong></small>
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <b-button 
              @click="submit"
              squared
              class="float-right" 
            >{{ id == null ? 'REGISTRAR' : 'ACTUALIZAR' }}</b-button>
          </div>
        </div>
      </b-form>
    </div>
  </a-spin>
</template>

<script>
import { mapGetters } from 'vuex'
import {VMoney} from 'v-money'
import moment from 'moment'
import formatter from '../../mixins/formatter'
import Money from '../../models/Money'
import City from '../../models/City'
import Billboard from '../../models/Billboard'
import BillboardService from '../../services/billboard.service'
import CityService from '../../services/city.service'

export default {
  data() {
    return {
      moment,
      success: true,
      id: this.$route.params.id,
      billboard: new Billboard(),
      money: new Money(),
      city: new City(),
      cities: [],
      dim_a: 0,
      dim_b: 0,
      illumination: [
        { text: 'SI', value: 1 },
        { text: 'NO', value: 0 },
      ],
      types: [
        {id: 1, description: 'Valla'}, 
        {id: 2, description: 'Unipolar'}, 
        {id: 3, description: 'Mural'}
      ],
      popoverCity: false,
      loaderCity: false,
    }
  },

  mixins: [formatter],
  
  computed: {
    ...mapGetters([
      'currentUser'
    ]),
  },

  directives: {
    money: VMoney,
  },

  created() {
    this.listCities()
    if (this.id) {
      this.showBillboard()
    }
  },

  methods: {
    onClose() {
      this.popoverCity = false
    },

    listCities: async function() {
      const cities = await CityService.listCities();
      if (cities.status === 200) {
        this.cities = cities.data
        this.success = false
      }
    },

    showBillboard:async function() {
      const response = await BillboardService.showBillboard(`billboards/${this.id}/edit`)
      if (response.status === 200) {
        let obj =  {
          id: response.data.data.id,
          zone: response.data.data.zone,
          location: response.data.data.location,
          price: response.data.data.price,
          illumination: response.data.data.illumination,
          city_id: response.data.data.city_id,
          billboard_type_id: response.data.data.billboard_type_id
        }

        let dimension = response.data.data.dimension.split(' x ')
        this.dim_a = parseFloat(dimension[0]).toFixed(2)
        this.dim_b = parseFloat(dimension[1]).toFixed(2)
        this.billboard = obj
        this.success = false
      }
    },

    async submitCity() {
      this.loaderCity = true
      this.$validator.errors.clear()
      try {
        const response = await CityService.storeCity(this.city)
        if (response.status === 201) {
          this.city = new City()
          this.$validator.pause()
          this.$nextTick(() => {
            this.$validator.resume()
          })
          this.cities.unshift(response.data.data)
          this.$message.success(response.data.message)
          this.popoverCity = false
          this.loaderCity = false
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.loaderCity = false
      }
    },

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()

      let billboard = Object.assign({}, this.billboard)
      billboard.dimension = `${Number(this.dim_a)} x ${Number(this.dim_b)}`
      billboard.price = Number(this.toFloat(billboard.price))
      
      try {
        if(this.id) {
          this._save = await BillboardService.updateBillboard(this.id, billboard)
        } else {
          this._save = await BillboardService.storeBillboard(billboard)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.$router.push({ name: 'ShowBillboard', params: {id: this._save.data.data.id }})
          this.$message.success(this._save.data.message)
          this.success = false
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },
  }
}
</script>
