<template>
  <div>
    <div class="d-flex justify-content-between">
      <div class="font-weight-bold">
        Precios representados en bolivianos (Bs).
      </div>
      <div v-if="permission('costs.update')" class="font-weight-bold">
        <b-button v-if="item.active === 1" size="sm" variant="success" class="my-2 active" disabled>
          <i class="fe fe-check-circle"/> Predeterminado
        </b-button>
        <a-popconfirm
          v-else
          placement="left"
          title="Marcar este costo como predeterminado?"
          ok-text="Si"
          cancel-text="No"
          @confirm="active(item.id)"
        >
          <a-button class="my-2" icon="question-circle" type="primary">Activar Costo</a-button>
        </a-popconfirm>
      </div>
    </div>
    <div class="title">MATERIALES</div>
    <table>
      <thead>
        <tr>
          <th scope="col" width="10px">Item</th>
          <th scope="col" width="100px">Descripción</th>
          <th scope="col" width="50px">Unidad</th>
          <th scope="col" width="50px">Cantidad</th>
          <th scope="col" width="80px">Precio productivo</th>
          <th scope="col" width="72px">Costo total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(material, index) in item.materials" :key="index">
          <td data-label="Item">{{ index + 1 }}</td>
          <td data-label="Descripción">{{ material.name }}</td>
          <td data-label="Unidad">{{ material.unity }}</td>
          <td data-label="Cantidad">{{ material.quantity }}</td>
          <td data-label="Precio productivo">{{ material.price | currency }}</td>
          <td data-label="Costo total">{{ material.total | currency }}</td>
        </tr>
      </tbody>
    </table>
    <div class="container text-center">
      <div class="row bg-light border border-top-0 border-dark">
        <div class="col-md-3 ml-auto border">
          <div class="h5 font-weight-bold pt-2">Total materiales &nbsp:</div>
        </div>
        <div class="col-md-2 borderr">
          <div class="h5 font-weight-bold pt-2">{{ totalMaterials | currency }}</div>
        </div>
      </div>
    </div>
    <div class="title">MANO DE OBRA</div>
    <table>
      <thead>
        <tr>
          <th scope="col" width="10px">Item</th>
          <th scope="col" width="100px">Descripción</th>
          <th scope="col" width="50px">Cantidad (hrs)</th>
          <th scope="col" width="80px">Precio productivo</th>
          <th scope="col" width="62px">Costo total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="(worker, index) in item.workers" :key="index">
          <td data-label="Item">{{ index + 1 }}</td>
          <td data-label="Descripción">{{ worker.description }}</td>
          <td data-label="Cantidad">{{ worker.quantity }}</td>
          <td data-label="Precio productivo">{{ worker.price | currency}}</td>
          <td data-label="Costo total">{{ worker.total | currency}}</td>
        </tr>
      </tbody>
    </table>
    <div class="container text-center">
      <div class="row bg-light border border-top-0 border-dark">
        <div class="col-md-3 ml-auto border">
          <div class="h5 font-weight-bold pt-2">Total mano de obra &nbsp:</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ totalWorkers | currency }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row bg-secondary">
        <div class="col-md-6">
          <span class="h5 text-white font-weight-bold">EQUIPO, MAQUINARIA Y HERRAMIENTAS</span>
        </div>
      </div>
      <div class="row bg-light border border-top-0 border-dark text-center">
        <div class="col-md-2 ml-auto border">
          <div class="h5 font-weight-bold pt-2">Costo total &nbsp:</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ item.tool }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row bg-secondary">
        <div class="col-md-6">
          <span class="h5 text-white font-weight-bold">GASTOS GENERALES Y ADMINISTRATIVOS</span>
        </div>
      </div>
      <div class="row bg-light border border-top-0 border-dark text-center">
        <div class="col-md-2 ml-auto border">
          <div class="h5 font-weight-bold pt-2">Costo total &nbsp:</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ item.admin_expense }}%</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ avg1 | currency }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row bg-secondary">
        <div class="col-md-6">
          <span class="h5 text-white font-weight-bold">UTILIDAD</span>
        </div>
      </div>
      <div class="row bg-light border border-top-0 border-dark text-center">
        <div class="col-md-2 ml-auto border">
          <div class="h5 font-weight-bold pt-2">Costo total &nbsp:</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ item.utility }}%</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ avg2 | currency }}</div>
        </div>
      </div>
    </div>
    <div class="container">
      <div class="row bg-secondary">
        <div class="col-md-6">
          <span class="h5 text-white font-weight-bold">IMPUESTOS</span>
        </div>
      </div>
      <div class="row bg-light border border-top-0 border-dark text-center">
        <div class="col-md-2 ml-auto border">
          <div class="h5 font-weight-bold pt-2">Costo total &nbsp:</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ item.tax }}%</div>
        </div>
        <div class="col-md-2 border">
          <div class="h5 font-weight-bold pt-2">{{ avg3 | currency }}</div>
        </div>
      </div>
    </div>
    <div class="container text-center">
      <div class="row border border-top-0 border-dark">
        <div class="col-md-3 ml-auto border">
          <div class="h4 font-weight-bold pt-2">TOTAL PRECIO &nbsp:</div>
        </div>
        <div class="col-md-2 border" style="background: #FFB3B3;">
          <div class="h5 font-weight-bold pt-2">{{ total | currency }}</div>
        </div>
      </div>
      <div class="row border border-top-0 border-dark">
        <div class="col-md-3 ml-auto border">
          <div class="h4 font-weight-bold pt-2">TOTAL (MT2)&nbsp:</div>
        </div>
        <div class="col-md-2 border" style="background: #9e0207;">
          <div class="h5 text-white font-weight-bold pt-2">{{ totalMt2 | currency }}</div>
        </div>
      </div>
    </div>
    <div class="container text-center text-white">
      <div class="row bg-secondary justify-content-between border border-top-0 border-dark">
        <div class="col-md-4 h5 font-weight-bold pt-2">PRECIO NORMAL&nbsp: {{ item.normal_price }}</div>
        <div class="col-md-4 h5 font-weight-bold pt-2">PRECIO VOLUMEN&nbsp: {{ item.volume_price }}</div>
      </div>
    </div>
  </div>
