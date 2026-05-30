const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },

      {
        path: 'miPaciente/:id',
        component: () => import('pages/miPaciente.vue')
      },

      {
        path: 'GrabacionPage/:id',
        component: () => import('pages/GrabacionPage.vue')
      },
      { 
        path: '/login',
        component: () => import('layouts/LoginLayout.vue'),
        children: [
         { path: '', component: () => import('pages/LoginPage.vue') }
        ]
      },
      {
        path: '/revisarGrabacion',
        component: () => import('pages/revisarGrabacion.vue')
      },
      {
        path: '/:catchAll(.*)*',
        component: () => import('pages/ErrorNotFound.vue')
      }

    ]
  }
];

export default routes;