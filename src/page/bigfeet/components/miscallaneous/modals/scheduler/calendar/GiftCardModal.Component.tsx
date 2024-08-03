import { FC } from 'react';

import GiftCards from './GiftCard.Component';

import BaseModal from '../../BaseModal.Component';

import GiftCard from '../../../../../../../models/Gift-Card.Model';

import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '../../../../../../../models/requests/GIft-Card.Request';

interface GiftCardsModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	giftCards: GiftCard[];
	creatable: boolean;
	onAddGiftCard(request: AddGiftCardRequest): Promise<void>;
	editable: boolean;
	onEditGiftCard(
		gift_card_id: string,
		request: UpdateGiftCardRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteGiftCard(gift_card_id: string): Promise<void>;
}

const GiftCardsModal: FC<GiftCardsModalProp> = ({
	open,
	setOpen,
	giftCards,
	creatable,
	onAddGiftCard,
	editable,
	onEditGiftCard,
	deletable,
	onDeleteGiftCard,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<GiftCards
					setOpen={setOpen}
					giftCards={giftCards}
					creatable={creatable}
					onAddGiftCard={onAddGiftCard}
					editable={editable}
					onEditGiftCard={onEditGiftCard}
					deletable={deletable}
					onDeleteGiftCard={onDeleteGiftCard}
				/>
			}
		/>
	);
};

export default GiftCardsModal;
