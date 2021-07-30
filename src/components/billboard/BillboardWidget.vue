<template>
  <div class="card m-2">
    <div class="card-header text-center bg-light">
      <span class="font-weight-bold" style="font-size: 1.2em;">ÚLTIMO ESPACIO REGISTRADO</span>
    </div>
    <a-spin :spinning="success">
      <div v-if="billboard">
        <div class="card-body">
          <dl v-if="billboard">
            <dt>CÓDIGO</dt>
            <dd>{{ billboard.code }}</dd>
            <dt>ZONA</dt>
            <dd>{{ billboard.zone }}</dd>
            <dt>UBICACIÓN</dt>
            <dd>
              <span class="label label-default font-size-14">{{ billboard.location }}</span>
            </dd>
            <dt>ESTADO</dt>
            <dd>
              <span v-html="templateState(billboard.state.title)"></span>
            </dd>
            <dt>CIUDAD</dt>
            <dd>{{ billboard.city.name }}</dd>
            <dt>TIPO</dt>
            <dd>{{ billboard.billboard_type.description }}</dd>
          </dl>
          <center>
            <router-link class="custom-link" :to="{ path: `/servicios/vallas/${billboard.id}` }">Más info.</router-link>
          </center>
        </div>
        <div class="card-footer text-muted text-center">
          {{ billboard.created | dateDiff('days') }} 
        </div>
      </div>
      <div v-if="empty">
        <div class="text-center">
          <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i>
          <h6>No existen resultados</h6>
        </div>
      </div>
    </a-spin>
  </div>
</template>
<script>
import moment from 'moment'
import BillboardService from '../../services/billboard.service'

export default {
  data() {
    return {
      moment,
      success: true,
      empty: false,
      billboard: null,
    }
  },

  created() {
    this.getLastBillboard()
  },

  methods: {
    templateState(state) {
      switch (state) {
        case 'Disponible':
          return (
            "<span class='badge badge-custom-6'>" +
            kendo.htmlEncode(state) +
            "</span>"
          );
          break;
        case 'No Disponible':
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(state) +
            "</span>"
          );
          break;
        case 'Ocupado':
          return (
            "<span class='badge badge-custom-5'>" +
            kendo.htmlEncode(state) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(state) +
            "</span>"
          );
      }
    },

    getLastBillboard: async function() {
      const billboard = await BillboardService.getLastBillboard()
      if (billboard.status === 200) {
        this.billboard = billboard.data.data
        this.success = false
      }

      if (billboard.status === 204) {
        this.empty = true
        this.success = false
      }
    }
  }
}
</script>
<style scoped>
  .custom-link {
    color: #9e0207;
    text-decoration: underline;
    font-weight: bold;
    font-size: 1.1em;
  }
</style>