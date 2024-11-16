import { ServiceColor } from './enums';

export default interface BaseService {
	service_id: number;
	service_name: string;
	shorthand: string;
	color: ServiceColor;
}

export interface Service extends BaseService {
	records?: ServiceRecord[];
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}

export interface ServiceRecord extends BaseService {
	valid_from: Date;
	valid_to?: Date;
	time: number;
	money: number;
	body: number;
	feet: number;
	acupuncture: number;
	beds_required: number;
}
