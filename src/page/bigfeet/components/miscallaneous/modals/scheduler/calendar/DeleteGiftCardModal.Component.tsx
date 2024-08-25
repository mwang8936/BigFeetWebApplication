import { FC } from 'react';

import DeleteGiftCard from './DeleteGiftCard.Component';

import BaseModal from '../../BaseModal.Component';

import GiftCard from '../../../../../../../models/Gift-Card.Model';

interface DeleteGiftCardModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	giftCard: GiftCard;
}

const DeleteGiftCardModal: FC<DeleteGiftCardModalProp> = ({
	open,
	setOpen,
	giftCard,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteGiftCard setOpen={setOpen} giftCard={giftCard} />}
		/>
	);
};

export default DeleteGiftCardModal;