</template>
<script>
import permission from '../../../mixins/permission'
import CostService from '../../../services/cost.service'
import formatter from '../../../mixins/formatter'
export default {
  props: {
    item: {
      type: Object
    },
    dimension: {
      type: String
    },
  },

  data() {
    return {
      loading: false,
      popoverShow: false,
    }
  },

  mixins: [formatter, permission],

  computed: {
    totalMaterials() {
      let total = this.item.materials.reduce((acc, item) => {
        let val = Number(this.toFloat(item.quantity)) * Number(this.toFloat(item.price))
        item.total = val
        return acc + val
      }, 0)
      return isNaN(total) ? 0 : total
    },

    totalWorkers() {
      let total = this.item.workers.reduce((acc, item) => {
        let val = Number(this.toFloat(item.quantity)) * Number(this.toFloat(item.price))
        item.total = val
        return acc + val
      }, 0)
      return isNaN(total) ? 0 : total
    },

    sum1() {
      return this.totalMaterials + this.totalWorkers + Number(this.toFloat(this.item.tool))
    },

    avg1() {
      return parseFloat((Number(this.toFloat(this.item.admin_expense)) * this.sum1) / 100).toFixed(2)
    },

    sum2() {
      return this.sum1 + Number(this.avg1)
    },

    avg2() {
      return parseFloat((Number(this.toFloat(this.item.utility)) * this.sum2) / 100).toFixed(2)
    },

    sum3() {
      return this.sum2 + Number(this.avg2)
    },

    avg3() {
      return parseFloat((Number(this.toFloat(this.item.tax)) * this.sum3) / 100).toFixed(2)
    },

    total() {
      let total = parseFloat(this.sum3 + Number(this.avg3)).toFixed(2)
      return total
    },

    totalMt2() {
      let dimension = Number(this.dimension) === 0 ? 1 : Number(this.dimension)
      let price_with_tax = parseFloat(Number(this.total) / dimension).toFixed(2)
      return price_with_tax
    },
  },

  methods: {
    closeAlert() {
      this.popoverShow = false
    },

    active: async function(cost) {
      this.closeAlert()
      this.$emit('submit')
      try {
        const success = await CostService.active(cost)
        if (success.status === 200) {
          this.$emit('success')
        }
      } catch (err) {
        this.$emit('success')
      }
    }
  }
}
</script>
<style scoped>


.title{
  border: 1px solid black; 
  border-bottom: none; 
  text-align: center; 
  font-size: 20px;
  font-weight: bold;
}

table {
  border-collapse: collapse;
  width: 100%;
}

table th,
table td {
  border: 1px solid #000;
  padding: 0.625em;
  text-align: center;
  font-weight: bold;
}

table tbody tr {
  background-color: ##fbfbfb;
  border: 1px solid #ddd;
  padding: 0.35em;
  font-size: 0.75em;
}

table tfoot tr {
  background-color: #fff;
}

/*table tr:nth-child(even){background-color: #f2f2f2;}*/

table tr:hover {background-color: #ececec;}

table thead th {
  padding-top: 6px;
  padding-bottom: 6px;
  background-color: #909090;
  color: white;
  text-transform: uppercase;
  font-size: 0.8em;
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

  table tfoot th {
    border: none;
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