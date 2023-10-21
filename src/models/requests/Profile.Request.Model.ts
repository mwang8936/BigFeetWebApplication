import { Language } from '../enums';

export interface UpdateProfileRequest {
	language?: Language;
	dark_mode?: boolean;
}
