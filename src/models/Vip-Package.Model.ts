import { PaymentMethod } from './enums';

export default interface VipPackage {
	vip_package_id: number;
	payment_method: PaymentMethod;
	serial: string;
	sold_amount: number;
	commission_amount: number;
	employee_ids: number[];
	created_at: Date;
	updated_at: Date;
}
