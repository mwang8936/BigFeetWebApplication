import { PaymentMethod } from './enums';

export default interface GiftCard {
	gift_card_id: string;
	date: Date;
	payment_method: PaymentMethod;
	payment_amount: number;
	created_at: Date;
	updated_at: Date;
}
