export interface UpdateCustomerRequest {
	customer_name?: string;
	notes?: string | null;
}

export interface AddCustomerRequest {
	phone_number: number;
	customer_name: string;
	notes?: string;
}
