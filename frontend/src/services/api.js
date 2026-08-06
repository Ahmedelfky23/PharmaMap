import axios from "axios";

const api = axios.create({
  baseURL: "https://pharmamap-60d8.onrender.com/api",
});

// Bypass browser cache globally for all GET requests
api.interceptors.request.use((config) => {
  if (config.method === 'get') {
    config.params = config.params || {};
    config.params._t = Date.now();
  }
  return config;
});

export default api;