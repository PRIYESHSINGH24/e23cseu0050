import api from "../utils/api";

export type TaskVehicle = {
  TaskID: string;
  Duration: number;
  Impact: number;
};

export const getVehicles = async (): Promise<TaskVehicle[]> => {
  const response = await api.get("/vehicles");
  return response.data.vehicles as TaskVehicle[];
};
