import { Gender, Permissions, Role } from '../enums';

export interface UpdateEmployeeRequest {
	username?: string;
	password?: string;
	first_name?: string;
	last_name?: string;
	gender?: Gender;
	role?: Role;
	permissions?: Permissions[];
	body_rate?: number | null;
	feet_rate?: number | null;
	acupuncture_rate?: number | null;
	per_hour?: number | null;
}

export interface AddEmployeeRequest {
	username: string;
	password: string;
	first_name: string;
	last_name: string;
	gender: Gender;
	role: Role;
	permissions: Permissions[];
	body_rate?: number;
	feet_rate?: number;
	acupuncture_rate?: number;
	per_hour?: number;
}
