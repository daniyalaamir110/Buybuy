import Axios from "axios";

// Create an Axios instance
const axios = Axios.create({
  baseURL: "http://localhost:2000",
  withCredentials: true
});

export default axios;
