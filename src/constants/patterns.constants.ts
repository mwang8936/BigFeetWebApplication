const PATTERNS = {
	customer: {
		phone_number: '^[0-9]{10}$',
		customer_name: '^.{1,60}$',
		notes: '',
	},
	employee: {
		username: '^[A-Za-z0-9.]{1,30}$',
		first_name: '^[A-Za-z]{1,30}$',
		last_name: '^[A-Za-z]{1,30}$',
		gender: '',
		role: '',
		permissions: '',
		body_rate: '^[0-9.]{0,5}$',
		feet_rate: '^[0-9]{0,5}$',
		per_hour: '^[0-9]{0,5}$',
	},
	login: {
		username: '^[A-Za-z0-9.]{1,30}',
		password: '^.{1,30}',
	},
	profile: {
		language: '',
		dark_mode: '',
	},
	reservation: {},
	schedule: {},
	service: {
		service_name: '^.{1,50}$',
		shorthand: '^.{1,20}$',
		time: '^[0-9]{1,3}$',
		money: '^[0-9.]{1,6}$',
		body: '^[0-9]{1,4}$',
		feet: '^[0-9]{1,4}$',
	},
	vip_package: {
		serial: '[0-9]{1,6}',
		amount: '^[0-9]{1,6}$',
	},
};

export default PATTERNS;
