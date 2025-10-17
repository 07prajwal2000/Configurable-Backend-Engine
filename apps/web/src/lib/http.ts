import axios from "axios";

const API_BASE_URL = "http://localhost:3000/_/admin";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
