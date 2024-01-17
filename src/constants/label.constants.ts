import i18n from '../utils/i18n.utils';

const LABELS = {
	customer: {
		search_customer: i18n.t('Search Customer'),
		phone_number: i18n.t('Phone Number'),
		customer_name: i18n.t('Customer Name'),
		notes: i18n.t('Customer Notes'),
	},
	employee: {
		username: i18n.t('Username'),
		password: i18n.t('Password'),
		retype_password: i18n.t('Retype Password'),
		first_name: i18n.t('First Name'),
		last_name: i18n.t('Last Name'),
		gender: i18n.t('Gender'),
		role: i18n.t('Role'),
		permissions: i18n.t('Permissions'),
		body_rate: i18n.t('Body Rate'),
		feet_rate: i18n.t('Feet Rate'),
		per_hour: i18n.t('Hourly Rate'),
	},
	profile: {
		language: i18n.t('Language'),
		dark_mode: i18n.t('Dark Mode'),
	},
	reservation: {
		date: i18n.t('Select Date'),
		time: i18n.t('Select Time'),
		employee_id: i18n.t('Select Employee'),
		service_id: i18n.t('Select Service'),
		requested_gender: i18n.t('Requested Gender'),
		requested_employee: i18n.t('Requested Employee'),
		cash: i18n.t('Cash'),
		machine: i18n.t('Machine'),
		vip: i18n.t('VIP'),
		tip_method: i18n.t('Tip Method'),
		tips: i18n.t('Tips'),
		message: i18n.t('Message'),
	},
	schedule: {
		start: i18n.t('Select Start Time'),
		end: i18n.t('Select End Time'),
		is_working: i18n.t('Is Working'),
		filter: i18n.t('Select Date'),
	},
	service: {
		service_name: i18n.t('Service Name'),
		shorthand: i18n.t('Shorthand'),
		time: i18n.t('Time (Minutes)'),
		money: i18n.t('Money'),
		body: i18n.t('Body'),
		feet: i18n.t('Feet'),
		accupuncture: i18n.t('Accupuncture'),
		color: i18n.t('Color'),
	},
};

export default LABELS;
