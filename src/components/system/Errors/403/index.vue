<template>
  <div :class="$style.errors">
    <div class="pt-4 pb-4 d-flex align-items-end mt-auto">
      <img src="resources/images/logo.png" alt="Imagen" width="200px"/>
    </div>
    <div class="pl-5 pr-5 pt-5 pb-5 mb-auto text-dark font-size-30" :class="$style.container">
      <div class="font-weight-bold mb-3">Acceso Denegado</div>
      <div>No tiene los permisos necesarios para realizar esta acción</div>
      <div class="font-weight-bold font-size-70 mb-1">403 —</div>
      <router-link to="/inicio" class="btn btn-outline-danger width-100">Ir a inicio</router-link>
    </div>
    <div class="mt-auto pb-5 pt-5">
      <div class="text-gray-4 text-center">© {{new Date().getFullYear()}} Imagen Publicidad Vial S.R.L.</div>
    </div>
  </div>
</template>
<script>
export default {
  name: 'Error403',
}
</script>
<style lang="scss" module>
@import "@/components/system/Errors/style.module.scss";
</style>
