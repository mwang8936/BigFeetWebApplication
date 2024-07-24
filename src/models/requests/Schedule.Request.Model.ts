export interface UpdateScheduleRequest {
	is_working?: boolean;
	start?: Date | null;
	end?: Date | null;
	priority?: number | null;
	signed?: boolean;
}

export interface AddScheduleRequest {
	date: Date;
	employee_id: number;
	is_working?: boolean;
	start?: Date | null;
	end?: Date | null;
	priority?: number | null;
	signed?: boolean;
}
