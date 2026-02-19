import axios from "axios";

const API = "https://todo-app-1-b5ro.onrender.com";

export default axios.create({
  baseURL: API
});
