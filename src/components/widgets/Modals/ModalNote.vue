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
    <div>
      <a-spin v-if="note" :spinning="loading">
        <div class="invoice-box">
            <div id="light-table">
            <div id="leftdivcontainer" class="clearfix">
                <div class="leftdiv">
                <img src="resources/images/logo.png" style="width:280px; height: 70px;">
                </div>
                <div class="leftdiv" style="margin-top: 0;">
                <p class="test" style="color: #656565;">
                  <span style="font-size: 18px; font-weight: bold;">{{ note.voucher.office.address[0] }}</span>
                  <span>{{ note.voucher.office.address[1] }}</span>
                  <span>{{ note.voucher.office.address[2] }}</span>
                  <span>{{ note.voucher.office.address[3] }}</span>
                  <span>{{ note.voucher.office.address[4] }}</span>
                </p>
                </div>
                <div class="leftdiv" style="border: 2px solid #9e0207; border-radius: 7px;">
                <div style="text-align: left; margin-left: 15px; margin-bottom: 5px; margin-top: 5px;">
                    <div style="color: #474747; font-weight: bold;">
                    NIT: <span style="float: right; margin-right: 15px;">164692025</span>
                    </div>
                    <div style="color: #474747; font-weight: bold;">
                    Nº: <span style="float: right; margin-right: 15px;">{{ note.number ? note.number : note.voucher.starting_number }}</span>
                    </div>
                </div>
                </div>
            </div>
            </div>
            <div style="width: 500px; margin: 50px auto; margin-bottom: 0; text-align: center;">
              <span style="font-size: 45px; font-weight: bold;">NOTA DE REMISION</span>
            </div>
            <div v-if="!note.accounts" class="text-dark"><b>(NO CONTABILIZADO)</b></div>
            <div id="light-table" style="color: #000000;">
              <div style="border: 2px solid #9e0207; border-radius: 7px;">
                <div style="float: right; margin: 15px;"><b>NIT/CI: {{ note.customer_data.nit }}</b></div>
                <div style="margin: 15px;">{{ note.voucher.office.name }}, {{ note.date | formatDate('DD MMMM YYYY') }}</div>
                <div style="margin: 15px;">Señor(es): {{ note.customer_data.business_name }}</div>
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
                <tr v-for="(product, index) in note.products" :key="index" class="invoice_line" style="text-align: center;">
                    <td style="color: #000000; font-size: 15px;">
                    {{ product.quantity }}
                    </td>
                    <td style="color: #000000; text-align: justify; font-size: 15px;">
                    {{ product.description }}
                    </td>
                    <td style="color: #000000; font-size: 15px;">
                    {{ product.price }}
                    </td>
                    <td style="color: #000000; font-size: 15px;">
                    {{ product.subtotal | currency }}
                    </td>
                </tr>
                <tr>
                <td>&nbsp;</td>
                <td style="color: #000000; text-align: justify; font-size: 15px;">&nbsp;
                </td>
                <td>&nbsp;</td>
                <td>&nbsp;</td>
                </tr>
                <tr class="invoice_line">
                <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 17px; font-weight: bold; padding:8px;">SUBTOTAL</td>
                <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 16px; color: #000000; font-weight: bold; padding:8px; background: #FFDBDC;">{{ note.subtotal | currency }}</td>
                </tr>
                <tr class="invoice_line">
                <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 17px; font-weight: bold; padding:8px;">DESCUENTO</td>
                <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 16px; color: #000000; font-weight: bold; padding:8px;">{{ note.discount }}</td>
                </tr>
                <tr class="invoice_line">
                <td colspan="3" style="text-align: right; border-top: 2px solid #9e0207; color: #474747; font-size: 20px; font-weight: bold; padding:16px;">TOTAL Bs.</td>
                <td style="text-align: center; border-top: 2px solid #9e0207; font-size: 16px; color: #000000; font-weight: bold; padding:16px; background: #FFDBDC;">{{ note.total | currency }}</td>
                </tr>
              </table>
            </div>
            <div id="light-table">
              <div style="border: 2px solid #9e0207; border-radius: 7px; color: black;">
                <div style="margin: 12px;"><b>Son:</b> {{ note.total | toLetters }}</div>
              </div>
              <div style="color: black;"><b>Nota:</b> Este documento no es válido para crédito fiscal.</div>
            </div>
            <div class="wrap">
                <div class="left">AUTORIZADO POR</div>
                <div class="right">CLIENTE</div>
            </div>
        </div>
        <div v-if="note.id" class="row my-2">
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
          </div>
          <div class="col-12 col-md-12 col-lg-6 col-xl-6">
            <b-button
              variant="dark"
              @click="downloadNote" 
              class="float-right mr-2"
            ><i class="fa fa-download" aria-hidden="true"></i></b-button>
            <b-button
              @click="printNote"
              class="float-right mr-2"
            ><i class="fa fa-print" aria-hidden="true"></i></b-button>
          </div>
        </div>
      </a-spin>
    </div>
  </b-modal>
</template>
<script>
import NoteService from '../../../services/note.service'

export default {
  props: {
    note: Object,
    visible: Boolean,
    title: String
  },

  data() {
    return {
      loading: false,
    }
  },

  methods: {
    async printNote() {
      try {
        this.loading = true
        const response = await NoteService.downloadNote(this.note.id)
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

    async downloadNote() {
      try {
        this.loading = true
        const response = await NoteService.downloadNote(this.note.id)
        if (response.status === 200) {
          let blob = new Blob([response.data])
          let link = document.createElement('a')
          link.href = window.URL.createObjectURL(blob)
          link.download = 'Nota.pdf'
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
  font-size: 16px;
  line-height: 24px;
  font-family: 'Ubuntu', sans-serif;
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

.test span {
  display: block;
  white-space: pre;
  font-size:   10pt;
  line-height: 12pt;
}

#invoice-table {
  border: 2px solid #9e0207;
  border-radius: 7px;
  border-spacing: 0;
  box-sizing: border-box;
  clear: both;
  margin: 2mm 0mm;
  height: 200mm;
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

.watermark {
  background: url("{{ asset('/img/watermark.png') }}");
  background-size: 600px;
  background-repeat: no-repeat;
  background-position: center;
  background-attachment: fixed; 
}

.wrap {
  margin-top: 30px;
  text-align: center;
  width: auto;
}

.left, .right {
  display: inline-block;
  margin: 40px;
  margin-bottom: 0;
  border-top: 1px solid #000; 
  text-align: center;
  font-weight: bold;
  width: 300px;
}
</style>