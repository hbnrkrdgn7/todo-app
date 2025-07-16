import axios from "axios";

const api = axios.create({
  baseURL: "https://686f536991e85fac42a07e39.mockapi.io/tasks"
});

export default api;
