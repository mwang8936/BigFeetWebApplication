export interface UpdateAcupunctureReportRequest {
	acupuncture_percentage?: number;
	massage_percentage?: number;
	insurance_percentage?: number;
}

export interface AddAcupunctureReportRequest {
	year: number;
	month: number;
	employee_id: number;
	acupuncture_percentage: number;
	massage_percentage: number;
	insurance_percentage: number;
}
