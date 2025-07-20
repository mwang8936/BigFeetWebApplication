import { Language } from '../enums';

export interface UpdateProfileRequest {
	language?: Language;
}

export interface ChangeProfilePasswordRequest {
	old_password: string;
	new_password: string;
}

export interface LogoutRequest {
	device_id?: string;
}
