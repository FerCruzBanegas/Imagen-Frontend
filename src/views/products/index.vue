<template>
  <div>
    <b-card no-body header-bg-variant="light">
      <template v-slot:header>
        <div>
          <span class="text-dark font-size-24 font-weight-bold">
            LISTA DE PRODUCTOS
          </span>
          <router-link v-if="permission('products.create')" :to="{path: '/servicios/productos/nuevo'}">
            <button
              type="button"
              class="btn btn-danger btn-with-addon mr-auto text-nowrap pull-right"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fe fe-plus-circle" />
              </span>
              Nuevo Producto
            </button>
          </router-link>
        </div>   
      </template>
      <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase text-black">
        <b-tab title="General" :title-link-class="linkClass(0)" lazy>
          <a-skeleton active :loading="tabGeneral"/>
          <grid-general v-show="!tabGeneral" v-on:general='general'></grid-general>
        </b-tab>
        <b-tab title="Materiales" :title-link-class="linkClass(1)" lazy>
          <a-skeleton active :loading="tabMateriales"/>
          <grid-material v-show="!tabMateriales" v-on:material='material'></grid-material>
        </b-tab>
        <b-tab title="Máquinas" :title-link-class="linkClass(2)" lazy>
          <a-skeleton active :loading="tabMaquinas"/>
          <grid-machine v-show="!tabMaquinas" v-on:machine='machine'></grid-machine>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import permission from '../../mixins/permission'
  import GridGeneral from '../../components/product/GridGeneral'
  import GridMaterial from '../../components/material/GridMaterial'
  import GridMachine from '../../components/machine/GridMachine'

  export default {
    components: {
      'grid-general': GridGeneral,
      'grid-material': GridMaterial,
      'grid-machine': GridMachine,
    },

    mixins: [permission],

    data() {
      return {
        tabGeneral: true,
        tabMateriales: true,
        tabMaquinas: true,
        tabIndex: 0
      }
    },

    watch: {
      tabIndex(val) {
        if (val != 0 || val != 1 || val != 2) {
          this.tabGeneral = true
          this.tabMateriales = true
          this.tabMaquinas = true
        }
      }
    },

    methods: {
      general(e) {
        this.tabGeneral = e
      },

      material(e) {
        this.tabMateriales = e
      },

      machine(e) {
        this.tabMaquinas = e
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