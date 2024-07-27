export interface UpdateCustomerRequest {
	customer_name?: string | null;
	notes?: string | null;
}

export interface AddCustomerRequest {
	phone_number: string;
	customer_name?: string;
	notes?: string;
}
