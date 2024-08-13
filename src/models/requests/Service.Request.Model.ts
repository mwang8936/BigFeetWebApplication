import { ServiceColor } from '../enums';

export interface UpdateServiceRequest {
	service_name?: string;
	shorthand?: string;
	time?: number;
	money?: number;
	body?: number;
	feet?: number;
	acupuncture?: number;
	beds_required?: number;
	color?: ServiceColor;
}

export interface AddServiceRequest {
	service_name: string;
	shorthand: string;
	time: number;
	money: number;
	body?: number;
	feet?: number;
	acupuncture?: number;
	beds_required: number;
	color: ServiceColor;
}
