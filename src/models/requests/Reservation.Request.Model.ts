import { Gender, TipMethod } from '../enums';

export interface UpdateReservationRequest {
	reserved_date?: Date;
	employee_id?: number;
	service_id?: number;
	time?: number | null;
	beds_required?: number | null;
	customer_id?: number | null;
	phone_number?: string | null;
	vip_serial?: string | null;
	customer_name?: string | null;
	notes?: string | null;
	requested_gender?: Gender | null;
	requested_employee?: boolean;
	cash?: number | null;
	machine?: number | null;
	gift_card?: number | null;
	insurance?: number | null;
	cash_out?: number | null;
	vip?: number | null;
	tips?: number | null;
	tip_method?: TipMethod | null;
	message?: string | null;
	updated_by: string;
}

export interface AddReservationRequest {
	reserved_date: Date;
	employee_id: number;
	service_id: number;
	time?: number;
	beds_required?: number;
	created_by: string;
	customer_id?: number;
	phone_number?: string;
	vip_serial?: string;
	customer_name?: string;
	notes?: string;
	requested_gender?: Gender;
	requested_employee?: boolean;
	message?: string;
}
