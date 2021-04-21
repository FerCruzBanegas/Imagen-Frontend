<template>
  <div>
    <b-card no-body header-bg-variant="light">
      <template v-slot:header>
        <div>
          <span class="text-dark font-size-24 font-weight-bold">
            LISTA DE NOTAS EMITIDAS
          </span>
        </div>   
      </template>
      <b-tabs card active-nav-item-class="font-weight-bold text-uppercase text-black">
        <b-tab title="Detalles" :title-link-class="'text-black'" lazy>
          <a-skeleton active :loading="tabGeneral"/>
          <fieldset v-if="!tabGeneral" class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
            <legend>Filtros:</legend>
            <div class="row my-2">
              <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <a-range-picker v-model="date" :locale="locale" :format="dateFormat" />
              </div>
              <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                <div class="d-table-cell w-100" v-if="permission('notes.all')">
                  <v-select
                    v-model="office"
                    label="description"
                    :options="offices"
                    :reduce="office => office.id"
                    placeholder="Seleccione la sucursal"
                  ></v-select>
                </div>
                <div class="d-table-cell align-middle">
                  <b-button @click="searchNote" variant="danger" class="ml-1" size="sm" style="height: 2.5em;">
                    <i class="fa fa-search"></i>
                  </b-button>
                </div>
              </div>
            </div>
          </fieldset>
          <grid-general v-show="!tabGeneral" v-on:general='general'></grid-general>
        </b-tab>
      </b-tabs>
    </b-card>
  </div>
</template>

<script>
  import permission from '../../mixins/permission'
  import OfficeService from '../../services/office.service'
  import GridGeneral from '../../components/note/GridGeneral'
  import locale from 'ant-design-vue/es/date-picker/locale/es_ES'
  import moment from 'moment'
  import 'moment/locale/es'

  export default {
    data() {
      return {
        locale,
        moment,
        date: null,
        dateFormat: 'YYYY/MM/DD',
        office: null,
        offices: [],
        tabGeneral: true,
      }
    },

    components: {
      'grid-general': GridGeneral,
    },

    mixins: [permission],

    created() {
      this.listOffices()
    },

    methods: {
      searchNote() {
        let date = null
        if(this.date) {
          date = {
            initial_date: moment(this.date[0]).format('YYYY-MM-DD'),
            final_date: moment(this.date[1]).format('YYYY-MM-DD')
          }
        }
        this.$bus.$emit('searchNote', {
          date:date, 
          office: this.office
        })
      },

      listOffices: async function() {
        const offices = await OfficeService.listOffices()
        if (offices.status === 200) {
          this.offices = offices.data
        }
      },

      general(e) {
        this.tabGeneral = e
      },
    }
  }
</script>
<style scoped src="../../assets/css/date.css"></style>
<style scoped>
fieldset {
  background-color: #f6f6f6;
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
</style>