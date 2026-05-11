import { Request, Response } from "express";

import Log from "../utils/logger";

import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
  getUpcomingMaintenance,
} from "../services/vehicleService";



export const fetchVehicles = async (
  req: Request,
  res: Response
) => {
  await Log(
    "backend",
    "info",
    "controller",
    "Fetching all vehicles"
  );

  const vehicles = getAllVehicles();

  res.json(vehicles);
};

export const fetchVehicleById = async (
  req: Request,
  res: Response
) => {
  const vehicle = getVehicleById(
  req.params.id as string
);

  if (!vehicle) {
    await Log(
      "backend",
      "warn",
      "controller",
      "Vehicle not found"
    );

    return res.status(404).json({
      message: "Vehicle not found",
    });
  }

  await Log(
    "backend",
    "info",
    "controller",
    "Vehicle fetched successfully"
  );

  res.json(vehicle);
};

export const addVehicle = async (
  req: Request,
  res: Response
) => {
  const vehicle = createVehicle(req.body);

  await Log(
    "backend",
    "info",
    "service",
    "Vehicle created successfully"
  );

  res.status(201).json(vehicle);
};

export const editVehicle = async (
  req: Request,
  res: Response
) => {
 const updated = updateVehicle(
  req.params.id as string,
  req.body
);

  if (!updated) {
    await Log(
      "backend",
      "error",
      "service",
      "Vehicle update failed"
    );

    return res.status(404).json({
      message: "Vehicle not found",
    });
  }

  await Log(
    "backend",
    "info",
    "service",
    "Vehicle updated successfully"
  );

  res.json(updated);
};

export const removeVehicle = async (
  req: Request,
  res: Response
) => {
  const deleted = deleteVehicle(
  req.params.id as string
);

  if (!deleted) {
    await Log(
      "backend",
      "error",
      "service",
      "Vehicle delete failed"
    );

    return res.status(404).json({
      message: "Vehicle not found",
    });
  }

  await Log(
    "backend",
    "info",
    "service",
    "Vehicle deleted successfully"
  );

  res.json({
    message: "Vehicle deleted",
  });
};

export const fetchUpcomingMaintenance = async (
  req: Request,
  res: Response
) => {
  const daysRaw = req.query.days;
  const days = typeof daysRaw === "string" ? Number(daysRaw) : 30;
  const daysAhead = Number.isFinite(days) && days > 0 ? days : 30;

  await Log(
    "backend",
    "info",
    "controller",
    `Fetching upcoming maintenance (next ${daysAhead} days)`
  );

  const upcoming = getUpcomingMaintenance(daysAhead);
  res.json(upcoming);
};