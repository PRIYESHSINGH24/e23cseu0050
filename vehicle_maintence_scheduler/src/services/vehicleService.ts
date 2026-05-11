import { vehicles } from "../data/vehicles";
import { v4 as uuid } from "uuid";

export const getAllVehicles = () => {
  return vehicles;
};

export const getVehicleById = (id: string) => {
  return vehicles.find((v) => v.id === id);
};

export const createVehicle = (data: any) => {
  const vehicle = {
    id: uuid(),
    ...data,
  };

  vehicles.push(vehicle);

  return vehicle;
};

export const updateVehicle = (
  id: string,
  data: any
) => {
  const index = vehicles.findIndex(
    (v) => v.id === id
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
    (v) => v.id === id
  );

  if (index === -1) return null;

  const deleted = vehicles[index];

  vehicles.splice(index, 1);

  return deleted;
};