import i18n from '../utils/i18n.utils';

const PLACEHOLDERS = {
	customer: {
		search_customer: i18n.t('Search by name or phone number'),
		phone_number: '(123) 456-7890',
		customer_name: i18n.t('Add Customer Name'),
		notes: i18n.t('Add Notes'),
	},
	employee: {
		username: i18n.t('Add Username'),
		password: '******************',
		first_name: i18n.t('Add First Name'),
		last_name: i18n.t('Add Last Name'),
		permissions: i18n.t('Select Permissions'),
		body_rate: '0.00',
		feet_rate: '0.00',
		per_hour: '0.00',
	},
	reservation: {
		cash: '0.00',
		machine: '0.00',
		vip: '0.00',
		tips: '0.00',
		message: i18n.t('Add Message'),
	},
	service: {
		service_name: 'Body',
		shorthand: 'BD',
		time: '60',
		money: '50.00',
		body: '1',
		feet: '0',
		accupuncture: '0',
	},
	vip_package: {
		serial: '123456',
		amount: '1000.00',
	},
};

export default PLACEHOLDERS;
