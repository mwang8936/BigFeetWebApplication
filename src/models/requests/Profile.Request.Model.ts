import { Language } from '../enums';

export interface UpdateProfileRequest {
	language?: Language;
	dark_mode?: boolean;
}

export interface ChangeProfilePasswordRequest {
	old_password: string;
	new_password: string;
}
