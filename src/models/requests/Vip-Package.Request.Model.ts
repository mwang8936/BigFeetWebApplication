export interface UpdateVipPackageRequest {
	amount?: number;
	schedules?: { date: Date; employee_id: number }[];
}

export interface AddVipPackageRequest {
	serial: string;
	amount: number;
	schedules: { date: Date; employee_id: number }[];
}
