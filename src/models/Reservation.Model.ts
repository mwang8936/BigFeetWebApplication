import Customer from './Customer.Model';
import Service from './Service.Model';
import { Gender, TipMethod } from './enums';

export default interface Reservation {
	reservation_id: number;
	employee_id: number;
	date: Date;
	reserved_date: Date;
	service: Service;
	customer: Customer | null;
	requested_gender: Gender | null;
	requested_employee: boolean;
	cash: number | null;
	machine: number | null;
	vip: number | null;
	tips: number | null;
	tip_method: TipMethod | null;
	message: string | null;
	created_by: string;
	created_at: Date;
	updated_by: string;
	updated_at: Date;
}
