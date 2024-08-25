import Employee from './Employee.Model';
import Reservation from './Reservation.Model';
import VipPackage from './Vip-Package.Model';

export default interface Schedule {
	date: Date;
	employee: Employee;
	is_working: boolean;
	on_call: boolean;
	start: Date | null;
	end: Date | null;
	priority: number | null;
	add_award: boolean;
	reservations: Reservation[];
	vip_packages: VipPackage[];
	signed: boolean;
}
