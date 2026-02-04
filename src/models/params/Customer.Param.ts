export interface GetCustomersParam {
	page?: number;
	page_size?: number;
	search?: string;
	with_deleted?: boolean;
}

export interface GetCustomerParam {
	with_deleted?: boolean;
}

export type SearchCustomerParam =
	| {
			phone_number: string;
			vip_serial?: never;
			with_deleted?: boolean;
	  }
	| {
			phone_number?: never;
			vip_serial: string;
			with_deleted?: boolean;
	  };
