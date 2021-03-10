<template>
  <div class="row">
    <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">    
      <div class="card border border-purple-2">
        <div class="pt-3" :class="[$style.container, $style.container__pending]">
          <div class="bg-purple-2" :class="$style.status"></div>
          <div class="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
            <div class="mr-auto">
              <div v-for="(item, index) in cities.pending" :key="index" class="font-weight-bold text-dark">
                {{item.name }}: {{ item.total }}
              </div>
            </div>
            <div class="ml-1 text-purple-2">
              <i class="fa fa-clock-o font-size-40"></i>
            </div>
          </div>
          <div :class="$style.title" class="text-white font-size-18 font-weight-bold text-center">PENDIENTES</div>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">    
      <div class="card border border-primary">
        <div class="pt-3" :class="[$style.container, $style.container__approved]">
          <div class="bg-primary" :class="$style.status"></div>
          <div class="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
            <div class="mr-auto">
              <div v-for="(item, index) in cities.approved" :key="index" class="font-weight-bold text-dark">
                {{item.name }}: {{ item.total }}
              </div>
            </div>
            <div class="ml-1 text-primary">
              <i class="fa fa-arrow-circle-up font-size-40"></i>
            </div>
          </div>
          <div :class="$style.title" class="text-white font-size-18 font-weight-bold text-center">APROBADAS</div>
        </div>
      </div>
    </div>
    <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">    
      <div class="card border border-dark">
        <div class="pt-3" :class="[$style.container, $style.container__executed]">
          <div class="bg-secondary" :class="$style.status"></div>
          <div class="d-flex flex-nowrap align-items-center pb-3 pl-4 pr-4">
            <div class="mr-auto">
              <div v-for="(item, index) in cities.executed" :key="index" class="font-weight-bold text-dark">
                {{item.name }}: {{ item.total }}
              </div>
            </div>
            <div class="ml-1 text-secondary">
              <i class="fa fa-check-circle font-size-40"></i>
            </div>
          </div>
          <div :class="$style.title" class="text-white font-size-18 font-weight-bold text-center">EJECUTADAS</div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
export default {
  props: {
    cities: Object
  },

  name: 'ListPanel',
}
</script>
<style lang="scss" module>
  @import './style.module.scss';
</style>
