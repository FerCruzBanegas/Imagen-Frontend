<template>
  <fieldset class="col-sm-12 col-md-12 col-lg-12 col-xl-12" v-show="success">
    <legend>{{ addSubtitle }}:</legend>
    <a-spin :spinning="loading">
      <div class="container">
        <div class="row">
          <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
            <b-form-group label-for="description" :invalid-feedback="errors.first('description')" :state="!errors.has('description')">
              <div class="d-table-cell w-100">
                <b-form-input 
                  v-model="profile.description" 
                  :state="errors.has('description') ? false : null"
                  v-validate="'required|max:32'"
                  data-vv-name="description"
                  data-vv-as="descripción"
                  type="text"
                ></b-form-input>
              </div>
              <div class="d-table-cell align-middle">
                <b-button
                  @click="submit" 
                  :disabled="!profile.action_list.length > 0" 
                  :loading="loading" 
                  pill 
                  class="ml-2"
                >Aceptar</b-button>
              </div>
              <div class="d-table-cell align-middle" v-if="id">
                <b-button @click="showProfile" variant="danger" class="ml-1 btn-add" size="sm" pill>
                  <i class="fa fa-refresh"></i>
                </b-button>
              </div>
            </b-form-group>
          </div>
        </div>
        <div class="d-flex justify-content-between">
          <div class="h2 font-weight-bold">PERMISOS DE ACCESO</div>
          <i class="fa fa-lock fa-3x" aria-hidden="true"></i>
        </div>
        <small>Por favor, seleccione uno o más permisos a los que tendrá acceso este perfil.</small>
        <b-card
          header-tag="header"
          border-variant="dark"
          header="Dark"
          header-border-variant="dark"
          v-for="(action,index) in actions" :key="index"
        >
          <template v-slot:header>
            <div class="d-flex justify-content-between">
              <h5 class="mb-0 font-weight-bold">{{ action.title.title }}</h5>
              <div>
                <b-form-checkbox
                  switch
                  size="lg"
                  v-model="action.flag"
                  @change="toggleAll(action)"
                ></b-form-checkbox>
              </div>
            </div>
          </template>
          <div class="container">
            <div class="row">
              <div v-for="(a,index) in action.permissions" :key="a.id" class="col-sm-6 col-md-3 col-lg-3 col-xl-3">
                <b-form-checkbox 
                  switch
                  :value="a.id"
                  v-model="profile.action_list"
                >
                  {{ a.name }}
                </b-form-checkbox>
              </div>
            </div>
          </div>
        </b-card>
      </div>
    </a-spin>
  </fieldset>
</template>

<script>
import Profile from '../../models/Profile'
import ProfileService from '../../services/profile.service'
import ActionsService from '../../services/action.service'

export default {
  data() {
    return {
      success: false,
      loading: false,
      profile: new Profile(),
      actions: [],
      id: this.$route.params.id,
    };
  },

  computed: {
    addSubtitle () {
      if(this.id) {
        return 'Editar Perfil'
      }
      return 'Registrar Nuevo Perfil'
    }
  },

  created() {
    this.listActions()
  },

  methods: {
    toggleAll(item) {
      const values = item.permissions.map(i => i.id)
      if (!item.flag) {
        values.forEach( element => {
          if (!this.profile.action_list.includes(element)) {
            this.profile.action_list.push(element)
          }
        })
      } else {
        values.forEach( element => {
          const index = this.profile.action_list.findIndex(x => x == element)
          if (index > -1) this.profile.action_list.splice(index, 1)
        })
      }
    },

    listActions: async function() {
      const actions = await ActionsService.getActions('actions/listing')
      if (actions.status === 200) {
        this.actions = actions.data
        if (this.id) this.showProfile() 
          else
            this.success = true
      }
    },

    showProfile:async function() {
      const response = await ProfileService.showProfile(`profiles/${this.id}/edit`)
      if (response.status === 200) {
        this.profile = response.data.data
        this.success = true
      }
    },

    submit: async function() {
      this.$validator.errors.clear()
      this.loading = true
      try {
        if(this.id) {
          this._save = await ProfileService.updateProfile(this.id, this.profile)
        } else {
          this._save = await ProfileService.storeProfile(this.profile)
        }
        if (this._save.status === 201 || this._save.status === 200) {
          this.$message.success(this._save.data.message)
          this.loading = false
          if (this.retry) {
            this.profile = new Profile()
          } else {
            this.$router.push('/configuracion/perfiles')
          }
        }
      } catch (err) {
        if(err.response.status === 422) this.$setErrorsFromResponse(err.response.data)
        this.loading = false
      }
    }
  }
}
</script>
<style scoped>
  fieldset {
    background-color: #e9e4e6;
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
