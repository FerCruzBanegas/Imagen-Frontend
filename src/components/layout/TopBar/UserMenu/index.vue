<template>
  <a-dropdown :trigger="['click']" placement="bottomLeft">
    <div :class="$style.dropdown">
      <a-avatar shape="square" icon="user" size="large" :class="$style.avatar" />
    </div>
    <a-menu slot="overlay">
      <a-menu-item v-if="currentUser">
        <router-link :to="{path: '/configuracion/usuarios/perfil'}" class="item">
          <i :class="$style.menuIcon" class="fe fe-user"></i>
          {{ currentUser.name }}
        </router-link>
      </a-menu-item>
      <a-menu-item>
        <a href="javascript: void(0);" @click="logout" class="item">
          <i :class="$style.menuIcon" class="fe fe-log-out"></i>
          Cerrar Sesión
        </a>
      </a-menu-item>
    </a-menu>
  </a-dropdown>
</template>

<script>
  import { mapGetters } from 'vuex'

  export default {
    data() {
      return {
      }
    },

    computed: {
      ...mapGetters([
        'currentUser',
        'authenticated'
      ])
    },

    methods: {
      async logout() {
        const response = await this.$store.dispatch('logout')
        if (response) this.$router.push({ path: '/system/login' })
      },
    },
  }
</script>

<style lang="scss" module>
  @import "./style.module.scss";
</style>
<style scoped>
  .item:hover {
    color: #9e0207;
  }
</style>
