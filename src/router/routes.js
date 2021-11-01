const routes = [
  {
    path: '/',
    component: () => import('layouts/MainLayout'),
    children: [
      { path: '', name: 'home', component: () => import('pages/Dashboard') },
      { path: 'help', name: 'help', component: () => import('pages/Help') }
    ]
  },
  {
    path: '/popup',
    component: () => import('layouts/PopupLayout'),
    children: [
      {
        path: 'notify',
        name: 'notify',
        component: () => import('pages/Notify'),
        props: route => ({ type: route.query.type })
      },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '*',
    component: () => import('pages/Error404.vue')
  }
];

export default routes;
