export interface UpdateCustomerRequest {
	phone_number?: string | null;
	vip_serial?: string | null;
	customer_name?: string | null;
	notes?: string | null;
}

export interface AddCustomerRequest {
	phone_number?: string;
	vip_serial?: string;
	customer_name?: string;
	notes?: string;
}
