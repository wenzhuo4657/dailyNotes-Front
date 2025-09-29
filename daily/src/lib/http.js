import axios from "axios";


export const http = axios.create({

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
