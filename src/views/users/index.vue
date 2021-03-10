<template>
  <div>
    <b-card no-body header-bg-variant="light">
      <template v-slot:header>
        <div>
          <span class="text-dark font-size-24 font-weight-bold">
            LISTA DE USUARIOS
          </span>
          <router-link v-if="permission('users.create')" :to="{path: '/configuracion/usuarios/nuevo'}">
            <button
              type="button"
              class="btn btn-danger btn-with-addon mr-auto text-nowrap pull-right"
            >
              <span class="btn-addon">
                <i class="btn-addon-icon fe fe-plus-circle" />
              </span>
              Nuevo Usuario
            </button>
          </router-link>
        </div>   
      </template>
      <b-tabs card active-nav-item-class="font-weight-bold text-uppercase text-black">
        <b-tab title="General" :title-link-class="'text-black'" lazy>
          <a-skeleton active :loading="tabGeneral"/>
          <grid-general v-show="!tabGeneral" v-on:general='general'></grid-general>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import permission from '../../mixins/permission'
  import GridGeneral from '../../components/user/GridGeneral'

  export default {
    components: {
      'grid-general': GridGeneral,
    },

    mixins: [permission],

    data() {
      return {
        tabGeneral: true,
      }
    },

    methods: {
      general(e) {
        this.tabGeneral = e
      }
    }
  }
</script>