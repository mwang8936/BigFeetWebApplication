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
	beds_required: number;
	color: ServiceColor;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}
