import { FC } from 'react';

import EditGiftCard from './EditGiftCard.Component';

import BaseModal from '../../BaseModal.Component';

import GiftCard from '../../../../../../../models/Gift-Card.Model';

import { UpdateGiftCardRequest } from '../../../../../../../models/requests/GIft-Card.Request';

interface EditGiftCardModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	giftCard: GiftCard;
	editable: boolean;
	onEditGiftCard(
		giftCardId: string,
		request: UpdateGiftCardRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteGiftCard(giftCardId: string): Promise<void>;
}

const EditGiftCardModal: FC<EditGiftCardModalProp> = ({
	open,
	setOpen,
	giftCard,
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
				<EditGiftCard
					setOpen={setOpen}
					giftCard={giftCard}
					editable={editable}
					onEditGiftCard={onEditGiftCard}
					deletable={deletable}
					onDeleteGiftCard={onDeleteGiftCard}
				/>
			}
		/>
	);
};

export default EditGiftCardModal;
