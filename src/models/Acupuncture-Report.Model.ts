import Employee from './Employee.Model';

export interface DataRow {
	date: Date;
	acupuncture: number;
	massage: number;
	insurance: number;
}

export default interface AcupunctureReport {
	year: number;
	month: number;
	employee: Employee;
	acupuncture_percentage: number;
	massage_percentage: number;
	insurance_percentage: number;
	data: DataRow[];
	created_at: Date;
	updated_at: Date;
}
