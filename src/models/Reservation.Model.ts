import Customer from './Customer.Model';
import { Gender, TipMethod } from './enums';
import { ServiceRecord } from './Service.Model';

export default interface Reservation {
	reservation_id: number;
	employee_id: number;
	date: Date;
	reserved_date: Date;
	service: ServiceRecord;
	time: number | null;
	beds_required: number | null;
	customer: Customer | null;
	requested_gender: Gender | null;
	requested_employee: boolean;
	cash: number | null;
	machine: number | null;
	vip: number | null;
	gift_card: number | null;
	insurance: number | null;
	cash_out: number | null;
	tips: number | null;
	tip_method: TipMethod | null;
	message: string | null;
	created_by: string;
	created_at: Date;
	updated_by: string;
	updated_at: Date;
}
