<template>
  <div :class="$style.subbar">
    <ul :class="$style.breadcrumb" class="breadcrumb my-2">
      <li :class="{active: index+1 == breadcrumbs.length}" v-for="(breadcrumb, index) in breadcrumbs" :key="index">

        <router-link :class="$style.breadtext" v-if="index+1 < breadcrumbs.length" :to="breadcrumb.path">{{ breadcrumb.breadcrumb }}</router-link>
        <span :class="$style.breadtext" v-else>{{ breadcrumb.breadcrumb }}</span>
        <span v-if="index+1 < breadcrumbs.length" class="mx-2">/</span>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  data() {
    return {
      breadcrumbs: []
    }
  },

  watch: {
    '$route'() {
      this.getBreadcrumbs()
    },
  },

  mounted() {
    this.getBreadcrumbs()
  },

  methods: {
    test() {
      this.$router.go(-1)
    },

    getBreadcrumbs() {
      let breadcrumbs = this.$route.matched.map(item => {
        let obj = {
          path: item.path,
          breadcrumb: item.meta.breadcrumb,
        }
        return obj
      }) 
      breadcrumbs.unshift({path: '/inicio', breadcrumb: 'Inicio'})
      breadcrumbs = breadcrumbs.filter(item => item.breadcrumb)
      const uniq = new Set(breadcrumbs.map(e => JSON.stringify(e)))
      this.breadcrumbs = Array.from(uniq).map(e => JSON.parse(e))
    }
  }
}
</script>
<style lang="scss" module>
@import "./style.module.scss";
</style>