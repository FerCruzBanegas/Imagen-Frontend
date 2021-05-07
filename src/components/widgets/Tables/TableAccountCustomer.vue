<template>
  <vue-custom-scrollbar :style="{ width: '100%' }">
    <table>
      <thead>
        <tr>
          <th width="50px">Fecha</th>
          <th width="40px">Compr</th>
          <th width="50px">Num/Op</th>
          <th width="350px">Detalle</th>
          <th width="100px">Debe</th>
          <th width="80px">Haber</th>
          <th width="80px">Saldo</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in items" >
          <tr :key="'voucher'+item.id+index" style="background-color: #f7d9d9;" >
            <td>{{ item.date | formatDate('DD/MM/YYYY') }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.number }}</td>
            <td>{{ item.summary }}</td>
            <td>{{ item.total | currency }}</td>
            <td></td>
            <td>{{ item.total | currency }}</td>
          </tr>
          <tr v-for="(payment, index) in item.payments" :key="'payment'+item.id+index" style="background-color: #f9f3f3;">
            <td>{{ payment.date | formatDate('DD/MM/YYYY') }}</td>
            <td>{{ payment.type }}</td>
            <td>{{ payment.code }}</td>
            <td>{{ payment.summary }}</td>
            <td></td>
            <td>{{ payment.amount | currency }}</td>
            <td></td>
          </tr>
          <tr :key="'total'+item.id+index" style="background-color: #dddddd;">
            <td colspan="4" style="text-align: right;">
              TOTAL
            </td>
            <td></td>
            <td>{{ subTotal(item.payments) | currency }}</td>
            <td></td>
          </tr>
        </template>
        <tr style="background: #5e6267; color: #fff;">
          <td colspan="4"></td>
          <td>{{ totalInvoices | currency }}</td>
          <td>{{ totalPayments | currency }}</td>
          <td>{{ grandTotal | currency }}</td>
        </tr>
      </tbody>
    </table>
  </vue-custom-scrollbar>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'
import formatter from '../../../mixins/formatter'

export default {
  props: {
    items: {
      type: Array
    },
  },

  data() {
    return {
      settings: {
        suppressScrollY: true,
        suppressScrollX: true,
        wheelPropagation: true
      }
    }
  },

  computed: {
    totalPayments() {
      let items = this.items.map(item => item.payments).flat()
      let total = items.reduce((acc, item) => {
        return acc + Number(this.toFloat(item.amount))
      }, 0)

      return isNaN(total) ? 0 : total
    },

    totalInvoices() {
      let total = this.items.reduce((acc, item) => {
        return acc + Number(this.toFloat(item.total))
      }, 0)

      return isNaN(total) ? 0 : total
    },

    grandTotal() {
      let total = (this.totalInvoices - this.totalPayments)
      return total
    }
  },

  mixins: [formatter],

  components: {
    vueCustomScrollbar
  },

  methods: {
    subTotal(payments) {
      let total = payments.reduce((acc, item) => {
        return acc + Number(this.toFloat(item.amount))
      }, 0)

      return isNaN(total) ? 0 : total
    },
  },
}
</script>
<style scoped>
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
    border: 1px solid #ddd;
    padding: 0.35em;
    font-size: 0.70em;
  }

  table thead th {
    padding-top: 6px;
    padding-bottom: 6px;
    background-color: #9e0207;
    color: white;
    text-transform: uppercase;
    font-size: 0.85em;
  }
</style>