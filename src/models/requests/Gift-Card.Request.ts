import { PaymentMethod } from '../enums';

export interface UpdateGiftCardRequest {
	date?: Date;
	payment_method?: PaymentMethod;
	payment_amount?: number;
}

export interface AddGiftCardRequest {
	gift_card_id: string;
	date: Date;
	payment_method: PaymentMethod;
	payment_amount: number;
}
