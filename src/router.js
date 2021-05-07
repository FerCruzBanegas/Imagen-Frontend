import Vue from 'vue'
import Router from 'vue-router'
import AuthLayout from '@/layouts/Auth'
import AppLayout from '@/layouts/App'
import store from '@/store'

Vue.use(Router)

const router = new Router({
  mode: 'history',

  routes: [
    //Inicio
    {
      path: '/',
      component: AppLayout,
      redirect: '/inicio',
      meta: { authRequired: true, hidden: true, breadcrumb: 'Inicio'},
      children: [
        {
          path: '/inicio',
          name: 'Inicio',
          meta: {
            title: 'Inicio',
          },
          component: () => import('./views/dashboard/home'),
        }
      ],
    },

    //Cotizaciones
    {
      path: '/servicios/cotizaciones',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Cotizaciones' },
      children: [
        {
          path: '/',
          name: 'ListQuotation',
          meta: {
            title: 'Cotizaciones',
          },
          component: () => import('./views/quotations'),
        },
        {
          path: '/servicios/cotizaciones/nuevo',
          name: 'CreateQuotation',
          meta: {
            title: 'Cotizaciones | Nuevo',
            breadcrumb: 'Nuevo Registro'
          },
          component: () => import('./views/quotations/form')
        },
        {
          path: '/servicios/cotizaciones/:id',
          name: 'ShowQuotation',
          meta: {
            title: 'Cotizaciones',
            breadcrumb: 'Detalle Registro'
          },
          component: () => import('./views/quotations/show'),
        },
        {
          path: '/servicios/cotizaciones/:id/edit',
          name: 'EditQuotation',
          meta: {
            title: 'Cotizaciones | Editar',
            breadcrumb: 'Editar Registro'
          },
          component: () => import('./views/quotations/form'),
        },
      ],
    },

    //Orden de Trabajo
    {
      path: '/servicios/ordenes',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Ordenes de Trabajo' },
      children: [
        {
          path: '/servicios/ordenes',
          name: 'ListWorkOrders',
          meta: {
            title: 'Ordenes',
          },
          component: () => import('./views/workorders'),
        },
      ],
    },

    //Facturas
    {
      path: '/servicios/comprobantes/facturas',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Facturas' },
      children: [
        {
          path: '/servicios/comprobantes/facturas',
          name: 'ListInvoices',
          meta: {
            title: 'Facturas',
          },
          component: () => import('./views/invoices'),
        },
      ],
    },

    //Notas
    {
      path: '/servicios/comprobantes/notas',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Notas de Remision' },
      children: [
        {
          path: '/servicios/comprobantes/notas',
          name: 'ListNotes',
          meta: {
            title: 'Notas de Remision',
          },
          component: () => import('./views/notes'),
        },
      ],
    },

    //Cuentas
    {
      path: '/servicios/cuentas',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Cuentas' },
      children: [
        {
          path: '/servicios/cuentas',
          name: 'ListAccounts',
          meta: {
            title: 'Cuentas',
          },
          component: () => import('./views/accounts'),
        },
      ],
    },

    //Productos
    {
      path: '/servicios/productos',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Productos' },
      children: [
        {
          path: '/',
          name: 'ListProducts',
          meta: {
            title: 'Productos',
          },
          component: () => import('./views/products'),
        },
        {
          path: '/servicios/productos/nuevo',
          name: 'CreateProduct',
          meta: {
            title: 'Productos | Nuevo',
            breadcrumb: 'Nuevo Registro'
          },
          component: () => import('./views/products/form')
        },
        {
          path: '/servicios/productos/:id',
          name: 'ShowProduct',
          meta: {
            title: 'Productos',
            breadcrumb: 'Detalle Registro'
          },
          component: () => import('./views/products/show'),
        },
        {
          path: '/servicios/productos/:id/edit',
          name: 'EditProduct',
          meta: {
            title: 'Productos | Editar',
            breadcrumb: 'Editar Registro'
          },
          component: () => import('./views/products/form'),
        },
      ],
    },

    //Clientes
    {
      path: '/servicios/clientes',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Clientes' },
      children: [
        {
          path: '/',
          name: 'ListCustomers',
          meta: {
            title: 'Clientes',
          },
          component: () => import('./views/customers'),
        },
        {
          path: '/servicios/clientes/nuevo',
          name: 'CreateCustomer',
          meta: {
            title: 'Clientes | Nuevo',
            breadcrumb: 'Nuevo Registro'
          },
          component: () => import('./views/customers/form')
        },
        {
          path: '/servicios/clientes/:id',
          name: 'ShowCustomer',
          meta: {
            title: 'Clientes',
            breadcrumb: 'Detalle Registro'
          },
          component: () => import('./views/customers/show'),
        },
        {
          path: '/servicios/clientes/:id/edit',
          name: 'EditCustomer',
          meta: {
            title: 'Clientes | Editar',
            breadcrumb: 'Editar Registro'
          },
          component: () => import('./views/customers/form'),
        },
      ],
    },

    //Vallas
    {
      path: '/servicios/vallas',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Vallas Publicitarias' },
      children: [
        {
          path: '/',
          name: 'ListBillboards',
          meta: {
            title: 'Clientes',
          },
          component: () => import('./views/billboards'),
        },
        // {
        //   path: '/servicios/clientes/nuevo',
        //   name: 'CreateCustomer',
        //   meta: {
        //     title: 'Clientes | Nuevo',
        //     breadcrumb: 'Nuevo Registro'
        //   },
        //   component: () => import('./views/customers/form')
        // },
        // {
        //   path: '/servicios/clientes/:id',
        //   name: 'ShowCustomer',
        //   meta: {
        //     title: 'Clientes',
        //     breadcrumb: 'Detalle Registro'
        //   },
        //   component: () => import('./views/customers/show'),
        // },
        // {
        //   path: '/servicios/clientes/:id/edit',
        //   name: 'EditCustomer',
        //   meta: {
        //     title: 'Clientes | Editar',
        //     breadcrumb: 'Editar Registro'
        //   },
        //   component: () => import('./views/customers/form'),
        // },
      ],
    },

    //Reportes
    {
      path: '/reportes',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Reportes' },
      children: [
        {
          path: '/',
          name: 'Reports',
          meta: {
            title: 'Reportes',
          },
          component: () => import('./views/reports'),
        },
      ]
    },

    //Empleados
    {
      path: '/configuracion/empleados',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Empleados' },
      children: [
        {
          path: '/',
          name: 'ListEmployees',
          meta: {
            title: 'Empleados',
          },
          component: () => import('./views/employees'),
        },
        {
          path: '/configuracion/empleados/nuevo',
          name: 'CreateEmployee',
          meta: {
            title: 'Empleados | Nuevo',
            breadcrumb: 'Nuevo Registro'
          },
          component: () => import('./views/employees/form')
        },
        {
          path: '/configuracion/empleados/:id/edit',
          name: 'EditEmployee',
          meta: {
            title: 'Empleados | Editar',
            breadcrumb: 'Editar Registro'
          },
          component: () => import('./views/employees/form'),
        },
      ],
    },
    
    //Perfiles
    {
      path: '/configuracion/perfiles',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Perfiles' },
      children: [
        {
          path: '/',
          name: 'ListProfiles',
          meta: {
            title: 'Perfiles',
          },
          component: () => import('./views/profiles'),
        },
        {
          path: '/configuracion/perfiles/nuevo',
          name: 'CreateProfile',
          meta: {
            title: 'Perfiles | Nuevo',
            breadcrumb: 'Nuevo Registro'
          },
          component: () => import('./views/profiles/form')
        },
        {
          path: '/configuracion/perfiles/:id/edit',
          name: 'EditProfile',
          meta: {
            title: 'Perfiles | Editar',
            breadcrumb: 'Editar Registro'
          },
          component: () => import('./views/profiles/form'),
        },
      ],
    },

    //Usuarios
    {
      path: '/configuracion/usuarios',
      component: AppLayout,
      meta: { authRequired: true, hidden: true, breadcrumb: 'Usuarios' },
      children: [
        {
          path: '/',
          name: 'ListUsers',
          meta: {
            title: 'Usuarios',
          },
          component: () => import('./views/users'),
        },
        {
          path: '/configuracion/usuarios/nuevo',
          name: 'CreateUser',
          meta: {
            title: 'Usuarios | Nuevo',
            breadcrumb: 'Nuevo Registro'
          },
          component: () => import('./views/users/form')
        },
        {
          path: '/configuracion/usuarios/perfil',
          name: 'ShowUser',
          meta: {
            title: 'Usuarios | Perfil',
            breadcrumb: 'Perfil'
          },
          component: () => import('./views/users/show'),
        },
        {
          path: '/configuracion/usuarios/password',
          name: 'UserPassword',
          meta: {
            title: 'Usuarios | Password',
          },
          component: () => import('./views/users/password'),
        },
        {
          path: '/configuracion/usuarios/:id/edit',
          name: 'EditUser',
          meta: {
            title: 'Usuarios | Editar',
            breadcrumb: 'Editar Registro'
          },
          component: () => import('./views/users/form'),
        },
      ],
    },

    // System Pages
    {
      path: '/system',
      component: AuthLayout,
      redirect: '/system/login',
      children: [
        {
          path: '/system/login',
          meta: {
            title: 'Login',
            redirectIfLogged: true 
          },
          component: () => import('./views/system/login'),
        },
        {
          path: '/system/404',
          meta: {
            title: 'Error 404',
          },
          component: () => import('./views/system/404'),
        },
        {
          path: '/system/403',
          meta: {
            title: 'Error 403',
          },
          component: () => import('./views/system/403'),
        },
      ],
    },

    {
      path: '*', redirect: 'system/404', hidden: true,
    },
  ],
})

router.beforeEach((to, from, next) => {
  if (to.matched.some(record => record.meta.authRequired)) {
    if (!store.getters.authenticating) {
      next({
        path: '/system/login',
        query: { redirect: to.fullPath },
      })
    } else {
      next()
    }
  } else if (to.matched.some(record => record.meta.redirectIfLogged)) {
    if (store.getters.authenticating) {
      next({
        path: '/'
      })
    } else {
      next()
    }
  } else {
    next()
  }
})

export default router
