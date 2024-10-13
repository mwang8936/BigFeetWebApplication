import { PayrollOption, PayrollPart } from '../enums';

export interface UpdatePayrollRequest {
	option?: PayrollOption;
	cheque_amount?: number | null;
}

export interface AddPayrollRequest {
	year: number;
	month: number;
	part: PayrollPart;
	employee_id: number;
	option: PayrollOption;
	cheque_amount?: number | null;
}
