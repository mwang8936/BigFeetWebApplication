const PLACEHOLDERS = {
	customer: {
		search_customer: 'Search by name or phone number',
		phone_number: '(123) 456-7890',
		customer_name: 'Add Customer Name',
		notes: 'Add Notes',
	},
	employee: {
		username: 'Add Username',
		password: '******************',
		first_name: 'Add First Name',
		last_name: 'Add Last Name',
		permissions: 'Select Permissions',
		body_rate: '0.00',
		feet_rate: '0.00',
		acupuncture_rate: '0.00',
		per_hour: '0.00',
	},
	reservation: {
		cash: '0.00',
		machine: '0.00',
		vip: '0.00',
		gift_card: '0.00',
		insurance: '0.00',
		tips: '0.00',
		message: 'Add Message',
	},
	service: {
		service_name: 'Body',
		shorthand: 'BD',
		time: '60',
		money: '50.00',
		body: '1',
		feet: '0',
		acupuncture: '0',
		beds_required: '0',
	},
	vip_package: {
		serial: '123456',
		amount: '1000.00',
		employee_ids: 'Select Employees',
	},
};

export default PLACEHOLDERS;
