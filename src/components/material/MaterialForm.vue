<template>
  <b-modal
    v-model="visible"
    :header-bg-variant="'secondary'"
    size="lg"
    no-close-on-backdrop
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <h5 class="text-white">test</h5>
      <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
    </template>
    <div class="row">
      <div class="col-12 col-md-12 col-lg-4 col-xl-4">
        <strong>
          <label for="name">Nombre * :</label>
        </strong>
        <b-form-group label-for="name" :invalid-feedback="errors.first('name')" :state="!errors.has('name')">
          <b-form-input 
            v-model="material.name" 
            :state="errors.has('name') ? false : null"
            v-validate="'required|min:3|max:64'"
            data-vv-name="name"
            data-vv-as="nombre"
            type="text"
          ></b-form-input>
        </b-form-group>
      </div>
      <div class="col-12 col-md-12 col-lg-4 col-xl-4">
        <strong>
          <label for="unity">Unidad * :</label>
        </strong>
        <b-form-group label-for="unity" :invalid-feedback="errors.first('unity')" :state="!errors.has('unity')">
          <v-select 
            v-model="material.unity"
            :reduce="unity => unity.value"
            :state="errors.has('unity') ? false : null"
            v-validate="'required'"
            data-vv-name="unity"
            data-vv-as="estado"
            :options="units"
          >
            <template slot="option" slot-scope="option">
              <div class="d-center">
                {{ option.label }}
              </div>
            </template>
          </v-select>
        </b-form-group>
      </div>
      <div class="col-12 col-md-12 col-lg-4 col-xl-4">
        <strong>
          <label for="description">Descripción :</label>
        </strong>
        <b-form-group label-for="description" :invalid-feedback="errors.first('description')" :state="!errors.has('description')">
          <b-form-input 
            v-model="material.description" 
            :state="errors.has('description') ? false : null"
            v-validate="'required|max:64'"
            data-vv-name="description"
            data-vv-as="teléfono"
            type="text"
          ></b-form-input>
        </b-form-group>
      </div>
    </div>
  </b-modal>
</template>
<script>
import Material from '../../models/Material'

export default {
  props: {
    visible: Boolean,
    title: String,
    item: Object,
  },

  data() {
    return {
      material: new Material(),
      units: [
        { label: 'amarro', value: 'amarro'},
        { label: 'barra', value: 'barra'},
        { label: 'bolsa', value: 'bolsa'},
        { label: 'caja', value: 'caja'},
        { label: 'cajón', value: 'cajón'},
        { label: 'carga', value: 'carga'},
        { label: 'dm³', value: 'dm³'},
        { label: 'fajo', value: 'fajo'},
        { label: 'fardo', value: 'fardo'},
        { label: 'g', value: 'g'},
        { label: 'galón', value: 'galón'},
        { label: 'glb', value: 'glb'},
        { label: 'ha', value: 'ha'},
        { label: 'juego', value: 'juego'},
        { label: 'kg', value: 'kg'},
        { label: 'l', value: 'l'},
        { label: 'lata', value: 'lata'},
        { label: 'lb', value: 'lb'},
        { label: 'm', value: 'm'},
        { label: 'm²', value: 'm²'},
        { label: 'm³', value: 'm³'},
        { label: 'mm', value: 'mm'},
        { label: 'perfil', value: 'perfil'},
        { label: 'pie', value: 'pie'},
        { label: 'pie²', value: 'pie²'},
        { label: 'placa', value: 'placa'},
        { label: 'plomo', value: 'plomo'},
        { label: 'pqte', value: 'pqte'},
        { label: 'pto', value: 'plomo'},
        { label: 'pza', value: 'pza'},
        { label: 'resma', value: 'resma'},
        { label: 'rollo', value: 'rollo'},
        { label: 't', value: 't'},
        { label: 'tubo', value: 'tubo'},
        { label: 'turril', value: 'turril'},
        { label: 'unds', value: 'unds'},
      ],
    }
  },

  mounted() {
    if (this.item) {
      this.material = this.item
      console.log(this.material)
    }
  },

  beforeDestroy() {
    console.log('Main Vue destroyed')
  },
  
  methods: {
    onClose() {
      this.$emit("hide")
    }
  }
}
</script>
