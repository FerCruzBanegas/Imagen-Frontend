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
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="name">Nombre * :</label>
              </strong>
              <b-form-group label-for="name" :invalid-feedback="errors.first('name')" :state="!errors.has('name')">
                <b-form-input 
                  v-model="employee.name" 
                  :state="errors.has('name') ? false : null"
                  v-validate="'required|max:64'"
                  data-vv-name="name"
                  data-vv-as="nombre"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="document">Tipo de Documento * :</label>
              </strong>
              <b-form-group label-for="document" :invalid-feedback="errors.first('document')" :state="!errors.has('document')">
                <v-select 
                  v-model="employee.document"
                  :reduce="type => type.label"
                  :state="errors.has('document') ? false : null"
                  v-validate="'required'"
                  data-vv-name="document"
                  data-vv-as="tipo"
                  :options="types"
                >
                  <template slot="option" slot-scope="option">
                    <div class="d-center">
                      {{ option.label }} / ({{ option.description }})
                    </div>
                  </template>
                </v-select>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-4 col-xl-4">
              <strong>
                <label for="num_document">Número de Documento * :</label>
              </strong>
              <b-form-group label-for="num_document" :invalid-feedback="errors.first('num_document')" :state="!errors.has('num_document')">
                <b-form-input 
                  v-model="employee.num_document" 
                  :state="errors.has('num_document') ? false : null"
                  v-validate="'required|max:16'"
                  data-vv-name="num_document"
                  data-vv-as="documento"
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
                  v-model="employee.phone" 
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
                <label for="address">Dirección  :</label>
              </strong>
              <b-form-group label-for="address" :invalid-feedback="errors.first('address')" :state="!errors.has('address')">
                <b-form-input 
                  v-model="employee.address" 
                  :state="errors.has('address') ? false : null"
                  v-validate="'max:64'"
                  data-vv-name="address"
                  data-vv-as="dirección"
                  type="text"
                ></b-form-input>
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
                  v-model="employee.email" 
                  :state="errors.has('email') ? false : null"
                  v-validate="'max:64|email'"
                  data-vv-name="email"
                  data-vv-as="correo electrónico"
                  type="text"
                ></b-form-input>
              </b-form-group>
            </div>
            <div class="col-12 col-md-12 col-lg-6 col-xl-6">
              <strong>
                <label for="office_id">Oficina * :</label>
              </strong>
              <b-form-group label-for="office_id" :invalid-feedback="errors.first('office_id')" :state="!errors.has('office_id')">
                <v-select
                  label="description"
                  v-model="employee.office_id" 
                  :options="offices"
                  :reduce="office => office.id"
                  :state="errors.has('office_id') ? false : null"
                  v-validate="'required'"
                  data-vv-name="office_id"
                  data-vv-as="oficina"
                ></v-select>
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
import Employee from '../../models/Employee'
import OfficeService from '../../services/office.service'
import EmployeeService from '../../services/employee.service'

export default {
  data() {
    return {
      success: true,
      retry: false,
      id: this.$route.params.id,
      employee: new Employee(),
      offices: [],
      types: [{label:'CI', description: 'Carnet Identidad'}, {label:'LC', description: 'Licencia Conducir'}, {label:'LM', description: 'Libreta Militar'}],
    };
  },

  created() {
    this.listOffices()
    if (this.id) {
      this.showEmployee()
    }
  },

  methods: {
    showEmployee:async function() {
      const response = await EmployeeService.showEmployee(`employees/${this.id}/edit`)
      if (response.status === 200) {
        let obj =  {
          id: response.data.data.id,
          name: response.data.data.name,
          document: response.data.data.document,
          num_document: response.data.data.num_document,
          address: response.data.data.address,
          phone: response.data.data.phone,
          email: response.data.data.email,
          office_id: response.data.data.office.id
        }
        this.employee = obj
        this.success = false
      }
    },

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        if(this.id) {
          this._save = await EmployeeService.updateEmployee(this.id, this.employee)
        } else {
          this._save = await EmployeeService.storeEmployee(this.employee)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.success = false
          this.$emit("success", this._save.data.data)
          this.$message.success(this._save.data.message)
          if (this.retry && !this.id) {
            this.employee = new Employee()
          } else {
            this.$router.push({ name: 'ListEmployees'})
          }
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },

    listOffices: async function() {
      const offices = await OfficeService.listOffices()
      if (offices.status === 200) {
        this.offices = offices.data
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
