<template>
  <div class="container" v-if="quotation">
    <h2>CITE: {{ quotation.cite }}</h2>
    <div class="d-flex flex-wrap">
      <div class="mr-auto">
        <strong>ESTADO:&nbsp &nbsp</strong>
        <span class="text-light">
          <span v-if="quotation.state === 1" class='badge badge-purple-2'>pendiente</span>
          <span v-else-if="quotation.state === 2" class='badge badge-primary'>aprobado</span>
          <span v-else class='badge badge-secondary'>ejecutado</span>
        </span>
        <span v-if="quotation.condition === 0" class='ml-2 badge badge-custom-1'>FACTURADO <i class="fa fa-check-circle"></i></span>
        <span v-if="quotation.condition === 2" class='ml-2 badge badge-custom-3'>REMITIDO <i class="fa fa-check-circle"></i></span>
      </div>
      <div>
        <b-button :disabled="loadingPrint" @click="printQuotation" size="sm" variant="info" class="mr-2">
          <i v-if="!loadingPrint" class="fa fa-print"></i> 
          <b-spinner v-else small label="Small Spinner" type="grow"></b-spinner>
        </b-button>
        <b-button :disabled="loading" @click="downloadQuotation" size="sm" variant="dark">
          <i v-if="!loading" class="fa fa-download"></i> 
          <b-spinner v-else small label="Small Spinner" type="grow"></b-spinner>
          DESCARGAR
        </b-button>
      </div>
    </div>
    <hr />
    <b-card no-body>
      <b-tabs v-model="tabIndex" card active-nav-item-class="font-weight-bold text-uppercase">
        <b-tab title="Cotización" :title-link-class="linkClass(0)">
          <b-row v-if="quotation.state === 1 && permission('quotations.update')">
            <b-col lg="4" class="pb-2">
              <router-link :to="{ path: `/servicios/cotizaciones/${quotation.id}/edit` }">
                <b-button 
                  squared 
                  size="sm" 
                  variant="outline-danger"
                >
                  <i class="fa fa-edit"></i> Editar
                </b-button>
              </router-link>
            </b-col>
          </b-row>
          <div class="row">
            <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <legend>Datos Generales:</legend>
              <div class="row bg-secondary">
                <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                  <div class="d-flex justify-content-between my-2">
                    <span class="text-white font-weight-bold">Registrado:</span>
                    <span class="text-white font-weight-bold">{{ quotation.created | formatDate('DD/MM/YYYY') }}</span>
                  </div>
                </div>
                <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border">
                  <div class="d-flex justify-content-between my-2">
                    <span class="text-white font-weight-bold">Actualizado:</span>
                    <span class="text-white font-weight-bold">{{ quotation.updated | formatDate('DD/MM/YYYY') }}</span>
                  </div>
                </div>
              </div>
              <div class="row justify-content-between border bg-light">
                <div class="col-md-6 border br-content">
                  <strong>Cliente: </strong>
                  <span class="text-light"> {{ quotation.customer.business_name }}</span>
                </div>
                <div class="col-md-6 border br-content">
                  <span>NIT: </span>
                  <span class="text-light"> {{ quotation.customer.nit }}</span>
                </div>
              </div>
              <div class="row justify-content-between border bg-light">
                <div class="col-md-6 border br-content">
                  <span>Persona de Contacto: </span>
                  <span class="text-light"> {{ quotation.attends }}</span>
                </div>
                <div class="col-md-6 border br-content">
                  <span>Email:</span>
                  <span class="text-light"> {{ quotation.customer.email }}</span>
                </div>
              </div>
              <div class="row justify-content-between border bg-light">
                <div class="col-md-6 border br-content">
                  <span>Teléfono/Cel:</span>
                  <span class="text-light"> {{ quotation.attends_phone }}</span>
                </div>
                <div class="col-md-6 border br-content">
                  <span>Sucursal:</span>
                  <span class="text-light"> {{ quotation.office.city }}</span>
                </div>
              </div>
              <div class="row justify-content-between border bg-light">
                <div class="col-md-6 border br-content">
                  <span>Dirección/Instalación:</span>
                  <span class="text-light"> {{ quotation.installment }}</span>
                </div>
                <div class="col-md-6 border br-content">
                  <span>Emitido por:</span>
                  <span class="text-light"> {{ quotation.user }}</span>
                </div>
              </div>
            </fieldset>
          </div>
          <hr />
          <div class="row">
            <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
              <legend>Productos / Servicios:</legend>
              <div class="my-3">
                <table>
                  <thead>
                    <tr>
                      <th scope="col" width="50px">Item</th>
                      <th scope="col" width="50px">Cantidad</th>
                      <th scope="col" width="50px">Dimensión</th>
                      <th scope="col" width="400px">Descripción</th>
                      <th scope="col" width="80px">P/U</th>
                      <th scope="col" width="80px">SubTotal</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(product, index) in quotation.products" :key="product.uuid">
                      <td data-label="Item"><span>{{ index + 1 }}</span></td>
                      <td data-label="Cantidad"><span>{{ product.quantity }}</span></td>
                      <td data-label="Dimensión">{{ product.dimension }}</td>
                      <td data-label="Descripción"><span class="h6 font-weight-bold text-uppercase">{{ product.name }}</span>
                        <div>
                          <span v-if="product.materialCheck">Material: {{ product.material }} </span>
                          <span v-if="product.qualityCheck">Calidad: {{ product.quality }} </span>
                          <span v-if="product.finishCheck">Acabado: {{ product.finish }} </span>
                          {{ product.description }}
                          <div v-if="product.images.length > 0">
                            <div class="thubnail" v-for="(image, index) in product.images" :key="image.id">
                              <img :src="image.path">
                            </div>
                          </div>
                        </div>
                      </td>
                      <td data-label="P/U">{{ product.price | currency }}</td>
                      <td data-label="SubTotal">{{ product.subtotal | currency }}</td>
                    </tr>
                  </tbody>
                </table>
                <div class="container">
                  <div class="row bg-secondary border border-top-0 border-dark">
                    <div class="col-md-3 ml-auto border text-center">
                      <div class="h4 font-weight-bold text-white">
                        SUBTOTAL (BS) &nbsp:
                      </div>
                    </div>
                    <div class="col-md-2 border text-center">
                      <div class="h4 font-weight-bold text-white">
                        {{ subTotal | currency }}
                      </div>
                    </div>
                  </div>

                  <div class="row bg-light border border-top-0 border-dark">
                    <div class="col-md-3 ml-auto border text-center">
                      <div class="h4 font-weight-bold">
                        DESCUENTO (BS) &nbsp: 
                      </div>
                    </div>
                    <div class="col-md-2 border text-center">
                      <div class="h4 font-weight-bold">
                        {{ quotation.discount | currency }}
                      </div>
                    </div>
                  </div>
                  
                  <div class="row bg-secondary border border-top-0 border-dark">
                    <div class="col-md-3 ml-auto border text-center">
                      <div class="h4 font-weight-bold text-white">
                        TOTAL (BS) &nbsp:
                      </div>
                    </div>
                    <div class="col-md-2 border text-center">
                      <div class="h4 font-weight-bold text-white">
                        {{ grandTotal | currency }}
                      </div>
                    </div>
                  </div>
                </div>
                <div class="details text-uppercase"><strong>Plazo de Entrega: </strong><span v-if="quotation.term">{{ quotation.term | formatDate('DD/MM/YYYY') }}</span><span v-else>S/D</span></div>
                <div class="details text-uppercase"><strong>Forma de Pago: </strong>{{ quotation.payment }}</div>
                <div class="details text-uppercase"><strong>Validez Cotización: </strong>{{ quotation.validity }}</div>
                <div class="details text-uppercase"><strong>Observación: </strong>{{ quotation.note }}</div>
              </div>
              <!-- <pre>{{ $data }}</pre> -->
            </fieldset>
          </div>
        </b-tab>
        <b-tab title="Arte Guía" :title-link-class="linkClass(1)" lazy>
          <grid-design @approved="quotation.state = 2" :quotation="quotation" />
        </b-tab>
        <b-tab title="Orden de Trabajo" :title-link-class="linkClass(2)" lazy>
          <work-order :quotation="quotation" />
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>
<script>
import permission from '../../mixins/permission'
import QuotationService from '../../services/quotation.service'
import formatter from '../../mixins/formatter'
import GridDesign from '../../components/quotation/GridDesign.vue'
import WorkOrder from '../../components/quotation/WorkOrder.vue'

