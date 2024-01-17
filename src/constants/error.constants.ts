import i18n from '../utils/i18n.utils';
import { formatTimeFromNumber } from '../utils/string.utils';
import LENGTHS from './lengths.constants';
import NUMBERS from './numbers.constants';
import STORES from './store.constants';

const ERRORS = {
	customer: {
		search_customer: {
			invalid: i18n.t('Invalid search field.'),
		},
		phone_number: {
			required: i18n.t('Phone Number cannot be empty.'),
			invalid: i18n.t('Phone Number Invalid', {
				length: LENGTHS.customer.phone_number - 4,
			}),
		},
		customer_name: {
			required: i18n.t('Customer Name cannot be empty.'),
			invalid: i18n.t('Customer Name Invalid', {
				length: LENGTHS.customer.customer_name,
			}),
		},
		permissions: {
			get: i18n.t('You do not have permissions to get customers.'),
			edit: i18n.t('You do not have permissions to edit customers.'),
			add: i18n.t('You do not have permissions to add customers.'),
			delete: i18n.t('You do not have permission to delete customers.'),
		},
	},
	employee: {
		username: {
			required: i18n.t('Username cannot be empty.'),
			invalid: i18n.t('Username Invalid', {
				length: LENGTHS.employee.username,
			}),
		},
		password: {
			required: i18n.t('Password cannot be empty.'),
			invalid: i18n.t('Password Invalid', { max: LENGTHS.employee.password }),
			match: i18n.t('Passwords must match.'),
		},
		first_name: {
			required: i18n.t('First Name cannot be empty.'),
			invalid: i18n.t('First Name Invalid', {
				length: LENGTHS.employee.first_name,
			}),
		},
		last_name: {
			required: i18n.t('Last Name cannot be empty.'),
			invalid: i18n.t('Last Name Invalid', {
				length: LENGTHS.employee.last_name,
			}),
		},
		gender: {
			required: i18n.t('Gender cannot be empty.'),
		},
		role: {
			required: i18n.t('Role cannot be empty.'),
		},
		body_rate: {
			invalid: i18n.t('Body Rate Invalid', { max: NUMBERS.employee.body_rate }),
		},
		feet_rate: {
			invalid: i18n.t('Feet Rate Invalid', { max: NUMBERS.employee.feet_rate }),
		},
		per_hour: {
			invalid: i18n.t('Per Hour Invalid', { max: NUMBERS.employee.per_hour }),
		},
		permissions: {
			get: i18n.t('You do not have permissions to get employees.'),
			edit: i18n.t('You do not have permissions to edit employees.'),
			add: i18n.t('You do not have permissions to add employees.'),
			delete: i18n.t('You do not have permission to delete employees.'),
		},
	},
	profile: {
		language: {
			required: i18n.t('Language cannot be empty.'),
		},
	},
	reservation: {
		date: {
			required: i18n.t('Date cannot be empty.'),
			invalid: i18n.t(
				'Date must be in format: MM/DD/YYYY and selected date is outside of date range.'
			),
		},
		time: {
			required: i18n.t('Time cannot be empty.'),
			invalid: i18n.t('Time Invalid', {
				start: formatTimeFromNumber(STORES.start),
				end: formatTimeFromNumber(STORES.end),
			}),
		},
		employee_id: {
			required: i18n.t('Employee cannot be empty.'),
		},
		service_id: {
			required: i18n.t('Service cannot be empty.'),
		},
		cash: {
			invalid: i18n.t('Cash Invalid', { max: NUMBERS.reservation.cash }),
		},
		machine: {
			invalid: i18n.t('Machine Invalid', { max: NUMBERS.reservation.cash }),
		},
		vip: {
			invalid: i18n.t('Vip Invalid', { max: NUMBERS.reservation.cash }),
		},
		tips: {
			invalid: i18n.t('Tips Invalid', { max: NUMBERS.reservation.cash }),
		},
		permissions: {
			get: i18n.t('You do not have permissions to get reservations.'),
			edit: i18n.t('You do not have permissions to edit reservations.'),
			add: i18n.t('You do not have permissions to add reservations.'),
			delete: i18n.t('You do not have permission to delete reservations.'),
		},
	},
	schedule: {
		start: {
			required: i18n.t('Start time cannot be empty.'),
			invalid: i18n.t('Time Invalid', {
				start: formatTimeFromNumber(STORES.start),
				end: formatTimeFromNumber(STORES.end),
			}),
		},
		end: {
			required: i18n.t('End time cannot be empty.'),
			invalid: i18n.t('End Time Invalid', {
				start: formatTimeFromNumber(STORES.start),
				end: formatTimeFromNumber(STORES.end),
			}),
		},
		filter: {
			required: i18n.t('Date cannot be empty.'),
			invalid: i18n.t(
				'Date must be in format: MM/DD/YYYY and selected date is outside of date range.'
			),
		},
		permissions: {
			get: i18n.t('You do not have permissions to get schedules.'),
			edit: i18n.t('You do not have permissions to edit schedules.'),
			add: i18n.t('You do not have permissions to add schedules.'),
			delete: i18n.t('You do not have permission to delete schedules.'),
			signed: i18n.t(
				"You do not have permission to sign other people's schedules."
			),
		},
	},
	service: {
		service_name: {
			required: i18n.t('Service Name cannot be empty.'),
			invalid: i18n.t('Service Name Invalid', {
				length: LENGTHS.service.service_name,
			}),
		},
		shorthand: {
			required: i18n.t('Shorthand cannot be empty.'),
			invalid: i18n.t('Shorthand Invalid', {
				length: LENGTHS.service.shorthand,
			}),
		},
		time: {
			required: i18n.t('Time cannot be empty.'),
			invalid: i18n.t('Minute Invalid', { max: NUMBERS.service.time }),
		},
		money: {
			required: i18n.t('Money cannot be empty.'),
			invalid: i18n.t('Money Invalid', { max: NUMBERS.service.money }),
		},
		body: {
			required: i18n.t('Body cannot be empty.'),
			invalid: i18n.t('Body Invalid', { max: NUMBERS.service.body }),
		},
		feet: {
			required: i18n.t('Feet cannot be empty.'),
			invalid: i18n.t('Feet Invalid', { max: NUMBERS.service.feet }),
		},
		accupuncture: {
			required: i18n.t('Accupuncture cannot be empty.'),
			invalid: i18n.t('Accupuncture Invalid', {
				max: NUMBERS.service.accupuncture,
			}),
		},
		color: {
			required: i18n.t('A color must be selected.'),
		},
		permissions: {
			get: i18n.t('You do not have permissions to get services.'),
			edit: i18n.t('You do not have permissions to edit services.'),
			add: i18n.t('You do not have permissions to add services.'),
			delete: i18n.t('You do not have permission to delete services.'),
		},
	},
	vip_package: {
		serial: {
			required: i18n.t('Serial cannot be empty.'),
			invalid: i18n.t('Serial Invalid', { length: LENGTHS.vip_package.serial }),
		},
		amount: {
			required: i18n.t('Amount cannot be empty.'),
			invalid: i18n.t('Amount Invalid', {
				max: NUMBERS.vip_package.amount,
			}),
		},
		permissions: {
			get: i18n.t('You do not have permissions to get vip packages.'),
			edit: i18n.t('You do not have permissions to edit vip packages.'),
			add: i18n.t('You do not have permissions to add vip packages.'),
			delete: i18n.t('You do not have permission to delete vip packages.'),
		},
	},
	warnings: {
		no_beds: {
			title: i18n.t('No beds available!'),
			message: i18n.t('Bed Conflict', { max: STORES.beds }),
		},
		conflicts: {
			title: i18n.t('Conflicting Schedule!'),
			message: i18n.t(
				'There is another reservation at this time. Please choose another time or employee.'
			),
		},
	},
	required: i18n.t('You are missing a required input.'),
	invalid: i18n.t('An input is invalid.'),
	no_changes: i18n.t('No changes have been made.'),
};

export default ERRORS;
