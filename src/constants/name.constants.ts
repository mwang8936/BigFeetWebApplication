const NAMES = {
	customer: {
		search_customer: 'search_customer',
		phone_number: 'phone_number',
		customer_name: 'customer_name',
		notes: 'notes',
	},
	employee: {
		username: 'username',
		password: 'password',
		retype_password: 'retype_password',
		first_name: 'first_name',
		last_name: 'last_name',
		permissions: 'permissions',
		body_rate: 'body_rate',
		feet_rate: 'feet_rate',
		acupuncture_rate: 'acupuncture_rate',
		per_hour: 'per_hour',
	},
	profile: {
		dark_mode: 'dark_mode',
	},
	reservation: {
		requested_employee: 'employee_requested',
		cash: 'cash',
		machine: 'machine',
		vip: 'vip',
		tips: 'tips',
		message: 'message',
	},
	schedule: {
		is_working: 'is_working',
		sign_off: 'sign_off',
	},
	service: {
		service_name: 'service_name',
		shorthand: 'shorthand',
		time: 'time',
		money: 'money',
		body: 'body',
		feet: 'feet',
		acupuncture: 'acupuncture',
		bed_required: 'bed_required',
	},
	vip_package: {
		serial: 'serial',
		amount: 'amount',
		employee_ids: 'employee_ids',
	},
};

export default NAMES;
