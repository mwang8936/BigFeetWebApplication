import { ServiceColor } from './enums';

export default interface Service {
	service_id: number;
	service_name: string;
	shorthand: string;
	time: number;
	money: number;
	body: number;
	feet: number;
	acupuncture: number;
	bed_required: boolean;
	color: ServiceColor;
}
