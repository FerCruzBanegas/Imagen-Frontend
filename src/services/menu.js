export const getMenuData = [
  {
    category: true,
    title: 'Panel de Control',
  },
  {
    title: 'Inicio',
    key: 'inicio',
    icon: 'fa fa-home',
    url: '/inicio',
    permission: 'all'
  },
  {
    category: true,
    title: 'Servicios',
  },
  {
    title: 'Cotizaciones',
    key: 'cotizaciones',
    icon: 'fa fa-calculator',
    url: '/servicios/cotizaciones',
    children: [
      {
        title: 'registrar nuevo',
        key: 'cotizacionesNuevo',
        url: '/servicios/cotizaciones/nuevo',
        permission: 'quotations.create'
      },
      {
        title: 'ver lista',
        key: 'cotizaciones',
        url: '/servicios/cotizaciones',
        permission: 'quotations.index|quotations.pending|quotations.approved|quotations.executed'
      },
    ],
  },
  {
    title: 'Ords. de trabajo',
    key: 'ordenDeTrabajo',
    icon: 'fa fa-calendar-check-o',
    url: '/servicios/ordenes',
    permission: 'workorders.index'
  },
  {
    title: 'Comprobantes',
    key: 'comprobantes',
    icon: 'fa fa-dollar',
    url: '/servicios/comprobantes',
    children: [
      {
        title: 'facturas',
        key: 'facturas',
        url: '/servicios/comprobantes/facturas',
        permission: 'invoices.index'
      },
      {
        title: 'notas de remision',
        key: 'notas de remision',
        url: '/servicios/comprobantes/notas',
        permission: 'notes.index'
      },
    ],
  },
  {
    title: 'Cuentas',
    key: 'cuentas',
    icon: 'fa fa-credit-card',
    url: '/servicios/cuentas',
    permission: 'accounts.index'
  },
  {
    title: 'Productos',
    key: 'productos',
    icon: 'fa fa-cubes',
    url: '/servicios/productos',
    children: [
      {
        title: 'registrar nuevo',
        key: 'productosNuevo',
        url: '/servicios/productos/nuevo',
        permission: 'products.create'
      },
      {
        title: 'ver lista',
        key: 'productos',
        url: '/servicios/productos',
        permission: 'products.index'
      },
    ],
  },
  {
    title: 'Clientes',
    key: 'clientes',
    icon: 'fa fa-group',
    url: '/servicios/clientes',
    children: [
      {
        title: 'registrar nuevo',
        key: 'clientesNuevo',
        url: '/servicios/clientes/nuevo',
        permission: 'customers.create'
      },
      {
        title: 'ver lista',
        key: 'clientes',
        url: '/servicios/clientes',
        permission: 'customers.index'
      },
    ],
  },
  {
    title: 'Vallas Pub.',
    key: 'vallas',
    icon: 'fa fa-television',
    url: '/servicios/vallas',
    children: [
      {
        title: 'indicadores',
        key: 'indicadores',
        url: '/servicios/vallas/indicadores',
        permission: 'customers.index'
      },
      {
        title: 'espacios',
        key: 'vallas',
        url: '/servicios/vallas',
        permission: 'customers.index'
      },
      {
        title: 'alquileres',
        key: 'alquileres',
        url: '/servicios/vallas/alquileres',
        permission: 'customers.index'
      },
      {
        title: 'informes',
        key: 'informes',
        url: '/servicios/vallas/informes',
        permission: 'customers.index'
      },
    ],
  },
  {
    category: true,
    title: 'Administración',
  },
  {
    title: 'Reportes',
    key: 'reportes',
    icon: 'fa fa-file-text-o',
    url: '/reportes',
    permission: 'reports.index'
  },
  {
    title: 'Configuración',
    key: 'configuracion',
    icon: 'fa fa-gear',
    children: [
      {
        title: 'Empleados',
        key: 'empleados',
        url: '/configuracion/empleados',
        permission: 'employees.index'
      },
      {
        title: 'Perfiles',
        key: 'perfiles',
        url: '/configuracion/perfiles',
        permission: 'profiles.index'
      },
      {
        title: 'Usuarios',
        key: 'usuarios',
        url: '/configuracion/usuarios',
        permission: 'users.index'
      },
    ],
  }
]
