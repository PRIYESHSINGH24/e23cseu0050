import axios from "axios";
import { ACCESS_TOKEN } from "./config";

type Stack = "backend" | "frontend";

type Level =
  | "debug"
  | "info"
  | "warn"
  | "error"
  | "fatal";

type Package =
  | "cache"
  | "controller"
  | "cron_job"
  | "db"
  | "domain"
  | "handler"
  | "repository"
  | "route"
  | "service"
  | "auth"
  | "config"
  | "middleware"
  | "utils";

export async function Log(
  stack: Stack,
  level: Level,
  pkg: Package,
  message: string
) {
  try {
    const response = await axios.post(
      "http://4.224.186.213/evaluation-service/logs",
      {
        stack,
        level,
        package: pkg,
        message,
      },
      {
        headers: {
          Authorization: `Bearer ${ACCESS_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    );

    console.log("SUCCESS:", response.data);
  } catch (error: any) {
    console.error(
      "ERROR:",
      error.response?.data || error.message
    );
  }
}