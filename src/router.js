import Vue from 'vue';
import VueRouter from 'vue-router';
import store from './store';

Vue.use(VueRouter);

const routes = [
  {
    path: '/',
    name: 'home',
    component: () => import('./views/Home.vue'),
    meta: {
      title: 'Hem',
    },
  },
  {
    path: '/balance',
    name: 'balance',
    component: () => import('./views/Balance.vue'),
    meta: {
      title: 'Registrera',
      auth: true,
    },
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('./views/Login.vue'),
    meta: {
      title: 'Login',
    },
  },
  {
    path: '/register',
    name: 'register',
    component: () => import('./views/Register.vue'),
    meta: {
      title: 'Registrera',
    },
  },
  {
    path: '/logout',
    name: 'logout',
    beforeEnter(to, from, next) {
      store.dispatch('logout');
      next({ name: 'home' });
    },
  },
  {
    path: '*',
    name: '404',
    component: () => import('./views/404.vue'),
    meta: {
      title: '404 Sidan hittades inte',
    },
  },
];

const router = new VueRouter({
  base: '/',
  mode: 'history',
  routes,
  linkActiveClass: 'exact-active',
  linkExactActiveClass: 'active',
});

// Middlewares
router.beforeEach((to, from, next) => {
  let title = to.meta && to.meta.title;

  if (title) {
    title = typeof title == 'function' ? title(to) : title;
    document.title = `CakeStocks | ${title}`;
  }

  next();
});

router.beforeEach((to, from, next) => {
  const { meta } = to;

  if (meta && meta.auth && !store.getters.loggedIn) {
    next({
      name: 'login',
      query: {
        redirect: to.fullPath != '/' ? to.fullPath : undefined,
      }
    });
  } else {
    next();
  }
});

export default router;
