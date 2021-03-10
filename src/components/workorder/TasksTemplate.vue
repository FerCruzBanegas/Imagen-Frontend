<template>
  <fieldset class="fieldset col-sm-12 col-md-12 col-lg-12 col-xl-12 text-left">
    <legend>Lista de tareas asignadas:</legend>
    <a-spin :spinning="loading">
      <div class="container">
        <div class="d-flex justify-content-between row bg-light p-2">
          <button @click="test" type="button" class="btn btn-secondary btn-with-addon text-nowrap">
            <span class="btn-addon">
              <i class="btn-addon-icon fe fe-check-circle"  />
            </span>
            Guardar Cambios
          </button>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="mb-2">
            <!-- <pre>{{ $data }}</pre> -->
            <table>
              <thead>
                <tr>
                  <th scope="col" width="20px">Nº</th>
                  <th scope="col" width="100px">Descripción</th>
                  <th scope="col" width="30px">Prioridad</th>
                  <th scope="col" width="90px">Encargado</th>
                  <th scope="col" width="80px">Fecha/Hora</th>
                  <th scope="col" width="50px">Realizado</th>
                </tr>
              </thead>
              <tbody v-if="templateArgs.tasks_items.length > 0">
                <tr v-for="(item, index) in templateArgs.tasks_items" :key="index">
                  <td data-label="Nº"><span>{{ index + 1 }}</span></td>
                  <td data-label="Descripción">
                    {{ item.description }}
                  </td>
                  <td data-label="Prioridad">
                    {{ item.priority }}
                  </td>
                  <td data-label="Encargado">
                    {{ item.employee_id.name }}
                  </td>
                  <td data-label="Fecha/Hora">
                    <div class="text-left" v-if="item.date_end">
                      <div><span  style="font-size: 12px; color: #000000;">Inicio:</span> {{ item.date_init | formatDate('DD/MM/YYYY LT') }}</div>
                      <div><span  style="font-size: 12px; color: #000000;">Fin:</span> {{ item.date_end | formatDate('DD/MM/YYYY LT') }}</div>
                    </div>
                    <div v-else>{{ item.date_init | formatDate("DD/MM/YYYY h:mm") }}</div>
                  </td>
                  <td data-label="Realizado">
                    <input :disabled="item.date_end" v-model="item.completed" type="checkbox" class="k-checkbox">
                  </td>
                </tr>
              </tbody>
            </table>
            <div class="container" v-if="templateArgs.tasks_items.length === 0">
              <div class="d-flex justify-content-center row" style="background-color: #dcdcdc;">
                <div class="text-center">
                  <i class="fa fa-search-minus fa-3x" aria-hidden="true"></i> 
                  <div class="p-2"><small class="font-weight-bold">Sin tareas asignadas</small></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </a-spin>
  </fieldset>
</template>
<script>
  import TaskService from '../../services/task.service'
  export default {
    name: 'tasks',
    data () {
      return {
        templateArgs: {},
        loading: false
      }
    },

    methods: {
      async test() {
        this.loading = true

        let tasksItems = this.templateArgs.tasks_items.filter(item => {
          return item.completed === true && item.date_end === null
        }).map(obj => obj.id)

        try {
          const tasks = await TaskService.closeTasks({tasks: tasksItems})
          if (tasks.status === 200) {
            this.templateArgs.tasks_items = this.templateArgs.tasks_items.map(obj => tasks.data.data.find(o => o.id === obj.id) || obj)
            this.loading = false
          }
        } catch (err) {
          this.loading = false
          console.log(err)
        }
      }
    }
  }
</script>
<style scoped>
.fieldset {
  border-radius: 4px;
  border: 1px solid black;
}

legend {
  background-color: #fff;
  border: 1px solid #ddd;
  border-radius: 4px;
  color: #000;
  font-size: 13px;
  font-weight: bold;
  padding: 3px 5px 3px 7px;
  width: auto;
}

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