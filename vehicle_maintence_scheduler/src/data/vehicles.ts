export type Vehicle = {
	id: string;
	make?: string;
	model?: string;
	year?: number;
	status?: string;
	lastMaintenanceDate?: string;
	maintenanceIntervalDays?: number;
	nextMaintenanceDate?: string;
};

export const vehicles: Vehicle[] = [];