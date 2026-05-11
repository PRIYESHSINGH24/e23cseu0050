import { Request, Response } from "express";

import Log from "../utils/logger";

import {
  getAllVehicles,
  getVehicleById,
  createVehicle,
  updateVehicle,
  deleteVehicle,
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