import api from "../utils/api";

export type Depot = {
  ID: number;
  MechanicHours: number;
};

export const getDepots = async (): Promise<Depot[]> => {
  const response = await api.get("/depots");
  return response.data.depots as Depot[];
};
