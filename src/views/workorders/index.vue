<template>
  <div>
    <b-card no-body header-bg-variant="light">
      <template v-slot:header>
        <div>
          <span class="text-dark font-size-24 font-weight-bold">
            LISTA DE ORDENES DE TRABAJO
          </span>
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
import GridGeneral from '../../components/workorder/GridGeneral'

export default {
  components: {
    'grid-general': GridGeneral,
  },

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