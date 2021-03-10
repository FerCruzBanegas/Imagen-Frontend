<template>
  <fieldset class="fieldset col-sm-12 col-md-12 col-lg-12 col-xl-12 text-left">
    <legend>Datos Cotización:</legend>
    <div class="container">
      <div class="row bg-secondary">
        <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border border-light">
          <div class="d-flex justify-content-between my-2">
            <span class="text-white font-weight-bold">Registrado:</span>
            <span class="text-white font-weight-bold">{{ templateArgs.quotation_data.created | formatDate('DD/MM/YYYY') }}</span>
          </div>
        </div>
        <div class="col-sm-6 col-md-6 col-lg-6 col-xl-6 border border-light">
          <div class="d-flex justify-content-between my-2">
            <span class="text-white font-weight-bold">Actualizado:</span>
            <span class="text-white font-weight-bold">{{ templateArgs.quotation_data.updated | formatDate('DD/MM/YYYY') }}</span>
          </div>
        </div>
      </div>
      <div class="row bg-light border border-secondary">
        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <div class="font-weight-bold py-2"><span class="text-dark">CLIENTE: </span>{{ templateArgs.customer_data.business_name }}</div>
        </div>
        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <div class="font-weight-bold py-2"><span class="text-dark">NIT: </span>{{ templateArgs.customer_data.nit }}</div>
        </div>
        <div class="col-sm-6 col-md-4 col-lg-4 col-xl-4">
          <div class="font-weight-bold py-2"><span class="text-dark">SUCURSAL: </span>{{ templateArgs.quotation_data.office }}</div>
        </div>
      </div>
    </div>
    <div class="d-flex justify-content-start pt-3"><div class="text-dark font-weight-bold">PRODUCTOS / SERVICIOS</div></div>
    <div class="row">
      <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
        <div class="mb-2">
          <table>
            <thead>
              <tr>
                <th scope="col" width="30px">Item</th>
                <th scope="col" width="60px">Cantidad</th>
                <th scope="col" width="70px">Dimensión</th>
                <th scope="col" width="320px">Descripción</th>
                <th scope="col" width="80px">P/U</th>
                <th scope="col" width="80px">SubTotal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(product, index) in templateArgs.quotation_data.products" :key="product.uuid">
                <td data-label="Item"><span>{{ index + 1 }}</span></td>
                <td data-label="Cantidad"><span>{{ product.quantity }}</span></td>
                <td data-label="Dimensión">{{ product.dimension }}</td>
                <td data-label="Descripción"><span class="h6 font-weight-bold text-uppercase">{{ product.name }}</span>
                  <div>
                    <span v-if="product.materialCheck">Material: {{ product.material }} </span>
                    <span v-if="product.qualityCheck">Calidad: {{ product.quality }} </span>
                    <span v-if="product.finishCheck">Acabado: {{ product.finish }} </span>
                    {{ product.description }}
                  </div>
                </td>
                <td data-label="P/U">{{ product.price | currency }}</td>
                <td data-label="SubTotal">{{ product.subtotal | currency }}</td>
              </tr>
              <tr>
                <td colspan="4"></td>
                <td>SUBTOTAL (BS):</td>
                <td>{{ subTotal | currency }}</td>
              </tr>
              <tr>
                <td colspan="4"></td>
                <td>DESCUENTO (BS):</td>
                <td>{{ templateArgs.quotation_data.discount | currency }}</td>
              </tr>
              <tr>
                <td colspan="4"></td>
                <td>TOTAL (BS):</td>
                <td>{{ grandTotal | currency }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </fieldset>
</template>
<script>
  import formatter from '../../mixins/formatter'
  
  export default {
    name: 'detail',

    mixins: [formatter],

    data () {
      return {
        templateArgs: {}
      }
    },

    computed: {
      subTotal() {
        let total = this.templateArgs.quotation_data.products.reduce((acc, item) => {
          return acc + Number(item.subtotal)
        }, 0)
        return total
      },

      grandTotal: function() {
        let total = (this.subTotal - this.toFloat(this.templateArgs.quotation_data.discount))
        return total
      }
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
  border: 1px solid #80797d;
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