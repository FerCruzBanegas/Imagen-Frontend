<template>
  <a-spin :spinning="success">
    <div class="container">
      <b-form @submit.stop.prevent="submit">
        <div class="row">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="rental.date_start">Fecha Inicio * :</label>
            </strong>
            <b-form-group label-for="rental.date_start" :invalid-feedback="errors.first('rental.date_start')" :state="!errors.has('rental.date_start')">
              <b-form-input 
                v-model="rental.date_start" 
                :state="errors.has('rental.date_start') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.date_start"
                data-vv-as="fecha inicio"
                type="date"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="rental.date_end">Fecha Fin * :</label>
            </strong>
            <b-form-group label-for="rental.date_end" :invalid-feedback="errors.first('rental.date_end')" :state="!errors.has('rental.date_end')">
              <b-form-input 
                v-model="rental.date_end" 
                :state="errors.has('rental.date_end') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.date_end"
                data-vv-as="fecha fin"
                type="date"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="rental.customer_id">Cliente * :</label>
            </strong>
            <b-form-group label-for="rental.customer_id" :invalid-feedback="errors.first('rental.customer_id')" :state="!errors.has('rental.customer_id')">
              <v-select
                v-model="rental.customer_id" 
                :options="customers"
                :reduce="customer => customer.id"
                label="business_name"
                :state="errors.has('rental.customer_id') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.customer_id"
                data-vv-as="cliente"
              ></v-select>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="rental.billboard_id">Espacio * :</label>
            </strong>
            <b-form-group label-for="rental.billboard_id" :invalid-feedback="errors.first('rental.billboard_id')" :state="!errors.has('rental.billboard_id')">
              <v-select
                v-model="rental.billboard_id" 
                :options="billboards"
                :reduce="billboard => billboard.id"
                label="code"
                :state="errors.has('rental.billboard_id') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.billboard_id"
                data-vv-as="espacio"
              ></v-select>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="rental.print">Incluye Impresión? * :</label>
            </strong>
            <b-form-group label-for="rental.print" :invalid-feedback="errors.first('rental.print')" :state="!errors.has('rental.print')">
              <b-form-radio-group
                :disabled="rental.billboard_id == null"
                v-model="rental.print"
                :options="prints"
                button-variant="outline-danger"
                size="sm"
                name="radio-btn-outline"
                buttons
                :state="errors.has('rental.print') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.print"
                data-vv-as="impresión"
              ></b-form-radio-group>
            </b-form-group>
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <strong>
              <label for="illumination">Incluye Iluminación? * :</label>
            </strong>
            <b-form-group label-for="rental.illumination" :invalid-feedback="errors.first('rental.illumination')" :state="!errors.has('rental.illumination')">
              <b-form-radio-group
                v-model="rental.illumination"
                :options="illuminations"
                button-variant="outline-danger"
                size="sm"
                name="radio-btn-outline"
                buttons
                :state="errors.has('rental.illumination') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.illumination"
                data-vv-as="iluminación"
              ></b-form-radio-group>
            </b-form-group>
          </div>
        </div>
        <div class="row" v-if="rental.print =='SI'">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <div class="custom-border p-2 mb-2">
              <strong>
                <label for="amount_monthly">Costo De la Impresión por (m²)</label>
              </strong>
              <b-form-group label-for="amount_monthly" :invalid-feedback="errors.first('amount_monthly')" :state="!errors.has('amount_monthly')">
                <b-input-group size="md" append="Bs.">
                  <b-form-input 
                    class="text-center" 
                    v-model.lazy="print_amount" 
                    v-money="money"
                    :state="errors.has('date_end') ? false : null"
                    v-validate="'required'"
                    data-vv-name="amount_monthly"
                    data-vv-as="importe mensual"
                  ></b-form-input>
                </b-input-group>
                <small class="font-weight-bold text-danger">El costo total de la impresión es de: {{ print_total_amount | currency }}</small>
                <div class="font-weight-bold text-secondary mt-2">
                  La impresión pertenece a una campaña?
                  <input type="radio" id="SI" class="k-radio ml-2" :value="true" v-model="is_campaign">
                  <label class="k-radio-label" for="SI">SI</label>
                  <input type="radio" id="NO" class="k-radio ml-2" :value="false" v-model="is_campaign">
                  <label class="k-radio-label" for="NO">NO</label>
                </div>
                <div class="container" v-if="is_campaign">
                  <div class="row mt-2">
                    <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                      <strong>
                        <label for="campaign.name">Nombre * :</label>
                      </strong>
                      <b-form-group label-for="campaign.name" :invalid-feedback="errors.first('campaign.name')" :state="!errors.has('campaign.name')">
                        <b-input-group size="md">
                          <b-form-input 
                            v-model="campaign.name" 
                            :state="errors.has('campaign.name') ? false : null"
                            v-validate="'required|min:3|max:128'"
                            data-vv-name="campaign.name"
                            data-vv-as="nombre"
                            type="text"
                          ></b-form-input>
                        </b-input-group>
                      </b-form-group>
                    </div>
                  </div>
                  <div class="row">
                    <div class="col-12 col-md-12 col-lg-12 col-xl-12">
                      <strong>
                        <label for="campaign.note">Nota :</label>
                      </strong>
                      <b-form-group label-for="campaign.note" :invalid-feedback="errors.first('campaign.note')" :state="!errors.has('campaign.note')">
                        <b-form-textarea 
                          v-model="campaign.note" 
                          :state="errors.has('campaign.note') ? false : null"
                          v-validate="'min:3|max:128'"
                          data-vv-name="campaign.note"
                          data-vv-as="nota"
                          rows="3"
                          max-rows="3"
                        ></b-form-textarea>
                      </b-form-group>
                    </div>
                  </div>
                </div>
              </b-form-group>
            </div>
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-6 col-lg-6 col-xl-6">
            <strong>
              <label for="rental.amount_monthly">Importe Mensual * :</label>
            </strong>
            <b-form-group label-for="rental.amount_monthly" :invalid-feedback="errors.first('rental.amount_monthly')" :state="!errors.has('rental.amount_monthly')">
              <b-form-input 
                class="text-center" 
                v-model.lazy="rental.amount_monthly" 
                v-money="money"
                :state="errors.has('rental.amount_monthly') ? false : null"
                v-validate="'required'"
                data-vv-name="rental.amount_monthly"
                data-vv-as="importe mensual"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-12 col-md-6 col-lg-6 col-xl-6">
            <strong>
              <label for="rental.amount_total">Importe Total * :</label>
              <b-button pill class="btn-close" @click="getTotalAmount" size="sm" variant="dark">
                <i class="fa fa-refresh"></i>
              </b-button>
            </strong>
            <b-form-group label-for="rental.amount_total" :invalid-feedback="errors.first('rental.amount_total')" :state="!errors.has('rental.amount_total')">
              <b-input-group size="md" append="Bs.">
                <b-form-input 
                  class="text-center"
                  v-model.lazy="rental.amount_total" 
                  v-money="money"
                  :state="errors.has('rental.amount_total') ? false : null"
                  v-validate="'required'"
                  data-vv-name="rental.amount_total"
                  data-vv-as="importe total"  
                ></b-form-input>
              </b-input-group>
            </b-form-group>          
          </div>
        </div>
        <div class="row">
          <div class="col-12 col-md-12 col-lg-12 col-xl-12">
            <strong>
              <label for="rental.observation">Observación :</label>
            </strong>
            <b-form-group label-for="rental.observation" :invalid-feedback="errors.first('rental.observation')" :state="!errors.has('rental.observation')">
              <b-form-textarea 
                v-model="rental.observation" 
                :state="errors.has('rental.observation') ? false : null"
                v-validate="'min:3|max:128'"
                data-vv-name="rental.observation"
                data-vv-as="observación"
                rows="3"
                max-rows="3"
              ></b-form-textarea>
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
import { mapGetters } from 'vuex'
import {VMoney} from 'v-money'
import moment from 'moment'
import formatter from '../../mixins/formatter'
import Rental from '../../models/Rental'
import Money from '../../models/Money'
import Campaign from '../../models/Campaign'
import RentalService from '../../services/rental.service'
import CustomerService from '../../services/customer.service'
import BillboardService from '../../services/billboard.service'


