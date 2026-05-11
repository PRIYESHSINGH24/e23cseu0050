import { Request, Response } from "express";
import axios from "axios";

import { getDepots } from "../services/depotService";
import { getVehicles } from "../services/vehicleService";
import { optimizeTasks } from "../utils/knapsack";
import { Log } from "../utils/logger";

export const getSchedule = async (req: Request, res: Response) => {
  try {
    await Log("backend", "info", "controller", "Fetching schedule");

    if (!process.env.EVALUATION_TOKEN) {
      await Log(
        "backend",
        "error",
        "controller",
        "Missing EVALUATION_TOKEN env var"
      );
      return res.status(500).json({
        message:
          "Missing EVALUATION_TOKEN. Set it in your shell or in a .env file.",
      });
    }

    const depotId = Number(req.params.depotId);

    if (!Number.isFinite(depotId)) {
      return res.status(400).json({ message: "Invalid depotId" });
    }

    const [depots, vehicles] = await Promise.all([
      getDepots(),
      getVehicles(),
    ]);

    const depot = depots.find((d) => d.ID === depotId);

    if (!depot) {
      return res.status(404).json({ message: "Depot not found" });
    }

    const result = optimizeTasks(vehicles, depot.MechanicHours);

    return res.json({
      depotId,
      totalImpact: result.totalImpact,
      totalHours: result.totalHours,
      selectedTasks: result.selectedTasks,
    });
  } catch (error: unknown) {
    await Log(
      "backend",
      "error",
      "controller",
      "Schedule generation failed"
    );

    if (axios.isAxiosError(error)) {
      const status = error.response?.status;
      const detail =
        (error.response?.data as any)?.message ??
        (error.response?.data as any)?.error ??
        error.message;

      if (status === 401 || status === 403) {
        return res.status(status).json({
          message: "Unauthorized calling evaluation-service",
          detail,
        });
      }

      return res.status(502).json({
        message: "Failed to fetch data from evaluation-service",
        status,
        detail,
      });
    }

    return res.status(500).json({ message: "Internal server error" });
  }
};
