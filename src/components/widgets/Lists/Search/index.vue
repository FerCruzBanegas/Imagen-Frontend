<template>
  <div>
    <ul class="list-unstyled">
      <li :class="$style.item" v-for="quotation in quotations">
        <router-link :to="{name: 'ShowQuotation', params: { id: quotation.id }}" :class="$style.itemLink">
          <div v-if="quotation.state_id === 1" :class="$style.itemMeta" class="font-weight-bold text-purple-2">
            <i class="fa fa-clock-o fa-lg"></i> 
          </div>
          <div v-else-if="quotation.state_id === 2" :class="$style.itemMeta" class="font-weight-bold text-blue">
            <i class="fa fa-arrow-circle-up fa-lg"></i> 
          </div>
          <div v-else="" :class="$style.itemMeta" class="font-weight-bold text-secondary">
            <i class="fa fa-check-circle fa-lg"></i>
          </div>
          <div class="mr-3">
            <div class="font-weight-bold">{{ quotation.cite }}</div>
            <div class="text-muted">Generado el: {{ quotation.date | formatDate('DD/MM/YYYY') }}</div>
          </div>
          <div :class="$style.itemAction">
            <span/>
            <span/>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  props: {
    quotations: {
      type: Array
    },
  },
}
</script>
<style lang="scss" module>
  @import './style.module.scss';
</style>
