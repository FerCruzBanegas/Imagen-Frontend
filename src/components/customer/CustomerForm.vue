<template>
  <a-spin :spinning="success">
    <div class="container">
      <b-form @submit.stop.prevent="submit">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="business_name">Señor (es) * :</label>
            </strong>
            <b-form-group label-for="business_name" :invalid-feedback="errors.first('business_name')" :state="!errors.has('business_name')">
              <b-form-input 
                v-model="customer.business_name" 
                :state="errors.has('business_name') ? false : null"
                v-validate="'required|max:64'"
                data-vv-name="business_name"
                data-vv-as="cliente"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="nit">NIT * :</label>
            </strong>
            <b-form-group label-for="nit" :invalid-feedback="errors.first('nit')" :state="!errors.has('nit')">
              <b-form-input 
                v-model="customer.nit" 
                :state="errors.has('nit') ? false : null"
                v-validate="'required|max:32'"
                data-vv-name="nit"
                data-vv-as="nit"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="phone">Teléfono * :</label>
            </strong>
            <b-form-group label-for="phone" :invalid-feedback="errors.first('phone')" :state="!errors.has('phone')">
              <b-form-input 
                v-model="customer.phone" 
                :state="errors.has('phone') ? false : null"
                v-validate="'required|max:32'"
                data-vv-name="phone"
                data-vv-as="teléfono"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="city_id">Ciudad * :</label>
            </strong>
            <b-form-group label-for="city_id" :invalid-feedback="errors.first('city_id')" :state="!errors.has('city_id')">
              <v-select
                v-model="customer.city_id" 
                :options="cities"
                :reduce="city => city.id"
                label="name"
                :state="errors.has('city_id') ? false : null"
                v-validate="'required'"
                data-vv-name="city_id"
                data-vv-as="ciudad"
              ></v-select>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="email">Email :</label>
            </strong>
            <b-form-group label-for="email" :invalid-feedback="errors.first('email')" :state="!errors.has('email')">
              <b-form-input 
                v-model="customer.email" 
                :state="errors.has('email') ? false : null"
                v-validate="'max:64'"
                data-vv-name="email"
                data-vv-as="email"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="address">Dirección  :</label>
            </strong>
            <b-form-group label-for="address" :invalid-feedback="errors.first('address')" :state="!errors.has('address')">
              <b-form-input 
                v-model="customer.address" 
                :state="errors.has('address') ? false : null"
                v-validate="'required|max:128'"
                data-vv-name="address"
                data-vv-as="dirección"
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
              type="submit" 
              squared
              class="float-right" 
            >REGISTRAR</b-button>
          </div>
        </div>
      </b-form>
    </div>
  </a-spin>
</template>

<script>
import Customer from '../../models/Customer'
import CityService from '../../services/city.service'
import CustomerService from '../../services/customer.service'

export default {
  props: {
    onSuccess: false
  },

  data() {
    return {
      success: false,
      id: this.$route.params.id,
      customer: new Customer(),
      cities: [],
    };
  },

  created() {
    this.listCities()
  },

  methods: {
    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        if(this.id) {
          this._save = await CustomerService.updateCustomer(this.id, this.customer)
        } else {
          this._save = await CustomerService.storeCustomer(this.customer)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.success = false
          this.$emit("success", this._save.data.data)
          this.$message.success(this._save.data.message)
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },
    
    listCities: async function() {
      this.success = true
      const cities = await CityService.listCities()
      if (cities.status === 200) {
        this.cities = cities.data
        this.success = false
      }
    }
  }
}
</script>