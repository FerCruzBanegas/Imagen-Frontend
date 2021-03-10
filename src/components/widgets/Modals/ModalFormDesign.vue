<template>
  <b-modal
    v-model="visible"
    :header-bg-variant="'secondary'"
    size="xl"
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
  >
    <template v-slot:modal-header="{ close }">
      <h5 class="text-white">DATOS DISEÑO ARTE GUÍA</h5>
      <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
    </template>
    <a-spin :spinning="loading">
      <b-card v-if="design" class="text-left" sub-title="Los campos con (*) son obligatorios">
        <div class="row">
          <div class="col-sm-12 col-md-12 col-lg-8 col-xl-8">
            <p>Registrado:</p>
            <p>Modificado:</p>
          </div>
          <div class="col-sm-12 col-md-12 col-lg-4 col-xl-4">
            <strong>
              <label for="design_approved_date">Fecha de APROBACIÓN DISEÑO :</label>
            </strong>
            <b-form-group label-for="design_approved_date">
              <b-form-input 
                v-available
                v-model="design.design.design_approved_date" 
                disabled
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="filename">Nombre Archivo * :</label>
            </strong>
            <b-form-group label-for="filename" :invalid-feedback="errors.first('design.filename')" :state="!errors.has('design.filename')">
              <b-form-input
                v-available
                v-model="design.design.filename" 
                :state="errors.has('design.filename') ? false : null"
                v-validate="'required|min:5|max:64'"
                data-vv-name="design.filename"
                data-vv-as="archivo"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="machine">Máquina * :</label>
            </strong>
            <b-form-group label-for="machine" :invalid-feedback="errors.first('design.machine')" :state="!errors.has('design.machine')">
              <b-form-input
                v-available 
                v-model="design.design.machine" 
                :state="errors.has('design.machine') ? false : null"
                v-validate="'required|max:64'"
                data-vv-name="design.machine"
                data-vv-as="máquina"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="quality">Calidad :</label>
            </strong>
            <b-form-group label-for="quality" :invalid-feedback="errors.first('design.quality')" :state="!errors.has('design.quality')">
              <b-form-input 
                v-available
                v-model="design.design.quality"
                :state="errors.has('design.quality') ? false : null"
                v-validate="'max:32'"
                data-vv-name="design.quality"
                data-vv-as="calidad" 
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="material">Material :</label>
            </strong>
            <b-form-group label-for="material" :invalid-feedback="errors.first('design.material')" :state="!errors.has('design.material')">
              <b-form-input
                v-available 
                v-model="design.design.material"
                :state="errors.has('design.material') ? false : null"
                v-validate="'max:120'"
                data-vv-name="design.material"
                data-vv-as="material"  
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="cutting_dimension">Dimensiones CORTE * :</label>
            </strong>
            <b-form-group label-for="cutting_dimension" :invalid-feedback="errors.first('design.cutting_dimension')" :state="!errors.has('design.cutting_dimension')">
              <b-form-input
                v-available 
                v-model="design.design.cutting_dimension" 
                :state="errors.has('design.cutting_dimension') ? false : null"
                v-validate="'required|max:32'"
                data-vv-name="design.cutting_dimension"
                data-vv-as="dimensión corte" 
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="print_dimension">Dimensiones IMPRESIÓN * :</label>
            </strong>
            <b-form-group label-for="print_dimension" :invalid-feedback="errors.first('design.print_dimension')" :state="!errors.has('design.print_dimension')">
              <b-form-input 
                v-available
                v-model="design.design.print_dimension" 
                :state="errors.has('design.print_dimension') ? false : null"
                v-validate="'required|max:32'"
                data-vv-name="design.print_dimension"
                data-vv-as="dimensión impresión"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="finished">Acabado :</label>
            </strong>
            <b-form-group label-for="finished" :invalid-feedback="errors.first('design.finished')" :state="!errors.has('design.finished')">
              <b-form-input
                v-available 
                v-model="design.design.finished" 
                :state="errors.has('design.finished') ? false : null"
                v-validate="'max:32'"
                data-vv-name="design.finished"
                data-vv-as="acabado"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="test_print">Prueba de Impresión :</label>
            </strong>
            <b-form-group label-for="test_print" :invalid-feedback="errors.first('design.test_print')" :state="!errors.has('design.test_print')">
              <b-form-input
                v-available 
                v-model="design.design.test_print" 
                :state="errors.has('design.test_print') ? false : null"
                v-validate="'max:32'"
                data-vv-name="design.test_print"
                data-vv-as="prueba impresión"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="quote_approved_date">Fecha APROBADA COTIZACIÓN * :</label>
            </strong>
            <b-form-group label-for="quote_approved_date" :invalid-feedback="errors.first('design.quote_approved_date')" :state="!errors.has('design.quote_approved_date')">
              <b-form-input
                v-available
                v-model="design.design.quote_approved_date" 
                :state="errors.has('design.quote_approved_date') ? false : null"
                v-validate="'required'"
                data-vv-name="design.quote_approved_date"
                data-vv-as="fecha aprobada"
                type="date"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-4 col-xl-4">
            <strong>
              <label for="reference">Referencia :</label>
            </strong>
            <b-form-group label-for="reference" :invalid-feedback="errors.first('design.reference')" :state="!errors.has('design.reference')">
              <b-form-input 
                v-available
                v-model="design.design.reference"
                :state="errors.has('design.reference') ? false : null"
                v-validate="'max:32'"
                data-vv-name="design.reference"
                data-vv-as="referencia"
              ></b-form-input>
            </b-form-group>
          </div>
          <div class="col-sm-12 col-md-6 col-lg-8 col-xl-8">
            <strong>
              <label for="note">Nota / Observación :</label>
            </strong>
            <b-form-group label-for="note" :invalid-feedback="errors.first('design.note')" :state="!errors.has('design.note')">
              <b-form-input 
                v-available
                v-model="design.design.note"
                :state="errors.has('design.note') ? false : null"
                v-validate="'min:5|max:120'"
                data-vv-name="design.note"
                data-vv-as="nota"
                placeholder="Nota / Observaciones"
              ></b-form-input>
            </b-form-group>
          </div>
        </div>
        <b-row class="justify-content-md-center mt-3">
          <b-col xl="4" class="demo-gallery">
            <div class="item-gallery">
              <a v-on:click.prevent="showSingle(design.design.path.url)">
                <img class="img-responsive" :src="getImage()">
                <div class="demo-gallery-poster">
                  <img src="/img/zoom.png">
                </div>
              </a>
            </div>
            <vue-easy-lightbox
              escDisabled
              moveDisabled
              :visible="show"
              :imgs="imgs"
              @hide="handleHide"
            ></vue-easy-lightbox>
          </b-col>
          <b-col xl="6" class="demo-gallery">
            <strong>
              <label for="path">Imagen Diseño :</label>
            </strong>
            <b-form-group label-for="path" :invalid-feedback="errors.first('design.path.url')" :state="!errors.has('design.path.url')">
              <b-form-file 
                v-on:change="onImageChange"
                :state="errors.has('design.path.url') ? false : null"
                v-validate="'required'"
                data-vv-name="design.path.url"
                data-vv-as="imagen"
                placeholder="Seleccione una imagen..."
              ></b-form-file>
            </b-form-group>
          </b-col>
        </b-row>
        <hr />
        <div class="d-flex justify-content-end">
          <b-button v-available variant="danger" @click="submit">
            {{ design.design.id === null ? 'Registrar' : 'Actualizar' }}
          </b-button>
        </div>
      </b-card>
    </a-spin>
  </b-modal>
