import axios from "axios";
import "dotenv/config";

const baseURL =
  process.env.EVALUATION_BASE_URL ??
  "http://4.224.186.213/evaluation-service";

const token = process.env.EVALUATION_TOKEN;

const api = axios.create({
  baseURL,
  headers: token
    ? {
        Authorization: `Bearer ${token}`,
      }
    : undefined,
});

export default api;
