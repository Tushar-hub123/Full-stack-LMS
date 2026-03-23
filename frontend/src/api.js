import axios from "axios";

const api = axios.create({
  baseURL: "https://lms-final-5mk1.onrender.com/api",
});

export default api;