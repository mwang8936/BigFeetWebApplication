import Customer from './Customer.Model';
import Service from './Service.Model';
import { Gender, TipMethod } from './enums';

export default interface Reservation {
	reservation_id: number;
	reserved_time: Date;
	service: Service;
	customer: Customer | null;
	requested_gender?: Gender;
	requested_employee: boolean;
	cash: number | null;
	machine: number | null;
	vip: number | null;
	tips: number | null;
	tip_method: TipMethod | null;
	is_completed: boolean;
	message: string | null;
	created_by: string;
	created_at: Date;
	updated_by: string;
	updated_at: Date;
}
