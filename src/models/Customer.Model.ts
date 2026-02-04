import Employee from './Employee.Model';
import Reservation from './Reservation.Model';
import VipPackage from './Vip-Package.Model';

export default interface Customer {
	customer_id: number;
	phone_number: string | null;
	vip_serial: string | null;
	customer_name: string | null;
	notes: string | null;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}

export interface PaginatedCustomer extends Customer {
	reservations: (Omit<Reservation, 'customer'> & { employee: Employee })[];
	vip_packages: VipPackage[];
}

export interface PaginatedCustomers {
	data: PaginatedCustomer[];
	total: number;
	page: number;
	pageSize: number;
	totalPages: number;
}
