import LENGTHS from './lengths.constants';
import NUMBERS from './numbers.constants';
import STORES from './store.constants';

import { formatTimeFromNumber } from '../utils/string.utils';

const ERRORS = {
	customer: {
		search_customer: {
			invalid: {
				key: 'Invalid search field.',
				value: {},
			},
		},
		phone_number: {
			required: 'Phone Number and VIP Serial cannot both be empty.',
			invalid: {
				key: 'Phone Number Invalid',
				value: {
					length: LENGTHS.customer.phone_number - 4,
				},
			},
		},
		vip_serial: {
			required: 'Phone Number and VIP Serial cannot both be empty.',
			invalid: {
				key: 'VIP Serial Invalid',
				value: {
					length: LENGTHS.customer.vip_serial,
				},
			},
		},
		customer_name: {
			invalid: {
				key: 'Customer Name Invalid',
				value: {
					length: LENGTHS.customer.customer_name,
				},
			},
		},
		permissions: {
			get: 'You do not have permissions to get customers.',
			edit: 'You do not have permissions to edit customers.',
			add: 'You do not have permissions to add customers.',
			delete: 'You do not have permission to delete customers.',
		},
	},
	employee: {
		username: {
			required: 'Username cannot be empty.',
			invalid: {
				key: 'Username Invalid',
				value: {
					length: LENGTHS.employee.username,
				},
			},
		},
		password: {
			required: 'Password cannot be empty.',
			invalid: {
				key: 'Password Invalid',
				value: { max: LENGTHS.employee.password },
			},
			match: 'Passwords must match.',
		},
		first_name: {
			required: 'First Name cannot be empty.',
			invalid: {
				key: 'First Name Invalid',
				value: {
					length: LENGTHS.employee.first_name,
				},
			},
		},
		last_name: {
			required: 'Last Name cannot be empty.',
			invalid: {
				key: 'Last Name Invalid',
				value: {
					length: LENGTHS.employee.last_name,
				},
			},
		},
		gender: {
			required: 'Gender cannot be empty.',
		},
		role: {
			required: 'Role cannot be empty.',
		},
		body_rate: {
			invalid: {
				key: 'Body Rate Invalid',
				value: { max: NUMBERS.employee.body_rate },
			},
		},
		feet_rate: {
			invalid: {
				key: 'Feet Rate Invalid',
				value: { max: NUMBERS.employee.feet_rate },
			},
		},
		acupuncture_rate: {
			invalid: {
				key: 'Acupuncture Rate Invalid',
				value: {
					max: NUMBERS.employee.acupuncture_rate,
				},
			},
		},
		per_hour: {
			invalid: {
				key: 'Per Hour Invalid',
				value: { max: NUMBERS.employee.per_hour },
			},
		},
		permissions: {
			get: 'You do not have permissions to get employees.',
			edit: 'You do not have permissions to edit employees.',
			add: 'You do not have permissions to add employees.',
			delete: 'You do not have permission to delete employees.',
		},
	},
	gift_card: {
		gift_card_id: {
			required: 'Gift Card ID cannot be empty.',
			invalid: {
				key: "Gift Card ID must start with a 't' and be followed by 6 or 7 digits.",
				value: {},
			},
		},
		date: {
			required: 'Date cannot be empty.',
			invalid: {
				key: 'Date must be in format: MM/DD/YYYY and selected date is outside of date range.',
				value: {},
			},
		},
		payment_method: {
			required: 'Payment Method cannot be empty.',
		},
		payment_amount: {
			required: 'Payment Amount cannot be empty.',
			invalid: {
				key: 'Payment Amount Invalid',
				value: {
					max: NUMBERS.gift_card.payment_amount,
				},
			},
		},
		permissions: {
			get: 'You do not have permissions to get gift cards.',
			edit: 'You do not have permissions to edit gift cards.',
			add: 'You do not have permissions to add gift cards.',
			delete: 'You do not have permission to delete gift cards.',
		},
	},
	login: {
		username: {
			required: 'Username cannot be empty.',
			invalid: {
				key: 'Username Invalid',
				value: {
					length: LENGTHS.login.username,
				},
			},
		},
		password: {
			required: 'Password cannot be empty.',
			invalid: {
				key: 'Password Invalid',
				value: { max: LENGTHS.login.password },
			},
		},
	},
	profile: {
		language: {
			required: 'Language cannot be empty.',
		},
	},
	reservation: {
		date: {
			required: 'Date cannot be empty.',
			invalid: {
				key: 'Date must be in format: MM/DD/YYYY and selected date is outside of date range.',
				value: {},
			},
		},
		time: {
			required: 'Time cannot be empty.',
			invalid: {
				key: 'Time Invalid',
				value: {
					start: formatTimeFromNumber(STORES.start),
					end: formatTimeFromNumber(STORES.end),
				},
			},
		},
		employee_id: {
			required: 'Employee cannot be empty.',
		},
		service_id: {
			required: 'Service cannot be empty.',
		},
		cash: {
			invalid: {
				key: 'Cash Invalid',
				value: { max: NUMBERS.reservation.cash },
			},
		},
		machine: {
			invalid: {
				key: 'Machine Invalid',
				value: { max: NUMBERS.reservation.machine },
			},
		},
		vip: {
			invalid: { key: 'Vip Invalid', value: { max: NUMBERS.reservation.vip } },
		},
		gift_card: {
			invalid: {
				key: 'Gift Card Invalid',
				value: { max: NUMBERS.reservation.gift_card },
			},
		},
		insurance: {
			invalid: {
				key: 'Acupuncture Insurance Invalid',
				value: { max: NUMBERS.reservation.insurance },
			},
		},
		tips: {
			invalid: {
				key: 'Tips Invalid',
				value: { max: NUMBERS.reservation.cash },
			},
		},
		permissions: {
			get: 'You do not have permissions to get reservations.',
			edit: 'You do not have permissions to edit reservations.',
			add: 'You do not have permissions to add reservations.',
			delete: 'You do not have permission to delete reservations.',
		},
	},
	schedule: {
		start: {
			required: 'Start time cannot be empty.',
			invalid: {
				key: 'Time Invalid',
				value: {
					start: formatTimeFromNumber(STORES.start),
					end: formatTimeFromNumber(STORES.end),
				},
			},
		},
		end: {
			required: 'End time cannot be empty.',
			invalid: {
				key: 'End Time Invalid',
				value: {
					start: formatTimeFromNumber(STORES.start),
					end: formatTimeFromNumber(STORES.end),
				},
			},
		},
		filter: {
			required: 'Date cannot be empty.',
			invalid: {
				key: 'Date must be in format: MM/DD/YYYY and selected date is outside of date range.',
				value: {},
			},
		},
		permissions: {
			get: 'You do not have permissions to get schedules.',
			edit: 'You do not have permissions to edit schedules.',
			add: 'You do not have permissions to add schedules.',
			delete: 'You do not have permission to delete schedules.',
			signed: "You do not have permission to sign other people's schedules.",
		},
	},
	service: {
		service_name: {
			required: 'Service Name cannot be empty.',
			invalid: {
				key: 'Service Name Invalid',
				value: {
					length: LENGTHS.service.service_name,
				},
			},
		},
		shorthand: {
			required: 'Shorthand cannot be empty.',
			invalid: {
				key: 'Shorthand Invalid',
				value: {
					length: LENGTHS.service.shorthand,
				},
			},
		},
		time: {
			required: 'Time cannot be empty.',
			invalid: { key: 'Minute Invalid', value: { max: NUMBERS.service.time } },
		},
		money: {
			required: 'Money cannot be empty.',
			invalid: { key: 'Money Invalid', value: { max: NUMBERS.service.money } },
		},
		body: {
			required: 'Body cannot be empty.',
			invalid: { key: 'Body Invalid', value: { max: NUMBERS.service.body } },
		},
		feet: {
			required: 'Feet cannot be empty.',
			invalid: { key: 'Feet Invalid', value: { max: NUMBERS.service.feet } },
		},
		acupuncture: {
			required: 'Acupuncture cannot be empty.',
			invalid: {
				key: 'Acupuncture Invalid',
				value: {
					max: NUMBERS.service.acupuncture,
				},
			},
		},
		beds_required: {
			required: 'Beds Required cannot be empty.',
			invalid: {
				key: 'Beds Required Invalid',
				value: {
					max: STORES.beds,
				},
			},
		},
		color: {
			required: 'A color must be selected.',
		},
		permissions: {
			get: 'You do not have permissions to get services.',
			edit: 'You do not have permissions to edit services.',
			add: 'You do not have permissions to add services.',
			delete: 'You do not have permission to delete services.',
		},
	},
	vip_package: {
		serial: {
			required: 'Serial cannot be empty.',
			invalid: {
				key: 'Serial Invalid',
				value: { length: LENGTHS.vip_package.serial },
			},
		},
		sold_amount: {
			required: 'Sold Amount cannot be empty.',
			invalid: {
				key: 'Sold Amount Invalid',
				value: {
					max: NUMBERS.vip_package.sold_amount,
				},
			},
		},
		commission_amount: {
			required: 'Commission Amount cannot be empty.',
			invalid: {
				key: 'Commission Amount Invalid',
				value: {
					max: NUMBERS.vip_package.commission_amount,
				},
			},
		},
		permissions: {
			get: 'You do not have permissions to get vip packages.',
			edit: 'You do not have permissions to edit vip packages.',
			add: 'You do not have permissions to add vip packages.',
			delete: 'You do not have permission to delete vip packages.',
		},
	},
	warnings: {
		no_beds: {
			title: 'No beds available!',
			message: { key: 'Bed Conflict', value: { max: STORES.beds } },
		},
		conflicts: {
			title: 'Conflicting Schedule!',
			message: 'There is another reservation at this time for this employee.',
		},
		gender_mismatch: {
			title: 'Gender Mismatch!',
			message:
				'This employee does not have the requested gender. Please choose another employee.',
		},
	},
	required: 'You are missing a required input.',
	invalid: 'An input is invalid.',
	no_changes: 'No changes have been made.',
};

export default ERRORS;
