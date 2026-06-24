import axios, { InternalAxiosRequestConfig } from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://10.0.2.2:5000/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;