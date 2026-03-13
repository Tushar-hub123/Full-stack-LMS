import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-yce2.onrender.com/api",
  withCredentials: true,
});

export default api;