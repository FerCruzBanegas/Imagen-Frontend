<template>
  <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
    <legend>Cambiar Mi Contraseña:</legend>
    <a-spin :spinning="success">
      <div class="container">
        <div class="d-flex flex-row-reverse bd-highlight">
          <small><strong>Los campos con (*) son obligatorios.</strong></small>
        </div>
        <b-form @submit.stop.prevent="submit">
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="password_current">Contraseña Actual* :</label>
              </strong>
              <b-form-group label-for="password_current" :invalid-feedback="errors.first('password_current')" :state="!errors.has('password_current')">
                <b-input-group class="mb-3">
                  <b-form-input 
                    v-model="user.password_current" 
                    :state="errors.has('password_current') ? false : null"
                    v-validate="'required|min:5'"
                    data-vv-name="password_current"
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
          </div>
          <div class="row">
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="password">Nueva Contraseña * :</label>
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
                    :type="isPasswordVisible1 ? 'text' : 'password'"
                  ></b-form-input>
                  <b-input-group-append>
                    <b-button @click="isPasswordVisible1 = !isPasswordVisible1" size="sm" variant="outline-dark">
                      <i v-if="isPasswordVisible1" class="fa fa-eye" aria-hidden="true"></i>
                      <i v-else class="fa fa-eye-slash" aria-hidden="true"></i>
                    </b-button>
                  </b-input-group-append>
                </b-input-group>
              </b-form-group>
            </div>
          </div>
          <div class="row">
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
            <div class="mr-md-4 mr-auto">
              <b-button variant="danger" to="perfil">Cancelar</b-button>
            </div>
            <div class="d-sm-block ml-auto">
              <b-button 
                type="submit" 
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
import User from '../../models/User'
import UserService from '../../services/user.service'

export default {
  data() {
    return {
      success: false,
      user: new User(),
      isPasswordVisible: false,
      isPasswordVisible1: false,
      isPasswordVisible2: false,
    };
  },

  computed: {
    ...mapGetters([
      'currentUser'
    ])
  },

  methods: {
    submit: async function() {
      this.$validator.errors.clear()
      this.success = true
      try {
        const response = await UserService.changePassword(this.currentUser.id, this.user)
        if (response.status === 200) {
          this.$message.success(response.data.message, 'Felicidades')
          this.success = false
          this.$router.push('perfil')
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