export default {
  data() {
    return {
      moment,
      success: true,
      id: this.$route.params.id,
      rental: new Rental(),
      money: new Money(),
      campaign: new Campaign(),
      dimension: null,
      print_amount: 0,
      print_total_amount: 0,
      customers: [],
      billboards: [],
      prints: [
        { text: 'SI', value: 'SI' },
        { text: 'NO', value: 'NO' },
      ],
      illuminations: [
        { text: 'SI', value: 'SI' },
        { text: 'NO', value: 'NO' },
      ],
      is_campaign: false,
    }
  },

  mixins: [formatter],
  
  computed: {
    ...mapGetters([
      'currentUser'
    ]),
  },

  watch: {
    'rental.date_start': function (value) {
      this.getTotalAmount()
    },

    'rental.date_end': function (value) {
      this.getTotalAmount()
    },

    'rental.print': function (value) {
      if (value === 'NO') {
        this.print_amount = 0
        this.is_campaign = false
        this.campaign = new Campaign()
      }
    },

    is_campaign: function (value) {
      if (!value) {
        this.campaign = new Campaign()
      }
    },

    'rental.billboard_id': function (value) {
      const item = this.billboards.find(item => item.id === value)
      let dimension = item.dimension.split(" x ")
      this.dimension = Number(dimension[0]) * Number(dimension[1])
      this.rental.amount_monthly = item.price
      this.setPrintTotalAmount(this.print_amount)
    },

    print_amount(value) {
      this.setPrintTotalAmount(value)
      this.getTotalAmount()
    },

    'rental.amount_monthly': function (value) {
      this.getTotalAmount()
    },
  },

  directives: {
    money: VMoney,
  },

  created() {
    Promise.all([this.listCustomers(), this.listBillboards()])
    .then(() =>{
      this.success = false
    })

    if (this.id) {
      this.showRental()
    }
  },

  methods: {
    showRental:async function() {
      const response = await RentalService.showRental(`rentals/${this.id}/edit`)
      if (response.status === 200) {
        // console.log(response.data)
        this.rental.date_start = response.data.data.date_start,
        this.rental.date_end = response.data.data.date_end,
        this.rental.observation = response.data.data.observation,
        this.rental.illumination = response.data.data.illumination,
        this.rental.print = response.data.data.print,
        this.rental.amount_monthly = response.data.data.amount_monthly,
        this.rental.amount_total = response.data.data.amount_total,
        this.rental.customer_id = response.data.data.customer_id,
        this.rental.billboard_id = response.data.data.billboard_id,
        this.rental.user_id = response.data.data.user_id,
        this.rental.rental_id = response.data.data.rental_id,
        this.rental.quotation_id = response.data.data.quotation_id

        // let dimension = response.data.data.dimension.split(' x ')
        // this.dim_a = parseFloat(dimension[0]).toFixed(2)
        // this.dim_b = parseFloat(dimension[1]).toFixed(2)
        // this.rental = obj
        // this.success = false
      }
    },

    setPrintTotalAmount(value) {
      this.print_total_amount = this.dimension * Number(this.toFloat(value)) 
    },

    getTotalAmount() {
      let months = 0
      let print_amount = 0
      let total = 0
      if (this.rental.date_start != '' && this.rental.date_end != '') {
        let start = moment(this.rental.date_start, "YYYY-MM-DD")
        let end = moment(this.rental.date_end, "YYYY-MM-DD")
        months = Math.round(parseFloat(end.diff(start, 'months', true)).toFixed(1))
      }

      if (Number(this.toFloat(this.print_amount)) > 0) {
        print_amount = Number(this.print_total_amount)
      }

      total = months * Number(this.toFloat(this.rental.amount_monthly)) + print_amount
      this.rental.amount_total = parseFloat(total).toLocaleString('en-US', { minimumFractionDigits: 2 })
    },

    submit: async function() {
      this.success = true
      this.$validator.errors.clear()

      let rental = Object.assign({}, this.rental)
      rental.amount_monthly = Number(this.toFloat(rental.amount_monthly))
      rental.amount_total = Number(this.toFloat(rental.amount_total))
      rental.user_id = this.currentUser.id

      let campaign = Object.assign({}, this.campaign)
      campaign['is_campaign'] = this.is_campaign

      let print = {
        meter_price: Number(this.toFloat(this.print_amount)),
        amount: this.print_total_amount
      }
      
      try {
        let data = {rental: rental, print: print, campaign: campaign}
        if(this.id) {
          this._save = await RentalService.updateRental(this.id, this.rental)
        } else {
          this._save = await RentalService.storeRental(data)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          // this.$bus.$emit('successRental')
          this.$router.push({ name: 'ShowRental', params: {id: this._save.data.data.id }})
          this.$message.success(this._save.data.message)
          this.success = false
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.success = false
      }
    },
    
    listCustomers: async function() {
      const customers = await CustomerService.listCustomers()
      if (customers.status === 200) {
        this.customers = customers.data
      }
    },

    listBillboards: async function() {
      this.success = true
      const billboards = await BillboardService.listBillboards()
      if (billboards.status === 200) {
        this.billboards = billboards.data
      }
    }
  }
}
</script>
<style scoped>
  .btn-close {
    font-size: .650rem;
    line-height: 1.5;
    border-radius: .2rem;
    float: right;
  }

  .custom-border {
    border: 2px solid #6c757d;
    border-radius: 0.25rem;
  }
</style>