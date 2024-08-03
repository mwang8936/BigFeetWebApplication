const LENGTHS = {
	customer: {
		phone_number: 14, //10 digits + '(' + ')' + ' ' + '-'
		customer_name: 60,
	},
	employee: {
		username: 30,
		password: 30,
		first_name: 30,
		last_name: 30,
	},
	gift_card: {
		gift_card_id: 8,
	},
	login: {
		username: 30,
		password: 30,
	},
	service: {
		service_name: 30,
		shorthand: 20,
	},
	vip_package: {
		serial: 6,
	},
};

export default LENGTHS;
