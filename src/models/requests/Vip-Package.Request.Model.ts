export interface UpdateVipPackageRequest {
	amount?: number;
	date?: Date;
	employee_ids?: number[];
}

export interface AddVipPackageRequest {
	serial: string;
	amount: number;
	date: Date;
	employee_ids: number[];
}
