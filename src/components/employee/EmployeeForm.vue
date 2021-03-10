<template>
  <a-spin :spinning="success">
    <div class="container">
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
                data-vv-as="teléfono"
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
                v-model="employee.phone" 
                :state="errors.has('phone') ? false : null"
                v-validate="'required|max:32'"
                data-vv-name="phone"
                data-vv-as="teléfono"
                type="text"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-md-12 col-lg-4 col-xl-4">
            <strong>
              <label for="office_id">Oficina * :</label>
            </strong>
            <b-form-group label-for="office_id" :invalid-feedback="errors.first('office_id')" :state="!errors.has('office_id')">
              <v-select
                v-model="employee.office_id" 
                :options="offices"
                :reduce="office => office.id"
                label="description"
                :state="errors.has('office_id') ? false : null"
                v-validate="'required'"
                data-vv-name="office_id"
                data-vv-as="ciudad"
              ></v-select>
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
import Employee from '../../models/Employee'
import OfficeService from '../../services/office.service'
import EmployeeService from '../../services/employee.service'

export default {
  props: {
    onSuccess: false
  },

  data() {
    return {
      success: false,
      employee: new Employee(),
      offices: [],
    };
  },

  created() {
    this.listOffices()
  },

  methods: {
    submit: async function() {
      this.success = true
      this.$validator.errors.clear()
      try {
        const request  = await EmployeeService.storeEmployee(this.employee)
        if (request.status === 201 || request === 200) {
          this.success = false
          this.$emit("success")
          this.$message.success(request.data.message)
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },
    
    listOffices: async function() {
      this.success = true
      const offices = await OfficeService.listOffices()
      if (offices.status === 200) {
        this.offices = offices.data
        this.success = false
      }
    }
  }
}
</script>