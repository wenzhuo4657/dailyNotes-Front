import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../page/home/Home.vue'),
    meta: { requiresAuth: true, title: '主页' }
  },
  {
    path: '/login',
    name: 'Login',
    component: () => import('../page/login/login.vue'),
    meta: { requiresAuth: false, title: '登录' }
  },
  {
    path: '/:pathMatch(.*)*',
    redirect: '/'
  }
]

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
})

router.beforeEach((to, from, next) => {
  document.title = to.meta.title || 'Daily'

  const token = localStorage.getItem('token') || sessionStorage.getItem('token')

  if (to.path !== '/login' && to.meta.requiresAuth && !token) {
    next({ path: '/login', query: { redirect: to.fullPath } })
  } else if (to.path === '/login' && token) {
    next((to.query && to.query.redirect) || '/')
  } else {
    next()
  }
})

export default router
