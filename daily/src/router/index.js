import { createRouter, createWebHistory } from 'vue-router';
import Home from '../page/home/Home.vue';
import Login from '@/page/login/Login.vue';
import Oauth from '@/page/oauth/Oauth.vue';
import { useAuthStore } from '@/storage/auth';

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
    meta: { requiresAuth: true }, // 使用布尔值
    component: Home,
  },
  {
    path: '/login',
    name: 'Login',
    meta: { requiresAuth: false }, // 使用布尔值
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
  // TODO: createWebHistory下的URL只是看起来会很正常，实际上仅仅存在 index.html, 所以，需要在 Web 服务器上设置回退路由
  history: createWebHistory(import.meta.env.BASE_URL),
  routes
});



router.beforeEach((to, from) => {
  if (
    to.meta.requiresAuth && !useAuthStore().isAuthenticated
  ) {
    // 将用户重定向到登录页面
    return { name: 'Login' };
  }
});

export default router;
