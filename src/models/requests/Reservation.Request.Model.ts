import { Gender, TipMethod } from '../enums';

export interface UpdateReservationRequest {
	date?: Date;
	employee_id?: number | null;
	reserved_time?: Date;
	service_id?: number;
	phone_number?: number | null;
	customer_name?: string | null;
	notes?: string | null;
	requested_gender?: Gender | null;
	requested_employee?: boolean;
	cash?: number | null;
	machine?: number | null;
	vip?: number | null;
	tips?: number | null;
	tip_method?: TipMethod | null;
	is_completed?: boolean;
	message?: string | null;
	updated_by: string;
}

export interface AddReservationRequest {
	date: Date;
	employee_id: number | null;
	reserved_time: Date;
	service_id: number;
	created_by: string;
	phone_number?: number;
	customer_name?: string;
	notes?: string;
	requested_gender?: Gender;
	requested_employee?: boolean;
	message?: string;
}
