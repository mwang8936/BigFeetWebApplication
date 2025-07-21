import { PaymentMethod } from '../enums';

export interface UpdateVipPackageRequest {
	serial?: string;
	payment_method?: PaymentMethod;
	sold_amount?: number;
	commission_amount?: number;
	date?: Date;
	employee_ids?: number[];
}

export interface AddVipPackageRequest {
	serial: string;
	payment_method: PaymentMethod;
	sold_amount: number;
	commission_amount: number;
	date: Date;
	employee_ids: number[];
}