export default {
  data () {
    return {
      loading: false,
      loadingPrint: false,
      quotation: null,
      id: this.$route.params.id,
      tabIndex: 0,
      text: `A dog is a type of domesticated animal.Known for its loyalty and faithfulness,it can be found as a welcome guest in many households across the world.`,
      customStyle:
        'background: #f3170000;border-radius: 4px;margin-bottom: 24px;border: 0;overflow: hidden',
    }
  },

  mixins: [formatter,permission],

  components: {
    'grid-design': GridDesign,
    'work-order': WorkOrder,
  },

  watch: {
    '$route' (to, from) {
      this.quotation = null
      this.id = this.$route.params.id
      this.showQuotation()
    }
  },

  computed: {
    subTotal() {
      let total = this.quotation.products.reduce((acc, item) => {
        return acc + Number(item.subtotal)
      }, 0)
      return total
    },

    grandTotal: function() {
      let total = (this.subTotal - this.toFloat(this.quotation.discount))
      return total
    }
  },

  created() {
    this.showQuotation()
    if (this.$route.query.tab) {
      this.tabIndex = Number(this.$route.query.tab)
    }
  },

  methods: {
    linkClass(idx) {
      if (this.tabIndex === idx) {
        return ['text-dark']
      } else {
        return ['text-danger']
      }
    },

    showQuotation: async function() {
      const response = await QuotationService.showQuotation(`quotations/${this.id}`)
      if (response.status === 200) {
        this.quotation = response.data.data;
      }
    },

    async printQuotation() {
      try {
        this.loadingPrint = true
        const response = await QuotationService.downloadQuotation(this.quotation.id)
        if (response.status === 200) {
          let file = new Blob([response.data], {type: 'application/pdf'})
          let fileUrl = URL.createObjectURL(file)
          window.open(fileUrl) 
          this.loadingPrint = false
        }
      } catch (err) {
        this.loadingPrint = false
      }
    },

    downloadQuotation: async function() {
      this.loading = true
      const response = await QuotationService.downloadQuotation(this.quotation.id)
      if (response.status === 200) {
        let blob = new Blob([response.data])
        let link = document.createElement('a')
        link.href = window.URL.createObjectURL(blob)
        link.download = `${this.quotation.cite}.pdf`
        link.click()
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
.ant-collapse {
  background: #ffffff;
}

.br-content {
  background-color: #91a1ad;
  font-size: 1.1em;
  font-weight: bold;
}

fieldset {
  background-color: #e9e4e6;
  border-radius: 4px;
}

legend {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  font-size: 17px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}

.details {
  border: 1px solid #000; 
  border-top: none;
  padding: 8px;
}

.thubnail img {
  float: left;
  width:50%;
  box-sizing: border-box;
  padding: 0.2em;
  height: 200px;
}

table {
  border-collapse: collapse;
  width: 100%;
}

table th,
table td {
  border: 1px solid #807979;
  padding: 0.625em;
  text-align: center;
  font-weight: bold;
}

table tbody tr {
  background-color: #f2f4f8;
  border: 1px solid #ddd;
  padding: 0.35em;
  font-size: 0.90em;
}

table tr:nth-child(even){background-color: #f2f2f2;}

table tr:hover {background-color: #ececec;}

table thead th {
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #9e0207;
  color: white;
  text-transform: uppercase;
  font-size: 0.85em;
}

@media screen and (max-width: 800px) {
  .thubnail img {
    display: none;
  }

  table {
    border: 0;
  }

  table caption {
    font-size: 1.3em;
  }

  table thead {
    border: none;
    clip: rect(0 0 0 0);
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
  }

  table tr {
    border-bottom: 3px solid #ddd;
    display: block;
    margin-bottom: 0.625em;
  }

  table td {
    border-bottom: 1px solid #ddd;
    display: block;
    font-size: 0.8em;
    text-align: right;
  }

  table td::before {
    content: attr(data-label);
    float: left;
    font-weight: bold;
    text-transform: uppercase;
  }

  table td:last-child {
    border-bottom: 0;
  }
}
</style>