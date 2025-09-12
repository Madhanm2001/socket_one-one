import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL;

const axiosInstance = axios.create({
  baseURL: baseURL || "http://localhost:4000/api",
  headers: {
    'Content-Type': 'application/json'
  },
});

axiosInstance.interceptors.request.use(
  (config:any) => {
    const token =localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token.replace(/"/g, '')}`;
    }
    return config;
  },
  (error:any) => Promise.reject(error)
);

axiosInstance.interceptors.response.use(
  (response:any) => response,
  (error:any) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized! Logging out...');
    localStorage.removeItem('token'); 
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
