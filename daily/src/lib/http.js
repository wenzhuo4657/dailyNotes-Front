import axios from "axios";


export const http = axios.create({

  // TODO 控制项目中的根路径
  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
  transformResponse: [(data) => data],
});

http.interceptors.request.use((config) => {

  return config;
});

http.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("[HTTP ERROR]", err);
    return Promise.reject(err);
  }
);
