import axios from "axios";


export const http = axios.create({

  baseURL: import.meta.env.VITE_API_BASE,
  timeout: 10000,
});



http.interceptors.response.use(function (response) {
  console.log(response)

    return response;
  }, function (error) {

    return Promise.reject(error);
  });
