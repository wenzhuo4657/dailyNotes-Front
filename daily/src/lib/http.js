
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
      // 兼容 Pinia ref 与普通字符串
      const raw = userStore && userStore.token;
      const token = (raw && typeof raw === 'object' && 'value' in raw) ? raw.value : raw;

      // 确保 headers 存在
      if (!config.headers) {
        config.headers = {};
      }

      // 动态设置/清理 satoken
      try {
        if (token) {
          if (typeof config.headers.set === 'function') {
            config.headers.set('satoken', `Bearer ${token}`);
          } else {
            config.headers['satoken'] = `Bearer ${token}`;
          }
        } else {
          if (typeof config.headers.delete === 'function') {
            config.headers.delete('satoken');
          } else if ('satoken' in config.headers) {
            delete config.headers['satoken'];
          }
        }
      } catch (_) {
        if (token) {
          config.headers['satoken'] = `Bearer ${token}`;
        } else if ('satoken' in config.headers) {
          delete config.headers['satoken'];
        }
      }

      return config;
    },
    (error) => Promise.reject(error)
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
