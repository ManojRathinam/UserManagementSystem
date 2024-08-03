import axios, { InternalAxiosRequestConfig } from 'axios';

// Create an axios instance with a base URL
const tokenInterceptor = axios.create({
  baseURL: 'http://localhost:5001/api/',
});

// Add a request interceptor
tokenInterceptor.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('jwt'); // or use sessionStorage, or cookies depending on your setup
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    // Do something with request error
    return Promise.reject(error);
  }
);

export default tokenInterceptor;
