const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '/',
        name: 'IndexPage',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: 'miPaciente/:id',
        component: () => import('pages/miPaciente.vue')
      },
      {
      path: '/verParte',
      name: 'verParte',
      component: () => import('pages/verParte.vue')
      },
      {
        path: 'GrabacionPage/:id',
        component: () => import('pages/GrabacionPage.vue')
      },
      {
        path: 'revisarInforme/:id',
        name: 'revisarInforme',
        component: () => import('pages/revisarInforme.vue')
      },
      {
        path: 'FormPage/:id',  // ✅ ahora funciona
        component: () => import('pages/FormPage.vue')
      },
      
      {
        path: 'successPage',
        name: 'successPage',
        component: () => import('pages/successPage.vue')
      },  

      {
      path: 'verPDF',
      name: 'verPDF',
      component: () => import('pages/verPDF.vue')
      }

    ]
  },

  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/LoginPage.vue')
      }
    ]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes