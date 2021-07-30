<template>
  <div class="container" v-if="success">
    <modal-question
      :title="'Alerta'"
      :visible="visibleQuestion"
      :alert_message="'Realmente desea dar de baja este espacio?'"
      :loading="loadingQuestion"
      @hide="visibleQuestion = !visibleQuestion"
      @submit="deleteBillboard"
    ></modal-question>
    <a-spin :spinning="loading">
      <div class="d-flex flex-wrap">
        <div class="mr-auto">
          <h3 class="font-weight-bold">DETALLES Y CARACTERÍSTICAS DEL ESPACIO</h3>
        </div>
        <div>
          <b-button @click="pdfDetailBillboard" size="sm" variant="dark">
            <i class="fa fa-download"></i> 
            DESCARGAR
          </b-button>
        </div>
      </div>
      <hr />
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <b-card no-body header-bg-variant="light">
            <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase text-black">
              <b-tab :title-link-class="linkClass(0)">
                <template #title>
                  <i class="fa fa-list font-size-20"></i> General
                </template>
                <div class="row">
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <fieldset>
                      <legend>Fotografías del espacio:</legend>
                      <b-carousel
                        id="carousel-1"
                        v-model="slide"
                        :interval="4000"
                        controls
                        indicators
                        background="#ababab"
                        img-width="1024"
                        img-height="480"
                        style="text-shadow: 1px 1px 2px #333;"
                        @sliding-start="onSlideStart"
                        @sliding-end="onSlideEnd"
                      >
                        <template v-for="(item, index) in getImagesArray">
                          <b-carousel-slide :text="item.title">
                            <template #img>
                              <img
                                style="cursor: pointer;"
                                class="d-block w-100"
                                width="1024"
                                height="366"
                                :src="item.src"
                                @click="showImg(index)"
                              >
                            </template>
                          </b-carousel-slide>
                        </template>
                      </b-carousel>
                      <vue-easy-lightbox
                        :visible="visible"
                        :imgs="getImagesArray"
                        :index="index"
                        @hide="handleHide"
                      ></vue-easy-lightbox>
                      <!-- <pre>{{ $data }}</pre> -->
                      <div class="accordion m-2" role="tablist">
                        <b-card no-body class="mb-1">
                          <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-1 variant="secondary">
                              <span class="font-weight-bold">Agregar/actualizar imagen del cliente</span>
                              <span class="accordion-indicator pull-right">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                              </span>
                            </b-button>
                          </b-card-header>
                          <b-collapse id="accordion-1" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                              <b-card-text>
                                <strong>Seleccione y pulse el botón para cargar la imagen.</strong>
                              </b-card-text>
                              <b-card-text>
                                <div style="margin-bottom: 1px; display: flex; justify-content: center;">
                                  <vue-upload-multiple-image
                                    dragText="Arrastrar imagen"
                                    browseText="(o) Seleccione Máximo 3M"
                                    :maxImage="1"
                                    idUpload="uploadCustomer"
                                    editUpload="editCustomer"
                                    @upload-success="uploadImageCustomerSuccess"
                                    @before-remove="beforeRemove"
                                    @upload-failed="uploadFailed"
                                  ></vue-upload-multiple-image>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                  <div class="p-2">
                                    <b-button @click="saveCustomerImage" title="Subir Imagen" variant="success">
                                      <i class="fa fa-cloud-upload" aria-hidden="true"></i>
                                    </b-button>
                                  </div>
                                </div>
                              </b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                        <b-card no-body class="mb-1">
                          <b-card-header header-tag="header" class="p-1" role="tab">
                            <b-button block v-b-toggle.accordion-2 variant="dark">
                              <span class="font-weight-bold">Agregar/actualizar imagen del usuario</span>
                              <span class="accordion-indicator pull-right">
                                <i class="fa fa-plus-circle" aria-hidden="true"></i>
                              </span>
                            </b-button>
                          </b-card-header>
                          <b-collapse id="accordion-2" accordion="my-accordion" role="tabpanel">
                            <b-card-body>
                              <b-card-text>
                                <strong>Seleccione y pulse el botón para cargar la imagen.</strong>
                              </b-card-text>
                              <b-card-text>
                                <div style="margin-bottom: 1px; display: flex; justify-content: center;">
                                  <vue-upload-multiple-image
                                    dragText="Arrastrar imagen"
                                    browseText="(o) Seleccione Máximo 3M"
                                    :maxImage="1"
                                    idUpload="uploadUser"
                                    editUpload="editUser"
                                    @upload-success="uploadImageUserSuccess"
                                    @before-remove="beforeRemove"
                                    @upload-failed="uploadFailed"
                                  ></vue-upload-multiple-image>
                                </div>
                                <div class="d-flex flex-row-reverse">
                                  <div class="p-2">
                                    <b-button @click="saveUserImage" title="Subir Imagen" variant="success">
                                      <i class="fa fa-cloud-upload" aria-hidden="true"></i>
                                    </b-button>
                                  </div>
                                </div>
                              </b-card-text>
                            </b-card-body>
                          </b-collapse>
                        </b-card>
                      </div>
                    </fieldset>
                  </div>
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6 ml-auto">
                    <fieldset>
                      <legend>Datos Generales:</legend>
                      <div class="container">
                        <div class="d-flex flex-wrap">
                          <div class="mr-auto">
                            <h5 class="font-weight-bold">CÓDIGO:</h5>
                          </div>
                          <div>
                            <h4 class="font-weight-bold">{{ billboard.code }}</h4>
                          </div>
                        </div>
                        <div class="row bg-dark">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 border">
                            <div class="d-flex justify-content-between my-2">
                              <span class="text-white font-weight-bold">DESCRIPCIÓN</span>
                            </div>
                          </div>
                        </div>
                        <div class="row bg-secondary">
                          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                            <div class="d-flex justify-content-between my-2">
                              <span class="text-white font-weight-bold">Registrado:</span>
                              <span class="text-white font-weight-bold">{{ billboard.created | formatDate('DD/MM/YYYY') }}</span>
                            </div>
                          </div>
                          <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                            <div class="d-flex justify-content-between my-2">
                              <span class="text-white font-weight-bold">Actualizado:</span>
                              <span class="text-white font-weight-bold">{{ billboard.updated | formatDate('DD/MM/YYYY') }}</span>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              CIUDAD: &nbsp; &nbsp; {{ billboard.city.name }}
                            </div>
                          </div>
                        </div>
                        <div class="row bg-white">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              ZONA: &nbsp; &nbsp; {{ billboard.zone }}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              UBICACIÓN: &nbsp; &nbsp; {{ billboard.location }}
                            </div>
                          </div>
                        </div>
                        <div class="row bg-white">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              DIMENSIÓN: &nbsp; &nbsp; 
                              <span class="text-primary">
                                {{ billboard.dimension }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              PRECIO: &nbsp; &nbsp; 
                              <span class="text-primary">
                                {{ billboard.price | currency }}
                              </span>
                            </div>
                          </div>
                        </div>
                        <div class="row bg-white">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              ILUMINACIÓN: &nbsp; &nbsp; {{ billboard.illumination }}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              ESTADO : &nbsp; &nbsp; 
                              <span v-html="templateState(billboard.state.title)"></span>
                            </div>
                          </div>
                        </div>
                        <div class="row bg-white">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="font-weight-bold">
                              TIPO : &nbsp; &nbsp; {{ billboard.billboard_type.description }}
                            </div>
                          </div>
                        </div>
                        <div class="row">
                          <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12 p-2">
                            <div class="d-flex flex-row-reverse">
                              <div class="p-2">
                                <b-button @click="visibleQuestion = !visibleQuestion" title="Dar de Baja" variant="danger">
                                  <i class="fa fa-trash-o" aria-hidden="true"></i>
                                </b-button>
                              </div>
                              <div class="p-2">
                                <router-link :to="{ path: `/servicios/vallas/${billboard.id}/edit` }">
                                  <b-button title="Editar" variant="secondary">
                                    <i class="fa fa-pencil" aria-hidden="true"></i>
                                  </b-button>
                                </router-link>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                </div>
              </b-tab>
              <b-tab :title-link-class="linkClass(1)" lazy>
                <template #title>
                  <i class="fa fa-search-plus font-size-20"></i> Historial 
                </template>
                <!-- <a-skeleton active :loading="tabHistorial"/> -->
                <record-billboard :billboard="id" v-on:historial='historial'></record-billboard>
              </b-tab>
              <b-tab :title-link-class="linkClass(2)" lazy>
                <template #title>
                  <i class="fa fa-money font-size-20"></i> Costos
                </template>
              </b-tab>
            </b-tabs>
          </b-card>
        </div>
      </div>
    </a-spin>
  </div>
</template>

<script>
import BillboardService from '../../services/billboard.service'
import VueUploadMultipleImage from 'vue-upload-multiple-image'
import RecordBillboard from '../../components/billboard/RecordBillboard'
import ModalQuestion from "../../components/widgets/Modals/ModalQuestion.vue"

export default {
  data() {
    return {
      id: this.$route.params.id,
      success: false,
      loading: false,
      billboard: null,
      slide: 0,
      sliding: null,
      tabGeneral: true,
      tabHistorial: true,
      tabCostos: true,
      tabIndex: 0,
      visible: false,
      index: 0,
      imgCustomer: '',
      imgUser: '', 
      loadingQuestion: false,
      visibleQuestion: false,
    }
  },

  components: {
    VueUploadMultipleImage,
    'record-billboard': RecordBillboard,
    "modal-question": ModalQuestion,
  },

  watch: {
    tabIndex(val) {
      if (val != 0 || val != 1 || val != 2) {
        this.tabGeneral = true
        this.tabHistorial = true
        this.tabCostos = true
      }
    }
  },

  computed: {
    getImagesArray() {
      return [
        { title: 'Imagen Cliente', src: this.billboard.imgs.img_customer.src },
        { title: 'Imagen Usuario', src: this.billboard.imgs.img_user.src },
      ]
    }
  },

  created() {
    this.showBillboard()
  },

  methods: {
    showBillboard: async function() {
      const response = await BillboardService.showBillboard(`billboards/${this.id}/detail`)
      if (response.status === 200) {
        this.billboard = response.data.data
        this.success = true
      }
    },

    templateState(dataItem) {
      switch (dataItem) {
        case 'Disponible':
          return (
            "<span class='badge badge-custom-6'>" +
            kendo.htmlEncode(dataItem) +
            "</span>"
          );
          break;
        case 'No Disponible':
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(dataItem) +
            "</span>"
          );
          break;
        case 'Ocupado':
          return (
            "<span class='badge badge-custom-5'>" +
            kendo.htmlEncode(dataItem) +
            "</span>"
          );
          break;
        default:
          return (
            "<span class='badge badge-custom-4'>" +
            kendo.htmlEncode(dataItem) +
            "</span>"
          );
      }
    },

    beforeRemove (index, done, fileList) {
      let flat = confirm("Eliminar la imagen?")
      if (flat) {
        done()
      }
    },

    uploadFailed(flag) {
      if (flag) {
        this.$notification.warning({
          message: 'Nota',
          description: 'La imagen debe tener un peso máximo de 3MB',
          duration: 10,
        })
      }
    },

    uploadImageCustomerSuccess(formData, index, fileList) {
      this.imgCustomer = fileList[0]['path']
    },

    uploadImageUserSuccess(formData, index, fileList) {
      this.imgUser = fileList[0]['path']
    },

    async deleteBillboard() {
      try {
        this.loadingQuestion = true
        const response = await BillboardService.deleteBillboard(this.id)
        if (response.status === 200) {
          this.billboard = response.data.data
          this.loadingQuestion = false
          this.visibleQuestion = false
          this.$message.success(response.data.message)
        }
      } catch (err) {
        this.visibleQuestion = false
        this.loadingQuestion = false
      }
    },

    async saveCustomerImage() {
      if (this.imgCustomer) {
        this.loading = true
        try {
          let data = {
            path: this.imgCustomer
          }
          const request = await BillboardService.saveCustomerImage(this.id, data)
          if (request.status === 200) {
            this.billboard.imgs.img_customer.src = request.data.path
            this.slide = 0
            this.loading = false
          }
        } catch (err) {
          this.loading = false
        }
      } else {
        this.$notification.warning({
          message: 'Nota',
          description: 'No seleccionó ninguna imagen para cargar',
          duration: 10,
        })
      }
    },

    async saveUserImage() {
      if (this.imgUser) {
        this.loading = true
        try {
          let data = {
            path: this.imgUser
          }
          const request = await BillboardService.saveUserImage(this.id, data)
          if (request.status === 200) {
            this.billboard.imgs.img_user.src = request.data.path
            this.slide = 1
            this.loading = false
          }
        } catch (err) {
          this.loading = false
        }
      } else {
        this.$notification.warning({
          message: 'Nota',
          description: 'No seleccionó ninguna imagen para cargar',
          duration: 10,
          placement: 'bottomRight',
        })
      }
    },

    async pdfDetailBillboard() {
      this.$store.dispatch("showLoader")
      try {
        const billboards = await BillboardService.pdfDetailBillboard({billboard: [this.id]})
        if (billboards.status === 200) {
          let blob = new Blob([billboards.data])
          let link = document.createElement("a")
          link.href = window.URL.createObjectURL(blob)
          link.download = `${this.billboard.code}.pdf`
          link.click()
          this.$store.dispatch("hideLoader")
        }
      } catch (err) {
        this.$store.dispatch("hideLoader")
      }
    },
    
    general(e) {
      this.tabGeneral = e
    },

    historial(e) {
      this.tabHistorial = e
    },

    costos(e) {
      this.tabCostos = e
    },

    showImg(index) {
      this.index = index
      this.visible = true
    },

    handleHide() {
      this.visible = false
    },

    onSlideStart(slide) {
      this.sliding = true
    },

    onSlideEnd(slide) {
      this.sliding = false
    },

    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['text-black']
      } else {
        return ['text-danger font-weight-bold']
      }
    }
  }
}
</script>
<style scoped>
fieldset {
  background-color: #f2f4f8;
  border-radius: 4px;
  padding: 1em;
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