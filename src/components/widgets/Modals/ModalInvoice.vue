<template>
  <b-modal
    v-model="visible"
    :header-bg-variant="'secondary'"
    size="xl"
    no-close-on-backdrop
    no-close-on-esc
    hide-footer
    scrollable
  >
    <template v-slot:modal-header="{ close }">
      <h5 class="text-white">{{ title }}</h5>
      <b-button squared size="sm" variant="outline-danger" @click="onClose">X</b-button>
    </template>
    <a-spin v-if="invoiceItem" :spinning="loading">
<!--       <div class="d-flex justify-content-end">
        <b-button
          @click="backToList"
          size="sm"
          variant="danger" 
          class="float-right mr-2"
        >Volver <i class="fa fa-arrow-left" aria-hidden="true"></i>
        </b-button>
      </div> -->
      <div class="invoice-box">
        <div id="light-table">
          <div id="leftdivcontainer" class="clearfix">
            <div class="leftdiv">
              <img src="resources/images/logo.png" style="width:280px; height: 70px;"/>
            </div>
            <div class="leftdiv" style="margin-top: 0;">
              <p class="address" style="color: #656565;">
                <span style="font-size: 18px; font-weight: bold;">{{ invoiceItem.license.office.address[0] }}</span>
                <span>{{ invoiceItem.license.office.address[1] }}</span>
                <span>{{ invoiceItem.license.office.address[2] }}</span>
                <span>{{ invoiceItem.license.office.address[3] }}</span>
                <span>{{ invoiceItem.license.office.address[4] }}</span>
              </p>
            </div>
            <div class="leftdiv" style="border: 2px solid #9e0207; border-radius: 7px;">
              <div style="text-align: left; margin-left: 15px; margin-bottom: 5px; margin-top: 5px;">
                <div style="color: #474747; font-weight: bold;">
                  NIT: <span style="float: right; margin-right: 15px;">{{ invoiceItem.license.nit }}</span>
                </div>
                <div style="color: #474747; font-weight: bold;">
                  FACTURA Nº: <span style="float: right; margin-right: 15px;">{{ invoiceItem.number ? invoiceItem.number : invoiceItem.license.starting_number }}</span>
                </div>
                <div style="color: #474747; font-weight: bold;">
                  Autorización Nº: <span style="float: right; margin-right: 15px; color: #000000; font-weight: bold;">{{ invoiceItem.license.authorization }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div id="light-table" style="margin-top: 30px;">
          <div id="leftdivcontainer" class="clearfix">
            <div class="leftdiv">
              &nbsp;<h1 v-if="invoiceItem.state_data.title == 'ANULADO'">{{ invoiceItem.state_data.title }}</h1>
            </div>
            <div class="leftdiv" style="margin-top: 20px;">
              <span style="font-size: 55px; font-weight: bold;">FACTURA</span>
            </div>
            <div class="leftdiv">
              <p class="activity">
                <span style="color: #000000;">Actividad - {{ invoiceItem.license.activity }}</span>
                <span style="font-size: 18px; font-weight: bold; color: #474747; letter-spacing: 0.3em;">{{ type }}</span>
              </p>
            </div>
          </div>
        </div>
        <div id="light-table" style="margin-top: 20px; color: #000000;">
          <div style="border: 2px solid #9e0207; border-radius: 7px;">
            <div style="float: right; margin: 15px;"><b>NIT/CI: {{ invoiceItem.customer_data.nit }}</b></div>
            <div style="margin: 15px;">{{ invoiceItem.license.office.city }}, {{ invoiceItem.date | formatDate('DD MMMM YYYY') }}</div>
            <div style="margin: 15px;">Señor(es): {{ invoiceItem.customer_data.business_name }}</div>
          </div>
        </div>
        <div id="light-table" style="margin-top: 5px;">
          <table id="invoice-table">
            <tr class="invoice_line" style="background-color: #FFDBDC;">
              <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">CANTIDAD</th>
              <th style="color: #9e0207; letter-spacing: 0.5em; padding:10px; width: 340px; font-weight: bold; font-size: 20px;">DETALLE</th>
              <th style="color: #9e0207; padding:10px; width: 100px; font-weight: bold; font-size: 20px;">P. UNIT.</th>
              <th style="color: #9e0207; padding:10px; width: 120px; font-weight: bold; font-size: 20px;">SUB TOTAL</th>
            </tr>
            <tr v-for="(product, index) in invoiceItem.products" :key="index" class="invoice_line" style="text-align: center;">
              <td style="color: #000000; font-size: 15px;">
                 <div v-if="index === 0 && invoiceItem.title" style="margin-bottom: 8px;">&nbsp;</div>
                {{ product.quantity }}
              </td>
              <td style="color: #000000; text-align: justify; font-size: 15px;">
                <div v-if="index === 0 && invoiceItem.title" style="color: #000000; margin-bottom: 8px;">{{ invoiceItem.title }}:</div>
                {{ product.description }}
              </td>
              <td style="color: #000000; font-size: 15px;">
                <div v-if="index === 0 && invoiceItem.title" style="margin-bottom: 8px;">&nbsp;</div>
                {{ product.price }}
              </td>
              <td style="color: #000000; font-size: 15px;">
                <div v-if="index === 0 && invoiceItem.title" style="margin-bottom: 8px;">&nbsp;</div>
                {{ product.subtotal | currency }}
              </td>
            <tr>
              <td>&nbsp;</td>
              <td style="color: #000000; text-align: justify; font-size: 15px;">&nbsp;
                <div v-if="invoiceItem.footer" style="margin-left: 2px;">{{ invoiceItem.footer }}</div>
                <div v-if="invoiceItem.details" style="margin-left: 2px;">
                  <div v-for="(detail, index) in invoiceItem.details" :key="index" style="margin-right: 12px; display: inline-block; padding: 2px;">
                    {{ detail.description }}
                  </div>
                </div>
              </td>
              <td>&nbsp;</td>
              <td>&nbsp;</td>
            </tr>
            <tr class="invoice_line">
              <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 20px; font-weight: bold; padding:16px;">TOTAL Bs.</td>
              <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 16px; color: #000000; font-weight: bold; padding:16px; background: #FFDBDC;">{{ invoiceItem.total | currency }}</td>
            </tr>
          </table>
        </div>
        <div id="light-table">
          <div style="border: 2px solid #9e0207; border-radius: 7px; color: black;">
            <div style="margin: 12px;"><b>Son:</b> {{ invoiceItem.total | toLetters }}</div>
          </div>
        </div>
        <div v-if="invoiceItem.control_code" id="light-table" style="margin-top: 5px; margin-left: 10px; color: black;">
          <div style="float: right; margin-top: 7px; margin-right: 10px;"><qr-code :text="invoiceItem.qr" :size="100"></qr-code></div>
          <div><b>Código de Control: &nbsp;&nbsp; {{ invoiceItem.control_code }}</b></div>
          <div><b>Fecha Límite de Emisión: &nbsp;</b>{{ invoiceItem.license.deadline }}</div>
          <div style="margin-top: 10px; font-size: 11px; letter-spacing: 0.1em;">"ESTA FACTURA CONTRIBUYE AL DESARROLLO DEL PA&Iacute;S, EL USO IL&Iacute;CITO DE &Eacute;STA SER&Aacute; SANCIONADO DE ACUERDO A LEY."</div>
          <div style="font-size: 11px; color: black;">
            <strong>{{ invoiceItem.license.legend }}</strong>
          </div>
        </div>
      </div>
      <div v-if="invoiceItem.id" class="row my-2">
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
        </div>
        <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          <b-button
            variant="dark"
            @click="downloadInvoice" 
            class="float-right mr-2"
          ><i class="fa fa-download" aria-hidden="true"></i></b-button>
          <b-button
            @click="printInvoice"
            class="float-right mr-2"
          ><i class="fa fa-print" aria-hidden="true"></i></b-button>
          <b-button
            @click="flag = !flag"
            :variant="flag ? 'success' : 'warning'"
            class="float-right mr-2"
          >
            <i v-if="flag" class="fa fa-toggle-on" aria-hidden="true"></i>
            <i v-else class="fa fa-toggle-off" aria-hidden="true"></i>
            {{ flag ? 'ORIGINAL' : 'COPIA' }}
          </b-button>
        </div>
      </div>
    </a-spin>
  </b-modal>
</template>
<script>
import InvoiceService from '../../../services/invoice.service'

export default {
  props: {
    invoice: Object,
    visible: Boolean,
    title: String,
  },

  data() {
    return {
      loading: false,
      flag: true,
      type: 'ORIGINAL',
      columns: [
        { key: 'number', label: 'número'},
        { key: 'date', label: 'fecha'},
        { key: 'total', label: 'total'},
        'opciones',
      ],
      popoverShow: false,
      checkList: true,
      checkInvoice: false,
      invoiceItem: this.invoice,
      checkformOrList: false,
    }
  },

  watch: {
    flag: function (value) {
      if (value) {
        this.type = 'ORIGINAL'
      } else {
        this.type = 'COPIA'
      }
    },

    visible(val) {
      if (!val) { this.flag = true}
    }
  },

  created() {
    this.$bus.$on('getCheckInvoice', (data) => {
      // this.checkformOrList = true
      // this.checkList = false
      this.invoiceItem = data
      // this.checkInvoice = true
      // console.log(1)
    })
  },

  methods: {
    backToList() {
      if (this.checkformOrList) {
        this.$emit('open-modal-form')
      } else {
        this.checkInvoice = false
        this.checkList = true
      }
      this.checkformOrList = false
    },

    setFormInvoice(flag) {
      this.$emit('set-invoice-form', flag)
    },

    getCheckInvoice(row) {
      this.checkList = false
      this.invoiceItem = row.item
      this.checkInvoice = true
    },

    async printInvoice() {
      try {
        this.loading = true
        const response = await InvoiceService.downloadInvoice(this.invoiceItem.id, this.type)
        if (response.status === 200) {
          let file = new Blob([response.data], {type: 'application/pdf'})
          let fileUrl = URL.createObjectURL(file)
          window.open(fileUrl) 
          this.loading = false
          // window.print()
        }
      } catch (err) {
        this.loading = false
      }
    },

    async downloadInvoice() {
      try {
        this.loading = true
        const response = await InvoiceService.downloadInvoice(this.invoiceItem.id, this.type)
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Factura.pdf'
          link.click()
          this.loading = false
        }
      } catch (err) {
        this.loading = false
      }
    },

    onClose() {
      this.$emit("hide")
    }
  }
}
</script>
<style scoped>
.invoice-box {
  max-width: 100%;
  margin: auto;
  padding: 30px;
  /*border: 1px solid #eee;
  box-shadow: 0 0 10px rgba(0, 0, 0, .15);*/
  font-size: 16px;
  line-height: 24px;
  font-family: 'Helvetica Neue', 'Helvetica', Helvetica, Arial, sans-serif;
  color: #555;
}

