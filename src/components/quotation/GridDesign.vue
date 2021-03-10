<template>
  <div>
    <div v-if="verifyState" class="d-flex justify-content-start mb-2">
      <b-button :disabled="approved" @click="approvedQuotation" variant="danger">
        <b-spinner v-if="approved" small type="grow"></b-spinner>
        <i v-else class="fa fa-check-circle-o" aria-hidden="true"></i>
        Aprobar Cotización
      </b-button>
    </div>
    <!-- <pre>{{ $data }}</pre> -->
    <b-table class="text-center" :items="quotation.products" :fields="columns" :tbody-tr-class="rowClass" fixed hover responsive="sm" stacked="sm" head-variant="light" primary-key="uuid">
      <template v-slot:cell(item)="data">
        {{ data.index + 1 }}
      </template>
      <template v-slot:head(item)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(name)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(quantity)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(dimension)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(opciones)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:cell(opciones)="row">
        <b-button size="sm" @click="row.toggleDetails" class="mr-2">
          {{ row.detailsShowing ? 'Cerrar' : 'Ver'}} Detalle
        </b-button>
      </template>
      <template v-slot:row-details="row">
        <a-spin :spinning="loading">
          <b-card class="text-left" title="DATOS DISEÑO ARTE GUÍA" sub-title="Los campos con (*) son obligatorios">
            <div class="row" v-if="row.item.design.design_approved_date">
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <p>Registrado: {{row.item.design.created | formatDate('DD/MM/YYYY') }}</p>
                <p>Modificado: {{row.item.design.updated | formatDate('DD/MM/YYYY') }}</p>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="design_approved_date">Fecha de APROBACIÓN DISEÑO :</label>
                </strong>
                <b-form-group label-for="design_approved_date">
                  <b-form-input 
                    v-available
                    v-model="row.item.design.design_approved_date" 
                    disabled
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="filename">Nombre Archivo * :</label>
                </strong>
                <b-form-group label-for="filename" :invalid-feedback="errors.first('design.filename')" :state="!errors.has('design.filename')">
                  <b-form-input
                    v-available
                    v-model="row.item.design.filename" 
                    :state="errors.has('design.filename') ? false : null"
                    v-validate="'required|min:5|max:64'"
                    data-vv-name="design.filename"
                    data-vv-as="archivo"
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="machine">Máquina * :</label>
                </strong>
                <b-form-group label-for="machine" :invalid-feedback="errors.first('design.machine')" :state="!errors.has('design.machine')">
                  <!-- <div class="d-table-cell w-100"> -->
                    <!-- <v-select
                      label="business_name"
                      :filterable="false"
                      :options="customers"
                      v-model="quotation.customer_id"
                      @search="onSearchCustomer"
                      :state="errors.has('quotation.customer_id') ? false : null"
                      v-validate="'required'"
                      data-vv-name="quotation.customer_id"
                      data-vv-as="cliente"
                    >
                      <template slot="no-options">Buscar clientes..</template>
                      <template slot="option" slot-scope="customer">
                        <div>
                          <strong>{{ customer.business_name }}</strong>
                        </div>
                      </template>
                      <template slot="selected-option" slot-scope="customer">
                        <div>
                          <strong>{{ customer.business_name }}</strong>
                        </div>
                      </template>
                    </v-select> -->
                    <b-form-input
                      v-available 
                      v-model="row.item.design.machine" 
                      :state="errors.has('design.machine') ? false : null"
                      v-validate="'required|max:64'"
                      data-vv-name="design.machine"
                      data-vv-as="máquina"
                    ></b-form-input>
                  <!-- </div> -->
                  <!-- <div class="d-table-cell align-middle">
                    <b-button style="height: 2.7em;" class="ml-1" size="sm" variant="dark">
                      <i class="fa fa-plus-circle" aria-hidden="true"></i>
                    </b-button>
                  </div> -->
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="quality">Calidad :</label>
                </strong>
                <b-form-group label-for="quality" :invalid-feedback="errors.first('design.quality')" :state="!errors.has('design.quality')">
                  <b-form-input 
                    v-available
                    v-model="row.item.design.quality"
                    :state="errors.has('design.quality') ? false : null"
                    v-validate="'max:128'"
                    data-vv-name="design.quality"
                    data-vv-as="calidad" 
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="material">Material :</label>
                </strong>
                <b-form-group label-for="material" :invalid-feedback="errors.first('design.material')" :state="!errors.has('design.material')">
                  <b-form-input
                    v-available 
                    v-model="row.item.design.material"
                    :state="errors.has('design.material') ? false : null"
                    v-validate="'max:512'"
                    data-vv-name="design.material"
                    data-vv-as="material"  
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="cutting_dimension">Dimensiones CORTE :</label>
                </strong>
                <b-form-group label-for="cutting_dimension" :invalid-feedback="errors.first('design.cutting_dimension')" :state="!errors.has('design.cutting_dimension')">
                  <b-form-input
                    v-available 
                    v-model="row.item.design.cutting_dimension" 
                    :state="errors.has('design.cutting_dimension') ? false : null"
                    v-validate="'max:32'"
                    data-vv-name="design.cutting_dimension"
                    data-vv-as="dimensión corte" 
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="print_dimension">Dimensiones IMPRESIÓN :</label>
                </strong>
                <b-form-group label-for="print_dimension" :invalid-feedback="errors.first('design.print_dimension')" :state="!errors.has('design.print_dimension')">
                  <b-form-input 
                    v-available
                    v-model="row.item.design.print_dimension" 
                    :state="errors.has('design.print_dimension') ? false : null"
                    v-validate="'max:32'"
                    data-vv-name="design.print_dimension"
                    data-vv-as="dimensión impresión"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="finished">Acabado :</label>
                </strong>
                <b-form-group label-for="finished" :invalid-feedback="errors.first('design.finished')" :state="!errors.has('design.finished')">
                  <b-form-input
                    v-available 
                    v-model="row.item.design.finished" 
                    :state="errors.has('design.finished') ? false : null"
                    v-validate="'max:512'"
                    data-vv-name="design.finished"
                    data-vv-as="acabado"
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="test_print">Prueba de Impresión :</label>
                </strong>
                <b-form-group label-for="test_print" :invalid-feedback="errors.first('design.test_print')" :state="!errors.has('design.test_print')">
                  <b-form-input
                    v-available 
                    v-model="row.item.design.test_print" 
                    :state="errors.has('design.test_print') ? false : null"
                    v-validate="'max:32'"
                    data-vv-name="design.test_print"
                    data-vv-as="prueba impresión"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="quote_approved_date">Fecha APROBADA COTIZACIÓN * :</label>
                </strong>
                <b-form-group label-for="quote_approved_date" :invalid-feedback="errors.first('design.quote_approved_date')" :state="!errors.has('design.quote_approved_date')">
                  <b-form-input
                    v-available
                    v-model="row.item.design.quote_approved_date" 
                    :state="errors.has('design.quote_approved_date') ? false : null"
                    v-validate="'required'"
                    data-vv-name="design.quote_approved_date"
                    data-vv-as="fecha aprobada"
                    type="date"
                  ></b-form-input>
                </b-form-group>
              </div>
              <div class="col-sm-12 col-md-12 col-lg-6 col-xl-6">
                <strong>
                  <label for="reference">Referencia :</label>
                </strong>
                <b-form-group label-for="reference" :invalid-feedback="errors.first('design.reference')" :state="!errors.has('design.reference')">
                  <b-form-input 
                    v-available
                    v-model="row.item.design.reference"
                    :state="errors.has('design.reference') ? false : null"
                    v-validate="'max:32'"
                    data-vv-name="design.reference"
                    data-vv-as="referencia"
                  ></b-form-input>
                </b-form-group>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
                <b-form-group :invalid-feedback="errors.first('design.note')" :state="!errors.has('design.note')">
                  <b-form-input 
                    size="lg"
                    v-available
                    v-model="row.item.design.note"
                    :state="errors.has('design.note') ? false : null"
                    v-validate="'min:5|max:512'"
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
                  <a v-on:click.prevent="showSingleDesignImage(row.item.design.path.url)">
                    <img class="img-responsive" :src="getImageDesign(row.item)">
                    <div class="demo-gallery-poster">
                      <img src="/img/zoom.png">
                    </div>
                  </a>
                </div>
                <vue-easy-lightbox
                  escDisabled
                  moveDisabled
                  :visible="showDesign"
                  :imgs="imgDesign"
                  @hide="handleHideDesign"
                ></vue-easy-lightbox>
              </b-col>
              <b-col xl="6" class="demo-gallery">
                <strong>
                  <label for="path">Imagen Diseño :</label>
                </strong>
                <b-form-group label-for="path" :invalid-feedback="errors.first('design.path.url')" :state="!errors.has('design.path.url')">
                  <b-form-file 
                    v-on:change="onImageChangeDesign($event, row.item)"
                    :state="errors.has('design.path.url') ? false : null"
                    v-validate="'required'"
                    data-vv-name="design.path.url"
                    data-vv-as="imagen"
                    placeholder="Seleccione una imagen..."
                    accept="image/jpeg, image/png"
                  ></b-form-file>
                </b-form-group>
              </b-col>
            </b-row>
            <b-row v-if="quotation.state != 3">
              <b-col xl="12">
                <div class="pl-2 bg-light text-dark font-weight-bold">
                  <label style="margin-bottom: 0;" for="set_image_support" class="p-2"> Desea Agregar una imagen de referencia?</label>
                  <input v-on:change="removeImageSupport(row)" v-model="row.item.design.set_image_support" type="checkbox" id="set_image_support" class="k-checkbox" checked="checked">
                </div>
              </b-col>
            </b-row>
            <b-row v-if="row.item.design.set_image_support" class="justify-content-md-center mt-3">
              <b-col xl="4" class="demo-gallery">
                <div class="item-gallery">
                  <a v-on:click.prevent="showSingleSupportImage(row.item.design.support_path.url)">
                    <img class="img-responsive" :src="getImageSupport(row.item)">
                    <div class="demo-gallery-poster">
                      <img src="/img/zoom.png">
                    </div>
                  </a>
                </div>
                <vue-easy-lightbox
                  escDisabled
                  moveDisabled
                  :visible="showSupport"
                  :imgs="imgSupport"
                  @hide="handleHideSupport"
                ></vue-easy-lightbox>
              </b-col>
              <b-col xl="6" class="demo-gallery">
                <strong>
                  <label for="support_path">Imagen Apoyo :</label>
                </strong>
                <b-form-group label-for="support_path" :invalid-feedback="errors.first('design.support_path.url')" :state="!errors.has('design.support_path.url')">
                  <b-form-file 
                    v-on:change="onImageChangeSupport($event, row.item)"
                    :state="errors.has('design.support_path.url') ? false : null"
                    v-validate="'required'"
                    data-vv-name="design.support_path.url"
                    data-vv-as="imagen"
                    placeholder="Seleccione una imagen..."
                    accept="image/jpeg, image/png"
                  ></b-form-file>
                </b-form-group>
              </b-col>
            </b-row>
            <div class="d-flex justify-content-start mt-2">
              <b-button v-available class="mr-2" variant="danger" size="sm" @click="submit(row.item)">
                {{ row.item.design.id === null ? 'Registrar' : 'Actualizar' }}
              </b-button>
              <b-button @click="downloadDesign(row.item)" v-if="row.item.state" size="sm"><i class="fa fa-download"></i></b-button>
              <b-button
                v-if="row.item.state"
                @click="printDesign(row.item)"
                variant="dark" 
                size="sm"
                class="float-right ml-2"
              ><i class="fa fa-print" aria-hidden="true"></i></b-button>
            </div>
          </b-card>
        </a-spin>
      </template>
    </b-table>
  </div>
