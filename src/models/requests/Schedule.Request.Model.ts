import VipPackage from '../Vip-Package.Model';

export interface UpdateScheduleRequest {
	is_working?: boolean;
	start?: Date;
	end?: Date;
	vip_packages?: VipPackage[] | null;
	signed?: boolean;
}

export interface AddScheduleRequest {
	date: Date;
	employee_id: number;
}