#light-table {
  width: 100%;  
  padding-top: 0;
  padding-bottom: 0;
  text-align: left;
}

.leftdiv {
  float: left;
  position: relative;
  width: 33%; 
}

.leftdiv p {
  display: block;
  width: 75%;
  margin: 0 auto !important;
}

#leftdivcontainer {
  vertical-align: middle;
  width: 100%;
  text-align: center;
}

.clearfix:after {
  clear: both;
}

.clearfix:before,
.clearfix:after {
  content: " ";
  display: table;
}

.address span {
  display: block;
  white-space: pre;
  font-size:   10pt;
  line-height: 12pt;
}

.activity span {
  display: block;
  font-size:   10pt;
  line-height: 23pt;
}

#invoice-table {
  border: 2px solid #9e0207;
  border-radius: 7px;
  border-spacing: 0;
  box-sizing: border-box;
  clear: both;
  margin: 2mm 0mm;
  height: 190mm;
  width: 100%;
}

#invoice-table th, td { border-left: 2px solid #9e0207; }
#invoice-table th:first-child, td:first-child { border-left: none; }
#invoice-table th { border-bottom: 2px solid #9e0207; }
#invoice-table td { vertical-align: top; font-size: 8pt; }
th { text-align: center; font-weight: normal; }
.amount { text-align: center; }
.invoice_line { height: 6mm; }
.invoice_line td, .invoice_line th { padding: 1mm; }
</style>