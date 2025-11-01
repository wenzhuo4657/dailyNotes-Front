import { createRouter, createWebHistory } from 'vue-router';
import Home from '../page/home/Home.vue';
import Login from '\@/page/login/login.vue';
import Oauth from '@/page/oauth/Oauth.vue';
import { useAuthStore } from '@/storage/auth';
import Layout from '@/page/home/layout.vue';

const routes = [
  {
    path: '/',
    name: 'Root',
    redirect: () => {
      const token = localStorage.getItem('token')
      return token ? '/home' : '/login'
    }
  },
  {
    path: '/home',
    name: 'Home',
    meta: { requiresAuth: true }, // 需要鉴权
    component: Layout,
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresAuth: false },
    component: Login,
  },
  {
    path: '/auth/callback',
    name : 'callback',
    meta: { requiresAuth: false},
    component: Oauth

  } 
];

const router = createRouter({
  // createWebHistory 需要服务器支持回退路由到 index.html
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});

router.beforeEach((to, from) => {
  const auth = useAuthStore();
  const authed = auth.isAuthenticated?.value ?? !!auth.token;
  if (to.meta.requiresAuth && !authed) {
    return { name: 'Login' };
  }
});

export default router;

