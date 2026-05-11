import { vehicles } from "../data/vehicles";
import { v4 as uuid } from "uuid";

import type { Vehicle } from "../data/vehicles";

const computeNextMaintenanceDate = (vehicle: Vehicle): Date | null => {
  if (vehicle.nextMaintenanceDate) {
    const parsed = new Date(vehicle.nextMaintenanceDate);
    return Number.isNaN(parsed.getTime()) ? null : parsed;
  }

  if (vehicle.lastMaintenanceDate && vehicle.maintenanceIntervalDays) {
    const last = new Date(vehicle.lastMaintenanceDate);
    if (Number.isNaN(last.getTime())) return null;

    const next = new Date(last);
    next.setDate(next.getDate() + vehicle.maintenanceIntervalDays);
    return next;
  }

  return null;
};

export const getAllVehicles = () => {
  return vehicles;
};

export const getVehicleById = (id: string) => {
  return vehicles.find((v: Vehicle) => v.id === id);
};

export const createVehicle = (data: Partial<Omit<Vehicle, "id">>) => {
  const vehicle: Vehicle = {
    id: uuid(),
    ...data,
  };

  vehicles.push(vehicle);

  return vehicle;
};

export const updateVehicle = (
  id: string,
  data: Partial<Omit<Vehicle, "id">>
) => {
  const index = vehicles.findIndex(
    (v: Vehicle) => v.id === id
  );

  if (index === -1) return null;

  vehicles[index] = {
    ...vehicles[index],
    ...data,
  };

  return vehicles[index];
};

export const deleteVehicle = (id: string) => {
  const index = vehicles.findIndex(
    (v: Vehicle) => v.id === id
  );

  if (index === -1) return null;

  const deleted = vehicles[index];

  vehicles.splice(index, 1);

  return deleted;
};

export const getUpcomingMaintenance = (daysAhead: number = 30) => {
  const now = new Date();
  const end = new Date(now);
  end.setDate(end.getDate() + daysAhead);

  return vehicles
    .map((vehicle) => {
      const nextMaintenanceDate = computeNextMaintenanceDate(vehicle);
      return { vehicle, nextMaintenanceDate };
    })
    .filter(({ nextMaintenanceDate }) => {
      if (!nextMaintenanceDate) return false;
      return nextMaintenanceDate >= now && nextMaintenanceDate <= end;
    })
    .map(({ vehicle, nextMaintenanceDate }) => ({
      ...vehicle,
      nextMaintenanceDate: nextMaintenanceDate!.toISOString(),
    }));
};