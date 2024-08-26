import LENGTHS from './lengths.constants';

const PATTERNS = {
	customer: {
		phone_number: '\\(\\d{3}\\) \\d{3}-\\d{4}',
		customer_name: `^.{1,${LENGTHS.customer.customer_name}}$`,
		vip_serial: `^[0-9]{${LENGTHS.customer.vip_serial}}$`,
	},
	employee: {
		username: `^[A-Za-z0-9.]{1,${LENGTHS.employee.username}}$`,
		password: `^[a-zA-Z0-9~!@#$%^&*\\(\\)_\\-+=\\{\\}\\[\\]:;"'\`,<.>?]{1,${LENGTHS.employee.password}}$`,
		first_name: `^[A-Za-z\\s'\\-]{1,${LENGTHS.employee.first_name}}$`,
		last_name: `^[A-Za-z\\s'\\-]{1,${LENGTHS.employee.last_name}}$`,
	},
	gift_card: {
		gift_card_id: '^T\\d{6,7}$',
	},
	login: {
		username: `^[A-Za-z0-9.]{1,${LENGTHS.employee.username}}`,
		password: `^.{1,${LENGTHS.employee.password}}`,
	},
	service: {
		service_name: `^.{1,${LENGTHS.service.service_name}}$`,
		shorthand: `^.{1,${LENGTHS.service.shorthand}}$`,
	},
	vip_package: {
		serial: `^[0-9]{${LENGTHS.vip_package.serial}}$`,
	},
};

export default PATTERNS;
