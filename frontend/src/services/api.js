import axios from "axios";

const api = axios.create({
  baseURL: "https://pharmamap-60d8.onrender.com",
});

export default api;