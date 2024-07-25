export default interface VipPackage {
	vip_package_id: number;
	serial: string;
	sold_amount: number;
	commission_amount: number;
	employee_ids: number[];
	schedules: { date: Date; employee_id: number }[];
}
