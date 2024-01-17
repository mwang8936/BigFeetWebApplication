import i18n from '../utils/i18n.utils';

import {
	Gender,
	Language,
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

export const colorDropDownItems = [
	{ id: null, name: i18n.t('No Color Selected') },
	{ id: ServiceColor.RED, name: i18n.t(ServiceColor.RED), avatar: RedIcon },
	{ id: ServiceColor.BLUE, name: i18n.t(ServiceColor.BLUE), avatar: BlueIcon },
	{
		id: ServiceColor.YELLOW,
		name: ServiceColor.YELLOW,
		avatar: YellowIcon,
	},
	{
		id: ServiceColor.GREEN,
		name: i18n.t(ServiceColor.GREEN),
		avatar: GreenIcon,
	},
	{
		id: ServiceColor.ORANGE,
		name: i18n.t(ServiceColor.ORANGE),
		avatar: OrangeIcon,
	},
	{
		id: ServiceColor.PURPLE,
		name: ServiceColor.PURPLE,
		avatar: PurpleIcon,
	},
	{ id: ServiceColor.GRAY, name: i18n.t(ServiceColor.GRAY), avatar: GrayIcon },
	{
		id: ServiceColor.BLACK,
		name: i18n.t(ServiceColor.BLACK),
		avatar: BlackIcon,
	},
];

export const genderDropDownItems = [
	{ id: null, name: i18n.t('No Gender Selected') },
	{ id: Gender.MALE, name: i18n.t(Gender.MALE), avatar: MaleIcon },
	{ id: Gender.FEMALE, name: i18n.t(Gender.FEMALE), avatar: FemaleIcon },
];

export const languageDropDownItems = [
	{ id: null, name: i18n.t('No Language Selected') },
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
	{ id: null, name: i18n.t('No Role Selected') },
	{ id: Role.STORE_EMPLOYEE, name: i18n.t(Role.STORE_EMPLOYEE) },
	{ id: Role.RECEPTIONIST, name: i18n.t(Role.RECEPTIONIST) },
	{ id: Role.MANAGER, name: i18n.t(Role.MANAGER) },
	{ id: Role.DEVELOPER, name: i18n.t(Role.DEVELOPER) },
	{ id: Role.OTHER, name: i18n.t(Role.OTHER) },
];

export const tipMethodDropDownItems = [
	{ id: null, name: i18n.t('No Tip Method Selected') },
	{ id: TipMethod.CASH, name: i18n.t(TipMethod.CASH) },
	{ id: TipMethod.HALF, name: i18n.t(TipMethod.HALF) },
	{ id: TipMethod.MACHINE, name: i18n.t(TipMethod.MACHINE) },
];

export const getEmployeeDropDownItems = (employees: Employee[]) => {
	const nullObject = { id: null, name: i18n.t('No Employee Selected') };
	const employeeDropDownItems = employees.map((employee) => ({
		id: employee.employee_id,
		name: employee.username,
	}));
	return [nullObject, ...employeeDropDownItems];
};

export const getServiceDropDownItems = (services: Service[]) => {
	const nullObject = { id: null, name: i18n.t('No Service Selected') };
	const serviceDropDownItems = services.map((service) => ({
		id: service.service_id,
		name: service.shorthand,
	}));
	return [nullObject, ...serviceDropDownItems];
};

export const getVipPackageDropDownItems = (vipPackages: VipPackage[]) => {
	const nullObject = { id: null, name: i18n.t('No Vip Package Selected') };
	const vipPackageDropDownItems = vipPackages.map((vipPackage) => ({
		id: vipPackage.serial,
		name: `${vipPackage.serial} (${vipPackage.amount})`,
	}));
	return [nullObject, ...vipPackageDropDownItems];
};
