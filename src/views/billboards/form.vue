<template>
  <div class="container">
  	<div class="row">
  	  <fieldset class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
        <legend>Datos Generales:</legend>
        <billboard-form></billboard-form>
      </fieldset>
      <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4 ml-auto">
        <billboard-widget></billboard-widget>
      </div> 
    </div>
  </div>
</template>
<script>
import BillboardForm from "../../components/billboard/BillboardForm" 
import BillboardWidget from "../../components/billboard/BillboardWidget"  

export default {
  data() {
    return {}
  },

  components: {
    "billboard-form": BillboardForm,
    "billboard-widget": BillboardWidget
  },
}
</script>
<style scoped>
fieldset {
  background-color: #f2f4f8;
  border-radius: 4px;
}

legend {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  font-size: 15px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}
</style>