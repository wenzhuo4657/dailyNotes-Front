
import axios from 'axios';

let service = null;

// 导出一个函数，用于初始化 axios 实例
export function initHttp(userStore) {
  if (service) {
    return service;
  }

  service = axios.create({
    baseURL: import.meta.env.VITE_API_BASE,
  });


  service.interceptors.request.use(
    (config) => {
      const token = userStore && userStore.token;
      if (token) {
        // Ensure headers exists
        if (!config.headers) {
          config.headers = {};
        }
        // Axios v1 uses AxiosHeaders; prefer .set if available
        try {
          if (typeof config.headers.set === 'function') {
            config.headers.set('satoken', `Bearer ${token}`);
          } else {
            config.headers['satoken'] = `Bearer ${token}`;
          }
        } catch (_) {
          config.headers['satoken'] = `Bearer ${token}`;
        }
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );


  return service;
}

// 为了方便，也可以导出一个获取实例的函数
export function getHttp() {
    if (!service) {
        throw new Error('Http service has not been initialized. Please call initHttp(store) first.');
    }
    return service;
}