</template>
<script>
import DesignService from '../../../services/design.service'

export default {
  props: {
    visible: Boolean,
    design: Object
  },

  data() {
    return {
      imgs: '',
      show: false,
      loading: false,
    }
  },

  directives: {
    available: {
      inserted: (el, binding, vnode) => {
        if(vnode.context.state === 3) {
          el.disabled = true
        }
      }
    }
  },
  
  methods: {
    showSingle(img) {
      if (img) {
        this.imgs = img
        this.show = true
      }
    },

    handleHide() {
      this.show = false
    },

    getImage() {
      if (this.design.design.path.url) {
        return this.design.design.path.url
      } else {
        return 'img/no-image.jpg'
      }
    },

    onImageChange(e) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length)
        return;
      this.createImage(files[0])
      this.design.design.path.name = files[0].name
    },

    createImage(file) {
      let reader = new FileReader()
      let vm = this;
      reader.onload = (e) => {
        vm.design.design.path.url = e.target.result
      };
      reader.readAsDataURL(file)
    },

    submit: async function() {
      this.$validator.errors.clear();
      const vm = this
      const data = { design: this.design.design }
      vm.loading = true
      try {
        if(this.design.design.id) {
          vm._save = await DesignService.updateDesign(this.design.design.id, data)
        } else {
          vm._save = await DesignService.storeDesign(data)
        }
        if (vm._save.status === 201 || vm._save.status === 200) {
          this.design.design.id = vm._save.data.data.id 
          this.design.state = 1
          // // vm.$snotify.simple(vm._save.data.message, 'Felicidades')
          vm.loading = false
        }
      } catch (err) {
        if(err.response.status === 422) vm.$setErrorsFromResponse(err.response.data)
        // vm.loading = false
      }
    },

    onClose() {
      this.$emit("hide")
    }
  }
}
</script>
<style lang="css">
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Buscar';
}

.demo-gallery > div {
  margin-bottom: 15px;
  width: 100%;
  display: inline-block;
  margin-right: 10px;
  list-style: outside none none;
}

.demo-gallery > div > a {
  border: 3px solid #FFF;
  border-radius: 3px;
  display: block;
  overflow: hidden;
  position: relative;
  float: left;
}

.demo-gallery > div > a > img {
  -webkit-transition: -webkit-transform 0.15s ease 0s;
  -moz-transition: -moz-transform 0.15s ease 0s;
  -o-transition: -o-transform 0.15s ease 0s;
  transition: transform 0.15s ease 0s;
  -webkit-transform: scale3d(1, 1, 1);
  transform: scale3d(1, 1, 1);
  height: 100%;
  width: 100%;
}

.demo-gallery > div > a:hover > img {
  -webkit-transform: scale3d(1.1, 1.1, 1.1);
  transform: scale3d(1.1, 1.1, 1.1);
}

.demo-gallery > div > a:hover .demo-gallery-poster > img {
  opacity: 1;
}

.demo-gallery > div > a .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transition: background-color 0.15s ease 0s;
  -o-transition: background-color 0.15s ease 0s;
  transition: background-color 0.15s ease 0s;
}

.demo-gallery > div > a .demo-gallery-poster > img {
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  opacity: 0;
  position: absolute;
  top: 50%;
  -webkit-transition: opacity 0.3s ease 0s;
  -o-transition: opacity 0.3s ease 0s;
  transition: opacity 0.3s ease 0s;
}

.demo-gallery > div > a:hover .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>