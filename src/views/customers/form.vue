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
                  label="name"
                  v-model="customer.city_id" 
                  :options="cities"
                  :reduce="city => city.id"
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
                  v-validate="'max:64|email'"
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
import Customer from '../../models/Customer'
import CityService from '../../services/city.service'
import CustomerService from '../../services/customer.service'

export default {
  data() {
    return {
      success: true,
      retry: false,
      id: this.$route.params.id,
      customer: new Customer(),
      cities: [],
    };
  },

  created() {
    this.listCities()
    if (this.id) {
      this.showCustomer()
    }
  },

  methods: {
    showCustomer:async function() {
      const response = await CustomerService.showCustomer(`customers/${this.id}/edit`)
      if (response.status === 200) {
        let obj =  {
          id: response.data.data.id,
          business_name: response.data.data.business_name,
          address: response.data.data.address,
          nit: response.data.data.nit,
          phone: response.data.data.phone,
          email: response.data.data.email,
          city_id: response.data.data.city.id
        }
        this.customer = obj
        this.success = false
      }
    },

    submit: async function() {
      const vm = this
      vm.success = true
      vm.$validator.errors.clear()
      try {
        if(vm.id) {
          vm._save = await CustomerService.updateCustomer(vm.id, vm.customer)
        } else {
          vm._save = await CustomerService.storeCustomer(vm.customer)
        }
        if (vm._save.status === 201 || vm._save.status === 200) {
          vm.success = false
          this.$emit("success", vm._save.data.data)
          this.$message.success(vm._save.data.message)
          if (vm.retry && !this.id) {
            vm.customer = new Customer()
          } else {
            vm.$router.push({ name: 'ListCustomers'})
          }
        }
      } catch (err) {
        if(err.response.status === 422) vm.$setErrorsFromResponse(err.response.data)
        vm.success = false
      }
    },

    listCities: async function() {
      const cities = await CityService.listCities();
      if (cities.status === 200) {
        this.cities = cities.data
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
