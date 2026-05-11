import express from "express";

import {
  fetchVehicles,
  fetchVehicleById,
  addVehicle,
  editVehicle,
  removeVehicle,
} from "../controllers/vehicleController";

const router = express.Router();

router.get("/", fetchVehicles);

router.get("/:id", fetchVehicleById);

router.post("/", addVehicle);

router.put("/:id", editVehicle);

router.delete("/:id", removeVehicle);

export default router;