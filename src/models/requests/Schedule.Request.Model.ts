import VipPackage from '../Vip-Package.Model';

export interface UpdateScheduleRequest {
	is_working?: boolean;
	start?: Date | null;
	end?: Date | null;
	vip_packages?: VipPackage[];
	signed?: boolean;
}

export interface AddScheduleRequest {
	date: Date;
	employee_id: number;
	is_working?: boolean;
	start?: Date | null;
	end?: Date | null;
	vip_packages?: VipPackage[];
	signed?: boolean;
}
