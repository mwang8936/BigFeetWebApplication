import {
	Gender,
	Language,
	PaymentMethod,
	Role,
	ServiceColor,
	TipMethod,
} from '../models/enums';
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
import VipPackage from '../models/Vip-Package.Model';
import Schedule from '../models/Schedule.Model';

export const colorDropDownItems = [
	{ id: null, name: 'No Color Selected' },
	{ id: ServiceColor.RED, name: ServiceColor.RED, avatar: RedIcon },
	{ id: ServiceColor.BLUE, name: ServiceColor.BLUE, avatar: BlueIcon },
	{
		id: ServiceColor.YELLOW,
		name: ServiceColor.YELLOW,
		avatar: YellowIcon,
	},
	{
		id: ServiceColor.GREEN,
		name: ServiceColor.GREEN,
		avatar: GreenIcon,
	},
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
	{
		id: ServiceColor.BLACK,
		name: ServiceColor.BLACK,
		avatar: BlackIcon,
	},
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

export const paymentMethodDropDownItems = [
	{ id: null, name: 'No Payment Method Selected' },
	{ id: PaymentMethod.CASH, name: PaymentMethod.CASH },
	{ id: PaymentMethod.MACHINE, name: PaymentMethod.MACHINE },
];

export const roleDropDownItems = [
	{ id: null, name: 'No Role Selected' },
	{ id: Role.STORE_EMPLOYEE, name: Role.STORE_EMPLOYEE },
	{ id: Role.RECEPTIONIST, name: Role.RECEPTIONIST },
	{ id: Role.MANAGER, name: Role.MANAGER },
	{ id: Role.DEVELOPER, name: Role.DEVELOPER },
	{ id: Role.OTHER, name: Role.OTHER },
];

export const tipMethodDropDownItems = [
	{ id: null, name: 'No Tip Method Selected' },
	{ id: TipMethod.CASH, name: TipMethod.CASH },
	{ id: TipMethod.HALF, name: TipMethod.HALF },
	{ id: TipMethod.MACHINE, name: TipMethod.MACHINE },
];

export const getEmployeeDropDownItems = (employees: Employee[]) => {
	const nullObject = { id: null, name: 'No Employee Selected' };
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

export const getVipPackageDropDownItems = (vipPackages: VipPackage[]) => {
	const nullObject = { id: null, name: 'No Vip Package Selected' };
	const vipPackageDropDownItems = vipPackages.map((vipPackage) => ({
		id: vipPackage.serial,
		name: `${vipPackage.serial} (${vipPackage.sold_amount})`,
	}));
	return [nullObject, ...vipPackageDropDownItems];
};

export const getPriorityDropDownItems = (
	employees: Employee[],
	schedules: Schedule[]
) => {
	const nullObject = { id: null, name: 'No Priority Selected' };

	const takenPriorities: number[] = schedules
		.map((schedule) => schedule.priority)
		.filter((priority) => priority !== null) as number[];

	const priorityDropDownItems: { id: null | number; name: string }[] = [
		nullObject,
	];

	for (let i = 1; i <= employees.length; i++) {
		if (!takenPriorities.includes(i)) {
			priorityDropDownItems.push({ id: i, name: i.toString() });
		}
	}

	return priorityDropDownItems;
};
