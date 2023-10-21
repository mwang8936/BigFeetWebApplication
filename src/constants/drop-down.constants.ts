import { Gender, Language, Role, ServiceColor } from '../models/enums';
import Employee from '../models/Employee.Model';

import RedIcon from '../assets/Red_Icon.svg';
import BlueIcon from '../assets/Blue_Icon.svg';
import YellowIcon from '../assets/Yellow_Icon.svg';
import GreenIcon from '../assets/Green_Icon.svg';
import OrangeIcon from '../assets/Orange_Icon.svg';
import PurpleIcon from '../assets/Purple_Icon.svg';
import GrayIcon from '../assets/Gray_Icon.svg';
import BlackIcon from '../assets/Black_Icon.svg';

import MaleIcon from '../assets/Male_Icon.svg';
import FemaleIcon from '../assets/Female_Icon.svg';

import CanadaFlagIcon from '../assets/Canada_Flag.png';
import ChinaFlagIcon from '../assets/China_Flag.png';
import Service from '../models/Service.Model';
import Customer from '../models/Customer.Model';
import VipPackage from '../models/Vip-Package.Model';

export const colorDropDownItems = [
	{ id: null, name: 'No Color Selected' },
	{ id: ServiceColor.RED, name: ServiceColor.RED, avatar: RedIcon },
	{ id: ServiceColor.BLUE, name: ServiceColor.BLUE, avatar: BlueIcon },
	{
		id: ServiceColor.YELLOW,
		name: ServiceColor.YELLOW,
		avatar: YellowIcon,
	},
	{ id: ServiceColor.GREEN, name: ServiceColor.GREEN, avatar: GreenIcon },
	{
		id: ServiceColor.ORANGE,
		name: ServiceColor.ORANGE,
		avatar: OrangeIcon,
	},
	{
		id: ServiceColor.PURPLE,
		name: ServiceColor.PURPLE,
		avatar: PurpleIcon,
	},
	{ id: ServiceColor.GRAY, name: ServiceColor.GRAY, avatar: GrayIcon },
	{ id: ServiceColor.BLACK, name: ServiceColor.BLACK, avatar: BlackIcon },
];

export const genderDropDownItems = [
	{ id: null, name: 'No Gender Selected' },
	{ id: Gender.MALE, name: Gender.MALE, avatar: MaleIcon },
	{ id: Gender.FEMALE, name: Gender.FEMALE, avatar: FemaleIcon },
];

export const languageDropDownItems = [
	{ id: null, name: 'No Language Selected' },
	{ id: Language.ENGLISH, name: 'English', avatar: CanadaFlagIcon },
	{
		id: Language.SIMPLIFIED_CHINESE,
		name: '简体中文',
		avatar: ChinaFlagIcon,
	},
	{
		id: Language.TRADITIONAL_CHINESE,
		name: '繁體中文',
		avatar: ChinaFlagIcon,
	},
];

export const roleDropDownItems = [
	{ id: null, name: 'No Role Selected' },
	{ id: Role.STORE_EMPLOYEE, name: Role.STORE_EMPLOYEE },
	{ id: Role.RECEPTIONIST, name: Role.RECEPTIONIST },
	{ id: Role.MANAGER, name: Role.MANAGER },
	{ id: Role.DEVELOPER, name: Role.DEVELOPER },
	{ id: Role.OTHER, name: Role.OTHER },
];

export const getEmployeeDropDownItems = (employees: Employee[]) => {
	const nullObject = { id: null, name: 'Unassigned' };
	const employeeDropDownItems = employees.map((employee) => ({
		id: employee.employee_id,
		name: employee.username,
	}));
	return [nullObject, ...employeeDropDownItems];
};

export const getServiceDropDownItems = (services: Service[]) => {
	const nullObject = { id: null, name: 'No Service Selected' };
	const serviceDropDownItems = services.map((service) => ({
		id: service.service_id,
		name: service.shorthand,
	}));
	return [nullObject, ...serviceDropDownItems];
};

export const getCustomerPhoneNumberDropDownItems = (customers: Customer[]) => {
	const nullObject = { id: null, name: 'No Customer Selected' };
	const customerDropDownItems = customers.map((customer) => ({
		id: customer.phone_number,
		name: customer.phone_number,
	}));
	return [nullObject, ...customerDropDownItems];
};

export const getCustomerNameDropDownItems = (customers: Customer[]) => {
	const nullObject = { id: null, name: 'No Customer Selected' };
	const customerDropDownItems = customers.map((customer) => ({
		id: customer.phone_number,
		name: customer.customer_name,
	}));
	return [nullObject, ...customerDropDownItems];
};

export const getVipPackageDropDownItems = (vipPackages: VipPackage[]) => {
	const nullObject = { id: null, name: 'No Vip Package Selected' };
	const vipPackageDropDownItems = vipPackages.map((vipPackage) => ({
		id: vipPackage.serial,
		name: `${vipPackage.serial} (${vipPackage.amount})`,
	}));
	return [nullObject, ...vipPackageDropDownItems];
};
