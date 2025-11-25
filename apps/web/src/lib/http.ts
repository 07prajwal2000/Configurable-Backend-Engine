import axios from "axios";

const API_BASE_URL = "/_/admin/api";

export const httpClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});
