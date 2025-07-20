export interface LoginRequest {
	username: string;
	password: string;
	device_id?: string;
	device_name?: string;
	device_model?: string;
	push_token?: string;
}
