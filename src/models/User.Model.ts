import { Gender, Language, Permissions, Role } from './enums';

export default interface User {
	employee_id: number;
	username: string;
	first_name: string;
	last_name: string;
	gender: Gender;
	role: Role;
	permissions: Permissions[];
	body_rate: number | null;
	feet_rate: number | null;
	per_hour: number | null;
	language: Language;
	dark_mode: boolean;
	created_at: Date;
	updated_at: Date;
}
