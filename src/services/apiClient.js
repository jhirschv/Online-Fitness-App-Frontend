import axios from 'axios';

const apiClient = axios.create({
  baseURL: 'http://localhost:8000/',
});
//http://localhost:8000/
//http://192.168.5.80:8000/

apiClient.interceptors.request.use(config => {
  const rawTokens = localStorage.getItem('authTokens');
  if (rawTokens) {
    const { access } = JSON.parse(rawTokens);
    config.headers.Authorization = `Bearer ${access}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default apiClient;