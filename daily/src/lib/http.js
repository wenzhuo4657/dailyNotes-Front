import axios from "axios";

export const http = axios.create({
  baseURL: "http://localhost:8080",
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
