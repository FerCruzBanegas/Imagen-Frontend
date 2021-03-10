<template>
  <div class="container" v-if="success">
	  <list-panel :cities="cities" />	
		<highcharts :options="chartOptions"></highcharts>
  </div>
</template>
<script>
import {Chart} from 'highcharts-vue'
import CityService from '../../../services/city.service'
import ListPanel from '@/components/widgets/General/ListPanel/index'
export default {
  data() {
    return {
      items:[],
      chartOptions: null,
      success: false,
    }
  },

  created() {
  	Promise.all([this.statesByCity(), this.quotesPerMonth()])
    .then(() =>{
      this.chartOptions = {
        colors: ['#9e0207', '#6a7a84', '#8d4654', '#7798BF', '#aaeeee',
        '#ff0066', '#eeaaee', '#55BF3B', '#DF5353', '#7798BF', '#aaeeee'],
        chart: {
          type: 'column'
        },
  	    title: {
  	      text: 'Total Cotizaciones por Mes'
  	    },
  	    subtitle: {
  	      text: 'Datos tomados del año actual.'
  	    },
  	    xAxis: {
  	      categories: ['Ene','Feb','Mar','Abr','May','Jun','Jul','Ago','Sep','Oct','Nov','Dic'],
  	      crosshair: true
  	    },
  	    yAxis: {
  	      min: 0,
  	      title: {
  	        text: 'Cantidad'
  	      }
  	    },
        legend: {
        backgroundColor: '#E0E0E8',
        itemStyle: {
            fontWeight: 'bold',
            fontSize: '13px'
        }
    },
  	    tooltip: {
  	      headerFormat: '<span style="font-size:10px">{point.key}</span><table>',
  	      pointFormat: '<tr><td style="color:{series.color};padding:0">{series.name}: </td>' +
  	      '<td style="padding:0"><b>{point.y}</b></td></tr>',
  	      footerFormat: '</table>',
  	      shared: true,
  	      useHTML: true
  	    },
        series: this.items
      }
      this.success = true
    })
  },

  methods: {
  	statesByCity: async function() {
      const response = await CityService.statesByCity()
      if (response.status === 200) {
        this.cities = response.data
      }
    },

    quotesPerMonth: async function() {
      const response = await CityService.quotesPerMonth()
      if (response.status === 200) {
        this.items = response.data.map(({name,...rest})=>({ name, data : Object.values(rest)}))
      }
    }

  },

  components: {
    ListPanel,
    highcharts: Chart,
  },
}
</script>


