<template>
  <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <legend>Mis Datos:</legend>
    <a-spin :spinning="success">
      <div class="container">
        <div class="d-flex flex-row-reverse bd-highlight">
          <small><strong>Los campos con (*) son obligatorios.</strong></small>
        </div>
        <b-form @submit.stop.prevent="submit">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="name">Nombre* :</label>
              </strong>
              <b-form-group label-for="name" :invalid-feedback="errors.first('name')" :state="!errors.has('name')">
                <b-form-input 
                  v-model="user.name" 
                  :state="errors.has('name') ? false : null"
                  v-validate="'required|max:32'"
                  data-vv-name="name"
                  data-vv-as="nombre"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="email">Correo * :</label>
              </strong>
              <b-form-group label-for="email" :invalid-feedback="errors.first('email')" :state="!errors.has('email')">
                <b-form-input 
                  v-model="user.email" 
                  :state="errors.has('email') ? false : null"
                  v-validate="'required|max:64'"
                  data-vv-name="email"
                  data-vv-as="correo electrónico"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="phone">Teléfono * :</label>
              </strong>
              <b-form-group label-for="phone" :invalid-feedback="errors.first('phone')" :state="!errors.has('phone')">
                <b-form-input 
                  v-model="user.phone" 
                  :state="errors.has('phone') ? false : null"
                  v-validate="'required|max:32'"
                  data-vv-name="phone"
                  data-vv-as="teléfono"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="forename">Nombre(s) * :</label>
              </strong>
              <b-form-group label-for="forename" :invalid-feedback="errors.first('forename')" :state="!errors.has('forename')">
                <b-form-input 
                  v-model="user.forename" 
                  :state="errors.has('forename') ? false : null"
                  v-validate="'required|max:128'"
                  data-vv-name="forename"
                  data-vv-as="nombres"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="surname">Apellido(s) * :</label>
              </strong>
              <b-form-group label-for="surname" :invalid-feedback="errors.first('surname')" :state="!errors.has('surname')">
                <b-form-input 
                  v-model="user.surname" 
                  :state="errors.has('surname') ? false : null"
                  v-validate="'required|max:128'"
                  data-vv-name="surname"
                  data-vv-as="apellidos"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
          </div>
          <div class="row my-2">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <router-link class="password" to="password">Cambiar Contraseña</router-link>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <b-button 
                type="submit" 
                class="float-right" 
              >Actualizar</b-button>
            </div>
          </div>
        </b-form>
      </div>
    </a-spin>
  </fieldset>
</template>

<script>
  import { mapGetters } from 'vuex'
  import UserService from '../../services/user.service'
  import User from '../../models/User'
  export default {
    data() {
      return {
        user: new User(),
        success: false,
      }
    },

    computed: {
      ...mapGetters([
        'currentUser'
      ])
    },

    mounted(){
      this.user.id = this.currentUser.id
      this.user.name = this.currentUser.name
      this.user.forename = this.currentUser.forename
      this.user.surname = this.currentUser.surname
      this.user.email = this.currentUser.email
      this.user.phone = this.currentUser.phone
    }, 

    methods: {
      submit: async function() {
        this.$validator.errors.clear()
        this.success = true
        try {
          const response = await UserService.updateUser(this.currentUser.id, this.user)
          if (response.status === 200) {
            let data = {
              name: response.data.data.name,
              forename: response.data.data.forename,
              surname: response.data.data.surname,
              email: response.data.data.email,
              phone: response.data.data.phone,
            }
            this.$store.dispatch('updateUser', data)
            this.$message.success(response.data.message)
            this.success = false
          } 
        } catch (err) {
          if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
          this.success = false
        }
      }
    } 
  }
</script>
<style scoped>
  .password {
    color: #9e0207;
    text-decoration: underline;
    font-weight: bold;
    font-size: 1.1em;
  }

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