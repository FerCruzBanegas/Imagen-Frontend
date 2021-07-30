<template>
  <a-spin :spinning="success">
    <div class="card m-2">
      <div class="card-header text-center bg-light">
        <span class="font-weight-bold" style="font-size: 1.2em;">ÚLTIMO ALQUILER REALIZADO</span>
      </div>
      <div class="card-body">
        <dl v-if="rental">
          <dt>FECHA DE INICIO</dt>
          <dd>{{ rental.date_start | formatDate('DD/MM/YYYY') }}</dd>
          <dt>FECHA FIN</dt>
          <dd>{{ rental.date_end | formatDate('DD/MM/YYYY') }}</dd>
          <dt>CONDICIÓN</dt>
          <dd>
            <span v-html="templateCondition(rental.condition.title)"></span>
          </dd>
          <dt>CLIENTE</dt>
          <dd>
            <span class="label label-default font-size-14">{{ rental.customer.business_name }}</span>
          </dd>
          <dt>ESPACIO ALQUILADO</dt>
          <dd>{{ rental.billboard.code }}</dd>
          <dt>REALIZADO POR</dt>
          <dd>{{ rental.user }}</dd>
        </dl>
        <center>
          <router-link class="password" to="password">Más info.</router-link>
        </center>
        </div>
      <div class="card-footer text-muted text-center" v-if="rental">
        {{ rental.created | dateDiff('days') }} 
      </div>
    </div>
  </a-spin>
</template>
<script>
import moment from 'moment'
// import Rental from '../../models/Rental'
import RentalService from '../../services/rental.service'

export default {
  data() {
    return {
      moment,
      success: true,
      rental: null,
    }
  },

  created() {
    this.getLastRental()
    // this.$bus.$on('successRental', () => {
    //   this.getLastRental()
    // })
  },

  methods: {
    templateCondition(condition) {
      switch (condition) {
        case 'Activo':
          return (
            "<span class='badge badge-custom-6'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
          break;
        case 'Terminado':
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
          break;
        case 'Renovado':
          return (
            "<span class='badge badge-custom-5'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(condition) +
            "</span>"
          );
      }
    },

    getLastRental: async function() {
      const rental = await RentalService.getLastRental()
      if (rental.status === 200) {
        this.rental = rental.data.data
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
</style>