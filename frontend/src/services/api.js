import axios from "axios";

const api = axios.create({
  baseURL: "https://pharmamap-60d8.onrender.com/api",
});

// Bust the browser cache on all GET requests so mutations (add/delete/edit)
// are reflected immediately on the next fetch without stale data.
api.interceptors.request.use((config) => {
  if (config.method === "get") {
    config.params = config.params || {};
    config.params._t = Date.now();
  }
  return config;
});

export default api;