<template>
  <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <legend>{{ addSubtitle }}:</legend>
    <a-spin :spinning="success">
      <div class="container">
        <div class="d-flex flex-row-reverse bd-highlight">
          <small><strong>Los campos con (*) son obligatorios.</strong></small>
        </div>
        <b-form @submit.stop.prevent="submit">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="name">Nombre de Usuario * :</label>
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
                <label for="email">Email * :</label>
              </strong>
              <b-form-group label-for="email" :invalid-feedback="errors.first('email')" :state="!errors.has('email')">
                <b-form-input 
                  v-model="user.email" 
                  :state="errors.has('email') ? false : null"
                  v-validate="'max:64|email'"
                  data-vv-name="email"
                  data-vv-as="email"
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
          <div class="row">
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="state">Estado * :</label>
              </strong>
              <b-form-group label-for="state" :invalid-feedback="errors.first('state')" :state="!errors.has('state')">
                <v-select 
                  v-model="user.state"
                  :reduce="state => state.value"
                  :state="errors.has('state') ? false : null"
                  v-validate="'required'"
                  data-vv-name="state"
                  data-vv-as="estado"
                  :options="states"
                >
                  <template slot="option" slot-scope="option">
                    <div class="d-center">
                      {{ option.label }}
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="profile_id">Perfil * :</label>
              </strong>
              <b-form-group label-for="profile_id" :invalid-feedback="errors.first('profile_id')" :state="!errors.has('profile_id')">
                <v-select
                  label="description"
                  v-model="user.profile_id" 
                  :options="profiles"
                  :reduce="profile => profile.id"
                  :state="errors.has('profile_id') ? false : null"
                  v-validate="'required'"
                  data-vv-name="profile_id"
                  data-vv-as="perfil"
                ></v-select>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="office_id">Oficina * :</label>
              </strong>
              <b-form-group label-for="office_id" :invalid-feedback="errors.first('office_id')" :state="!errors.has('office_id')">
                <v-select
                  label="description"
                  v-model="user.office_id" 
                  :options="offices"
                  :reduce="office => office.id"
                  :state="errors.has('office_id') ? false : null"
                  v-validate="'required'"
                  data-vv-name="office_id"
                  data-vv-as="perfil"
                ></v-select>
              </b-form-group>
            </div>
          </div>
          <div class="row" v-if="!id">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="password">Contraseña * :</label>
              </strong>
              <b-form-group label-for="password" :invalid-feedback="errors.first('password')" :state="!errors.has('password')">
                <b-input-group class="mb-3">
                  <b-form-input 
                    ref="password"
                    name="password"
                    v-model="user.password" 
                    :state="errors.has('password') ? false : null"
                    v-validate="'required|min:5'"
                    data-vv-name="password"
                    data-vv-as="contraseña"
                    :type="isPasswordVisible ? 'text' : 'password'"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button @click="isPasswordVisible = !isPasswordVisible" size="sm" variant="outline-dark">
                      <i v-if="isPasswordVisible" class="fa fa-eye" aria-hidden="true"></i>
                      <i v-else class="fa fa-eye-slash" aria-hidden="true"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="password_confirmation">Confirmación Contraseña * :</label>
              </strong>
              <b-form-group label-for="password_confirmation" :invalid-feedback="errors.first('password_confirmation')" :state="!errors.has('password_confirmation')">
                <b-input-group class="mb-3">
                  <b-form-input
                    target= "password" 
                    v-model="user.password_confirmation" 
                    :state="errors.has('password_confirmation') ? false : null"
                    v-validate="'required|min:5|confirmed:password'"
                    data-vv-name="password_confirmation"
                    data-vv-as="confirmación de la contraseña"
                    :type="isPasswordVisible2 ? 'text' : 'password'"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button @click="isPasswordVisible2 = !isPasswordVisible2" size="sm" variant="outline-dark">
                      <i v-if="isPasswordVisible2" class="fa fa-eye" aria-hidden="true"></i>
                      <i v-else class="fa fa-eye-slash" aria-hidden="true"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
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
import User from '../../models/User'
import ProfileService from '../../services/profile.service'
import OfficeService from '../../services/office.service'
import UserService from '../../services/user.service'

export default {
  data() {
    return {
      success: true,
      retry: false,
      id: this.$route.params.id,
      user: new User(),
      profiles: [],
      offices: [],
      states: [
        { label: 'Activo', value: 1},
        { label: 'Inactivo', value: 0}
      ],
      isPasswordVisible: false,
      isPasswordVisible2: false,
    };
  },

  computed: {
    addSubtitle () {
      if(this.id) {
        return 'Editar Usuario'
      }
      return 'Registrar Nuevo Usuario'
    }
  },

  created() {
    Promise.all([this.listProfiles(), this.listOffices()])
    .then(() =>{
      this.success = false
    })

    if (this.id) {
      this.showUser()
    }
  },

  methods: {
    showUser:async function() {
      const response = await UserService.showUser(`users/${this.id}/edit`)
      if (response.status === 200) {
        this.user = response.data.data
      }
    },

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        if(this.id) {
          this._save = await UserService.updateUser(this.id, this.user)
        } else {
          this._save = await UserService.storeUser(this.user)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.success = false
          // this.$emit("success", this._save.data.data)
          this.$message.success(this._save.data.message)
          if (this.retry && !this.id) {
            this.user = new User()
          } else {
            this.$router.push({ name: 'ListUsers'})
          }
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },

    listProfiles: async function() {
      const profiles = await ProfileService.listProfiles()
      if (profiles.status === 200) {
        this.profiles = profiles.data
      }
    },

    listOffices: async function() {
      const offices = await OfficeService.listOffices()
      if (offices.status === 200) {
        this.offices = offices.data
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
