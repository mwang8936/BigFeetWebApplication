import Employee from './Employee.Model';
import Reservation from './Reservation.Model';
import VipPackage from './Vip-Package.Model';

export default interface Schedule {
	date: Date;
	employee: Employee | null;
	is_working: boolean;
	start: Date | null;
	end: Date | null;
	reservations: Reservation[] | null;
	vip_packages: VipPackage[];
	signed: boolean;
}
