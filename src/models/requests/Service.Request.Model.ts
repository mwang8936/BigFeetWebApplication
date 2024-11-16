import { ServiceColor } from '../enums';

export interface UpdateServiceRequest {
	service_name?: string;
	shorthand?: string;
	color?: ServiceColor;
}

export interface AddServiceRequest {
	date: Date;
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

export interface AddServiceRecordRequest {
	date: Date;
	time: number;
	money: number;
	body?: number;
	feet?: number;
	acupuncture?: number;
	beds_required: number;
}

export interface DiscontinueServiceRequest {
	date: Date;
}
