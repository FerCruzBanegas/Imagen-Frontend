<template>
  <vue-custom-scrollbar :style="{ width: '100%' }">
    <table>
      <thead>
        <tr>
          <th width="50px">Fecha</th>
          <th width="40px">Compr</th>
          <th width="50px">Num</th>
          <th width="350px">Detalle</th>
          <th width="100px">Debe</th>
          <th width="80px">Haber</th>
          <th width="80px">Saldo</th>
        </tr>
      </thead>
      <tbody>
        <template v-for="(item, index) in items" >
          <tr :key="index" style="background-color: #f7d9d9;" >
            <td>{{ item.date | formatDate('DD/MM/YYYY') }}</td>
            <td>{{ item.type }}</td>
            <td>{{ item.number }}</td>
            <td>{{ item.summary }}</td>
            <td>{{ item.total }}</td>
            <td></td>
            <td>{{ item.total }}</td>
          </tr>
          <tr v-for="(payment, index) in item.payments" :key="item.id+index" style="background-color: #f9f3f3;">
            <td>{{ payment.date | formatDate('DD/MM/YYYY') }}</td>
            <td>{{ payment.type }}</td>
            <td>01</td>
            <td>asas</td>
            <td></td>
            <td>{{ payment.amount }}</td>
            <td></td>
          </tr>
          <tr :key="'total'+item.id+index" style="background-color: #dddddd;">
            <td colspan="4" style="text-align: right;">
              TOTAL
            </td>
            <td></td>
            <td>ssdsd</td>
            <td></td>
          </tr>
        </template>
        <!-- <tr style="background-color: #fff1d1;">
          <td>13/02/2021</td>
          <td>
            Factura
          </td>
          <td>
            12
          </td>
          <td>
            Alq. Publi Av. Cristo Redentor Cara A-B del 01/02/2020 al 01/03/2021
          </td>
          <td>
            8,120.00
          </td>
          <td></td>
          <td>8,120.00</td>
        </tr>
        <tr style="background-color: #efefef;">
          <td>15/02/2021</td>
          <td>
            Cheque
          </td>
          <td>
            001
          </td>
          <td>
            Pagado en deposito
          </td>
          <td></td>
          <td>8,000.00</td>
          <td></td>
        </tr>
        <tr style="background-color: #efefef;">
          <td>15/02/2021</td>
          <td>
            Cheque
          </td>
          <td>
            001
          </td>
          <td>
            Pagado en deposito
          </td>
          <td></td>
          <td>120.00</td>
          <td></td>
        </tr>
        <tr style="background-color: #c5d7ff;">
          <td colspan="4" style="text-align: right;">
            TOTAL
          </td>
          <td></td>
          <td>8,120.00</td>
          <td>0.00</td>
        </tr>
        <tr style="background-color: #fff1d1;">
          <td>13/02/2021</td>
          <td>
            Factura
          </td>
          <td>
            12
          </td>
          <td>
            Alq. Publi Av. Cristo Redentor Cara A-B del 01/02/2020 al 01/03/2021
          </td>
          <td>
            8,120.00
          </td>
          <td></td>
          <td>8,120.00</td>
        </tr>
        <tr style="background-color: #efefef;">
          <td>15/02/2021</td>
          <td>
            Cheque
          </td>
          <td>
            001
          </td>
          <td>
            Pagado en deposito
          </td>
          <td></td>
          <td>8,000.00</td>
          <td></td>
        </tr>
        <tr style="background-color: #efefef;">
          <td>15/02/2021</td>
          <td>
            Cheque
          </td>
          <td>
            001
          </td>
          <td>
          </td>
          <td></td>
          <td>120.00</td>
          <td></td>
        </tr>
        <tr style="background-color: #c5d7ff;">
          <td colspan="4" style="text-align: right;">
            TOTAL
          </td>
          <td></td>
          <td>8,120.00</td>
          <td>0.00</td>
        </tr> -->
      </tbody>
    </table>
  </vue-custom-scrollbar>
</template>

<script>
import vueCustomScrollbar from 'vue-custom-scrollbar'

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

  components: {
    vueCustomScrollbar
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