<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.searchContainer">
      <i class="fe fe-search" :class="$style.searchIcon"></i>
      <input @focus ="$event.target.select()" v-model="search" v-on:keyup="getQuotes" :class="$style.searchInput" type="text" placeholder="Buscar cotización.." />
      <b-spinner v-show="loader" :class="$style.loaderIcon" small variant="danger"></b-spinner>
      <!-- <a-spin :class="$style.loaderIcon"/> -->
    </div>
    <div v-show="quotations.length > 0" slot="overlay" class="card air__utils__shadow width-300">
      <div class="card-body p-1 height-300">
        <vue-custom-scrollbar :style="{ height: '100%' }">
          <div class="pt-4 px-2 pb-2">
            <Search :quotations="quotations" />
          </div>
        </vue-custom-scrollbar>
      </div>
    </div>
  </a-dropdown>
</template>

<script>
import _ from 'lodash'
import QuotationService from '../../../../services/quotation.service'
import vueCustomScrollbar from 'vue-custom-scrollbar'
import Search from '@/components/widgets/Lists/Search'

export default {
  components: {
    Search,
    vueCustomScrollbar,
  },

  data () {
    return {
      search: '',
      loader: false,
      quotations: [],
    }
  },

  methods: {
    getQuotes: _.debounce(async function () {
      this.loader = true
      const data = {
        column: 'cite',
        value: this.search
      }
      try {
        const response = await QuotationService.searchQuotation(data)
        if (response.status === 200) {
          this.quotations = response.data
          this.loader = false
        }
      } catch (err) {
        console.log(err)
      }
    }, 350)
  }
}
</script>

<style lang="scss" module>
@import "./style.module.scss";
</style>
