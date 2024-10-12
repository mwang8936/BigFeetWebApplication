import Employee from './Employee.Model';
import { PayrollOption, PayrollPart } from './enums';

export interface DataRow {
	date: Date;
	start: Date | null;
	end: Date | null;
	body_sessions: number;
	requested_body_sessions: number;
	feet_sessions: number;
	requested_feet_sessions: number;
	acupuncture_sessions: number;
	requested_acupuncture_sessions: number;
	total_cash: number;
	total_machine: number;
	total_vip: number;
	total_gift_card: number;
	total_insurance: number;
	total_cash_out: number;
	tips: number;
	vip_amount: number;
}

export default interface Payroll {
	year: number;
	month: number;
	part: PayrollPart;
	employee: Employee;
	option: PayrollOption;
	cheque_amount: number | null;
	data: DataRow[];
	created_at: Date;
	updated_at: Date;
}
