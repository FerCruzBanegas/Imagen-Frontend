<template>
  <div>
    <b-card no-body header-bg-variant="light">
      <template v-slot:header>
        <div>
          <span class="text-dark font-size-24 font-weight-bold">
            LISTA DE COTIZACIONES
          </span>
          <router-link v-if="permission('quotations.create')" :to="{path: '/servicios/cotizaciones/nuevo'}">
            <button
              type="button"
              class="btn btn-danger btn-with-addon mr-auto text-nowrap pull-right"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fe fe-plus-circle" />
              </span>
              Nueva Cotización
            </button>
          </router-link>
        </div>   
      </template>
      <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase text-black">
        <b-tab v-if="permission('quotations.index')" :title-link-class="linkClass(0)" lazy>
          <template #title>
            <i class="fa fa-calculator font-size-20"></i> General
          </template>
          <a-skeleton active :loading="tabGeneral"/>
          <grid-general v-show="!tabGeneral" v-on:general='general'></grid-general>
        </b-tab>
        <b-tab v-if="permission('quotations.pending|quotations.index')" :title-link-class="linkClass(1)" lazy>
          <template #title>
            <i class="fa fa-clock-o font-size-20"></i> Pendientes
          </template>
          <a-skeleton active :loading="tabPendiente"/>
          <grid-pendiente v-show="!tabPendiente" v-on:pendiente='pendiente'></grid-pendiente>
        </b-tab>
        <b-tab v-if="permission('quotations.approved|quotations.index')" :title-link-class="linkClass(2)" lazy>
          <template #title>
            <i class="fa fa-calendar-plus-o font-size-20"></i> Aprobados
          </template>
          <a-skeleton active :loading="tabAprobado"/>
          <grid-aprobado v-show="!tabAprobado" v-on:aprobado='aprobado'></grid-aprobado>
        </b-tab>
        <b-tab v-if="permission('quotations.executed|quotations.index')" :title-link-class="linkClass(3)" lazy>
          <template #title>
            <i class="fa fa-calendar-check-o font-size-20"></i> Ejecutados
          </template>
          <a-skeleton active :loading="tabEjecutado"/>
          <grid-ejecutado v-show="!tabEjecutado" v-on:ejecutado='ejecutado'></grid-ejecutado>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import permission from '../../mixins/permission'
  import GridGeneral from '../../components/quotation/GridGeneral'
  import GridPendiente from '../../components/quotation/GridPendiente'
  import GridAprobado from '../../components/quotation/GridAprobado'
  import GridEjecutado from '../../components/quotation/GridEjecutado'

  export default {
    components: {
      'grid-general': GridGeneral,
      'grid-pendiente': GridPendiente,
      'grid-aprobado': GridAprobado,
      'grid-ejecutado': GridEjecutado
    },

    mixins: [permission],

    data() {
      return {
        tabGeneral: true,
        tabPendiente: true,
        tabAprobado: true,
        tabEjecutado: true,
        tabIndex: 0
      }
    },

    watch: {
      tabIndex(val) {
        if (val != 0 || val != 1 || val != 2 || val != 3) {
          this.tabGeneral = true
          this.tabPendiente = true
          this.tabAprobado = true
          this.tabEjecutado = true
        }
      }
    },

    methods: {
      general(e) {
        this.tabGeneral = e
      },

      pendiente(e) {
        this.tabPendiente = e
      },

      aprobado(e) {
        this.tabAprobado = e
      },

      ejecutado(e) {
        this.tabEjecutado = e
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