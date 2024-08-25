export interface UpdateScheduleRequest {
	is_working?: boolean;
	on_call?: boolean;
	start?: Date | null;
	end?: Date | null;
	priority?: number | null;
	signed?: boolean;
}

export interface SignScheduleRequest {
	password: string;
}

export interface AddScheduleRequest {
	date: Date;
	employee_id: number;
	is_working?: boolean;
	on_call?: boolean;
	start?: Date | null;
	end?: Date | null;
	priority?: number | null;
	signed?: boolean;
}
