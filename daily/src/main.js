import { createApp } from 'vue'
import App from './App.vue'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import { i18n } from './i18n'
import router from './router'
import { createPinia } from 'pinia'
import { initHttp } from './lib/http'
import { useAuthStore } from './storage/auth'
const app = createApp(App)

app
  .use(createPinia())
  .use(router)
  .use(ElementPlus)
  .use(i18n)

const userStore = useAuthStore(); 


initHttp(userStore);

app.mount('#app')