</template>

<script>
import DesignService from '../../services/design.service'
import QuotationService from '../../services/quotation.service'

export default {
  props: {
    quotation: {
      type: Object
    },
  },

  computed: {
    verifyState: function () {
      if (this.quotation.products.every((value) => value.state == true)) {
        if (this.quotation.state != 1) {
          return false 
        } else {
          return true
        }
      } else {
        return false
      }
    }
  },

  directives: {
    available: {
      inserted: (el, binding, vnode) => {
        if(vnode.context.quotation.state === 3) {
          el.disabled = true
        }
      }
    }
  },

  data() {
    return {
      columns: [
        'item',
        { key: 'name', label: 'Producto'},
        { key: 'quantity', label: 'Cantidad'},
        { key: 'dimension', label: 'Dimensión'},
        'opciones',
      ],
      loading: false,
      approved: false,
      imgDesign: '',
      imgSupport: '',
      showDesign: false,
      showSupport: false,
    }
  },

  methods: {
    approvedQuotation: async function() {
      this.approved = true
      try {
        const response = await QuotationService.approvedQuotation(this.$route.params.id)
        if (response.status === 200) {
          this.$emit('approved')
          this.approved = false
          this.$message.success(response.data.message)
        }
      } catch (err) {
        this.approved = false
      }
    },

    downloadDesign: async function(item) { 
      this.loading = true
      let design = Object.assign({}, item.design)
      design['cite'] = this.quotation.cite
      design['quantity'] = item.quantity
      const response = await DesignService.downloadDesign({design: design})
      if (response.status === 200) {
        let blob = new Blob([response.data])
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `arte.pdf`
        link.click()
        this.loading = false
      }
    },

    async printDesign(item) {
      try {
        this.loading = true
        let design = Object.assign({}, item.design)
        design['cite'] = this.quotation.cite
        design['quantity'] = item.quantity
        const response = await DesignService.downloadDesign({design: design})
        if (response.status === 200) {
          let file = new Blob([response.data], {type: 'application/pdf'})
          let fileUrl = URL.createObjectURL(file)
          window.open(fileUrl) 
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    removeImageSupport(row) {
      if(!row.item.design.set_image_support) {
        row.item.design.support_path.url = null
        row.item.design.support_path.name = null
      }
    },

    showSingleDesignImage(img) {
      if (img) {
        this.imgDesign = img
        this.showDesign = true
      }
    },

    showSingleSupportImage(img) {
      if (img) {
        this.imgSupport = img
        this.showSupport = true
      }
    },

    handleHideDesign() {
      this.showDesign = false
    },

    handleHideSupport() {
      this.showSupport = false
    },

    getImageDesign(row) {
      if (row.design.path.url) {
        return row.design.path.url
      } else {
        return 'img/no-image.jpg'
      }
    },

    getImageSupport(row) {
      if (row.design.support_path.url) {
        return row.design.support_path.url
      } else {
        return 'img/no-image.jpg'
      }
    },

    onImageChangeDesign(e, row) {
      row.design.path.url = null
      row.design.path.name = null
      let files = e.target.files || e.dataTransfer.files
      if (!files.length)
        return;
      if (files[0].size > 3000000) {
        e.target.labels[0].textContent = 'Seleccione una imagen...'
        alert('La imagen no debe superar los 3MB')
      } else {
        e.target.labels[0].textContent = files[0].name
        this.createImage(files[0], row.design.path)
        row.design.path.name = files[0].name
      }
    },

    onImageChangeSupport(e, row) {
      row.design.support_path.url = null
      row.design.support_path.name = null
      let files = e.target.files || e.dataTransfer.files
      if (!files.length)
        return;
      if (files[0].size > 3000000) {
        e.target.labels[0].textContent = 'Seleccione una imagen...'
        alert('La imagen no debe superar los 3MB')
      } else {
        e.target.labels[0].textContent = files[0].name
        this.createImage(files[0], row.design.support_path)
        row.design.support_path.name = files[0].name
      }
    },

    createImage(file, row) {
      let reader = new FileReader()
      let vm = this;
      reader.onload = (e) => {
        row.url = e.target.result
      }
      reader.readAsDataURL(file)
    },

    submit: async function(row) {
      this.$validator.errors.clear();
      const data = { design: row.design }
      this.loading = true
      try {
        if(row.design.id) {
          this._save = await DesignService.updateDesign(row.design.id, data)
        } else {
          this._save = await DesignService.storeDesign(data)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          row.design.id = this._save.data.data.id 
          row.design.design_approved_date = this._save.data.data.design_approved_date 
          row.state = 1
          this.$message.success(this._save.data.message)
          this.loading = false
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.loading = false
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.state) {
        return 'table-success'
      } else {
        return 'table-warning'
      }
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