import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      { path: '', name:'home',component: () => import('pages/Index.vue') },
      { path: '/plot',name:'plot.index', component: () => import('pages/plots/Index.vue') },
      { path: '/roles', component: () => import('pages/roles/ManageRole.vue') },
      { path: '/perfiles', component: () => import('pages/Index.vue') },
      { path: '/user/:id/get', component: () => import('pages/plots/MiComponenteNuevo.vue') },
      { path: '/micomponente', component: () => import('pages/plots/MiComponenteNuevo.vue') }
    ],
  },
  {
    path: '/login',
    component: () => import('layouts/LoginLayout.vue'),
    children:[
      { path: '', name:'login',component: () => import('pages/auth/Login.vue') },
    ]
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/Error404.vue'),
  },
];

export default routes;
