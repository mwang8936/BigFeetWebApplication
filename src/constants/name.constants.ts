const NAMES = {
	customer: {
		search_customer: 'search_customer',
		phone_number: 'phone_number',
		vip_serial: 'vip_serial',
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
	gift_card: {
		gift_card_id: 'gift_card_id',
		payment_amount: 'payment_amount',
	},
	login: {
		username: 'username',
		password: 'password',
		remember_me: 'remember_me',
	},
	profile: {
		dark_mode: 'dark_mode',
	},
	reservation: {
		requested_employee: 'employee_requested',
		cash: 'cash',
		machine: 'machine',
		vip: 'vip',
		gift_card: 'gift_card',
		insurance: 'insurance',
		tips: 'tips',
		message: 'message',
	},
	schedule: {
		priority: 'priority',
		is_working: 'is_working',
		on_call: 'on_call',
		add_award: 'add_award',
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
		beds_required: 'beds_required',
	},
	vip_package: {
		serial: 'serial',
		sold_amount: 'sold_amount',
		commission_amount: 'commission_amount',
		employee_ids: 'employee_ids',
	},
};

export default NAMES;
