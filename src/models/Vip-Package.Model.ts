export default interface VipPackage {
	vip_package_id: number;
	serial: string;
	sold_amount: number;
	commission_amount: number;
	schedules: { date: Date; employee_id: number }[];
}
