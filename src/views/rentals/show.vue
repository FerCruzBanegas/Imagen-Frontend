<template>
  <div class="container" v-if="success">
  	<div class="d-flex flex-wrap">
      <div class="mr-auto">
        <h2 class="font-weight-bold">DETALLE DEL ALQUILER</h2>
      </div>
      <div>
        <b-button size="sm" variant="dark">
          <i class="fa fa-download"></i> 
          <!-- <b-spinner v-else small label="Small Spinner" type="grow"></b-spinner> -->
          DESCARGAR
        </b-button>
      </div>
    </div>
    <hr />
  	<b-card no-body header-bg-variant="light">
  	  <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase text-black">
        <b-tab :title-link-class="linkClass(0)" lazy>
          <template #title>
            <i class="fa fa-list font-size-20"></i> General
          </template>
          <div class="container">
            <div class="row bg-secondary">
              <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                <div class="d-flex justify-content-between my-2">
                	<span class="text-white font-weight-bold">Registrado:</span>
                  <span class="text-white font-weight-bold">{{ rental.created | formatDate('DD/MM/YYYY') }}</span>
                </div>
              </div>
              <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                <div class="d-flex justify-content-between my-2">
                	<span class="text-white font-weight-bold">Actualizado:</span>
                  <span class="text-white font-weight-bold">{{ rental.updated | formatDate('DD/MM/YYYY') }}</span>
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">N° DE ALQUILER: &nbsp; &nbsp;</span>{{ rental.id }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">FECHA DE INICIO: &nbsp; &nbsp;</span> 
                  <span class="text-primary">
                    {{ rental.date_start | formatDate('DD/MM/YYYY') }}
                  </span>
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">FECHA FIN DEL ALQUILER: &nbsp; &nbsp; </span>
                  <span class="text-danger">
                    {{ rental.date_end | formatDate('DD/MM/YYYY') }}
                  </span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">CLIENTE: &nbsp; &nbsp;</span> {{ rental.customer.business_name }}
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">ESPACIO ALQUILADO: &nbsp; &nbsp;</span> 
                  <span class="badge badge-secondary">{{ rental.billboard.code }}</span> &nbsp; &nbsp; 
                  <span style="color: #000;">UBICACIÓN: &nbsp; &nbsp;</span> {{ rental.billboard.location }} &nbsp; &nbsp; 
                  <span style="color: #000;">CIUDAD: &nbsp; &nbsp;</span>{{ rental.billboard.city.name }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">ILUMINACIÓN: &nbsp; &nbsp;</span> {{ rental.illumination }} &nbsp; &nbsp; 
                  <span style="color: #000;">IMPRESIÓN: &nbsp; &nbsp;</span> {{ rental.print }}
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">CONDICIÓN DEL ALQUILER: &nbsp; &nbsp;</span>
                  <span v-html="templateCondition(rental.condition.title)"></span>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">IMPORTE MENSUAL: &nbsp; &nbsp;</span>{{ rental.amount_monthly | currency }} &nbsp; &nbsp;
                  <span style="color: #000;">IMPORTE TOTAL: &nbsp; &nbsp;</span>{{ rental.amount_total | currency }} &nbsp; &nbsp;
                  <span style="color: #000;">TOTAL MONTO: &nbsp; &nbsp;</span>{{ rental.amount_total | currency }}
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">OBSERVACIÓN: &nbsp; &nbsp;</span> {{ rental.observation }}
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="font-weight-bold">
                  <span style="color: #000;">USUARIO ENCARGADO: &nbsp; &nbsp;</span>{{ rental.user }}
                </div>
              </div>
            </div>
            <div class="row bg-light">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                <div class="d-flex flex-row-reverse">
        				  <div class="p-2">
        				  	<b-button title="Eliminar Alquiler" variant="danger">
    		              <i class="fa fa-trash-o" aria-hidden="true"></i>
    		            </b-button>
        				  </div>
        				  <div class="p-2">
                    <router-link :to="{ path: `/servicios/alquileres/${rental.id}/edit` }">
                      <b-button title="Editar Alquiler" variant="info">
                        <i class="fa fa-pencil" aria-hidden="true"></i>
                      </b-button>
                    </router-link>
        				  </div>
        				  <div class="p-2">
        				  	<b-button title="Renovar Alquiler" variant="secondary">
    		              <i class="fa fa-calendar-check-o" aria-hidden="true"></i>
    		            </b-button>
        				  </div>
        				</div>
              </div>
            </div>
          </div>
        </b-tab>
        <b-tab :title-link-class="linkClass(1)" lazy>
          <template #title>
            <i class="fa fa-calendar-plus-o font-size-20"></i> Renovaciones 
            <b-badge variant="danger" v-if="rental.renewal_count > 0">{{ rental.renewal_count }}</b-badge>
          </template>
          <renovations :rental="id" v-on:renovacion='renovacion'></renovations>
        </b-tab>
        <b-tab :title-link-class="linkClass(2)" lazy>
          <template #title>
            <i class="fa fa-print font-size-20"></i> Impresiones
          </template>
        </b-tab>
      </b-tabs>
  	</b-card>
  </div>
</template>
<script>
import RentalService from '../../services/rental.service'
import Renovations from '../../components/rental/Renovations'

export default {
  data() {
    return {
    	id: this.$route.params.id,
      success: false,
      rental: null,
      tabGeneral: true,
      tabRenovacion: true,
      tabImpresion: true,
      tabIndex: 0,
      columns: [
        { key: 'date_start', label: 'Fecha Inicio'},
        { key: 'date_end', label: 'Fecha Fin'},
        { key: 'amount_monthly', label: 'Importe Mensual'},
        { key: 'amount_total', label: 'Importe Total'},
        { key: 'condition', label: 'Condición'},
        'opciones',
      ],
      items: [],
    }
  },

  components: {
    "renovations": Renovations,
  },

  watch: {
    tabIndex(val) {
      if (val != 0 || val != 1 || val != 2) {
        this.tabGeneral = true
        this.tabRenovacion = true
        this.tabImpresion = true
      }
    }
  },

  created() {
    this.showRental()
  },

  methods: {
    showRental: async function() {
      const response = await RentalService.showRental(`rentals/${this.id}/detail`)
      if (response.status === 200) {
        this.rental = response.data.data
        // this.items = this.rental.renewal.rentals
        this.success = true
      }
    },

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

    general(e) {
      this.tabGeneral = e
    },

    renovacion(e) {
      this.tabRenovacion = e
    },

    impresion(e) {
      this.tabImpresion = e
    },

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['text-black']
      } else {
        return ['text-danger font-weight-bold']
      }
    }
  }
}
</script>