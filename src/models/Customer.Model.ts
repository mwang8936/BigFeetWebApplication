export default interface Customer {
	phone_number: string;
	customer_name: string | null;
	notes: string | null;
	created_at: Date;
	updated_at: Date;
	deleted_at?: Date;
}
