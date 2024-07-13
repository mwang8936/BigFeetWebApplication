export default interface VipPackage {
	vip_package_id: number;
	serial: string;
	amount: number;
	schedules: { date: Date; employee_id: number }[];
}
