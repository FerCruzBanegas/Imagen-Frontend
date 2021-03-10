<template>
  <div>
    <div class="d-flex justify-content-start mb-2">
      <b-button>Button</b-button>
    </div>
    <modal-form-design 
      :visible="visibleModal" 
      :design="rowData"
      @hide="visibleModal = !visibleModal">
    </modal-form-design>
    <b-table class="text-center" :items="products" :fields="columns" :tbody-tr-class="rowClass" fixed small hover responsive="sm" stacked="sm" head-variant="light" primary-key="id">
      <template v-slot:cell(item)="data">
        {{ data.index + 1 }}
      </template>
      <template v-slot:head(item)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(name)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(quantity)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(dimension)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:head(opciones)="data">
        <span>{{ data.label.toUpperCase() }}</span>
      </template>
      <template v-slot:cell(opciones)="row">
        <b-button title="Ver Detalles" variant="dark" size="sm" @click="openModal(row)" class="mr-2">
          <i class="fa fa-file-text"></i> 
        </b-button>
        <b-button title="Descargar" variant="danger" v-if="row.item.state" size="sm" class="mr-2">
          <i class="fa fa-download"></i> 
        </b-button>
      </template>
    </b-table>
  </div>
</template>

<script>
import ModalFormDesign from '../widgets/Modals/ModalFormDesign.vue' 
import DesignService from '../../services/design.service'

export default {
  props: {
    products: {
      type: Array
    },

    state: {
      type: Number
    },
  },

  components: {
    'modal-form-design': ModalFormDesign,
  },

  directives: {
    available: {
      inserted: (el, binding, vnode) => {
        if(vnode.context.state === 3) {
          el.disabled = true
        }
      }
    }
  },

  data() {
    return {
      columns: [
        'item',
        { key: 'name', label: 'Producto'},
        { key: 'quantity', label: 'Cantidad'},
        { key: 'dimension', label: 'Dimensión'},
        'opciones',
      ],
      loading: false,
      visibleModal: false,
      rowData: null,
    }
  },

  methods: {
    openModal(row) {
      this.visibleModal = true
      this.rowData = row.item
    },

    getImage(row) {
      if (row.design.path.url) {
        return row.design.path.url
      } else {
        return 'img/no-image.jpg'
      }
    },

    onImageChange(e, row) {
      let files = e.target.files || e.dataTransfer.files
      if (!files.length)
        return;
      this.createImage(files[0], row.design.path)
      row.design.path.name = files[0].name
    },

    createImage(file, row) {
      let reader = new FileReader()
      let vm = this;
      reader.onload = (e) => {
        row.url = e.target.result
      };
      reader.readAsDataURL(file)
    },

    submit: async function(row) {
      this.$validator.errors.clear();
      const vm = this
      const data = { design: row.design }
      vm.loading = true
      try {
        if(row.design.id) {
          vm._save = await DesignService.updateDesign(row.design.id, data)
        } else {
          vm._save = await DesignService.storeDesign(data)
        }
        if (vm._save.status === 201 || vm._save.status === 200) {
          row.design.id = vm._save.data.data.id 
          row.state = 1
          // vm.$snotify.simple(vm._save.data.message, 'Felicidades')
          vm.loading = false
        }
      } catch (err) {
        if(err.response.status === 422) vm.$setErrorsFromResponse(err.response.data)
        vm.loading = false
      }
    },

    rowClass(item, type) {
      if (!item || type !== 'row') return
      if (item.state == false) {
        return 'table-warning'
      } else {
        return 'table-success'
      }
    }
  }
}
</script>
<style lang="css">
.custom-file-input:lang(en) ~ .custom-file-label::after {
  content: 'Buscar';
}

.demo-gallery > div {
  margin-bottom: 15px;
  width: 100%;
  display: inline-block;
  margin-right: 10px;
  list-style: outside none none;
}

.demo-gallery > div > a {
  border: 3px solid #FFF;
  border-radius: 3px;
  display: block;
  overflow: hidden;
  position: relative;
  float: left;
}

.demo-gallery > div > a > img {
  -webkit-transition: -webkit-transform 0.15s ease 0s;
  -moz-transition: -moz-transform 0.15s ease 0s;
  -o-transition: -o-transform 0.15s ease 0s;
  transition: transform 0.15s ease 0s;
  -webkit-transform: scale3d(1, 1, 1);
  transform: scale3d(1, 1, 1);
  height: 100%;
  width: 100%;
}

.demo-gallery > div > a:hover > img {
  -webkit-transform: scale3d(1.1, 1.1, 1.1);
  transform: scale3d(1.1, 1.1, 1.1);
}

.demo-gallery > div > a:hover .demo-gallery-poster > img {
  opacity: 1;
}

.demo-gallery > div > a .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.1);
  bottom: 0;
  left: 0;
  position: absolute;
  right: 0;
  top: 0;
  -webkit-transition: background-color 0.15s ease 0s;
  -o-transition: background-color 0.15s ease 0s;
  transition: background-color 0.15s ease 0s;
}

.demo-gallery > div > a .demo-gallery-poster > img {
  left: 50%;
  margin-left: -10px;
  margin-top: -10px;
  opacity: 0;
  position: absolute;
  top: 50%;
  -webkit-transition: opacity 0.3s ease 0s;
  -o-transition: opacity 0.3s ease 0s;
  transition: opacity 0.3s ease 0s;
}

.demo-gallery > div > a:hover .demo-gallery-poster {
  background-color: rgba(0, 0, 0, 0.5);
}
</style>