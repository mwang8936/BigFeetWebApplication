import { FC } from 'react';

import EditGiftCard from './EditGiftCard.Component';

import BaseModal from '../../BaseModal.Component';

import GiftCard from '../../../../../../../models/Gift-Card.Model';

interface EditGiftCardModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	giftCard: GiftCard;
}

const EditGiftCardModal: FC<EditGiftCardModalProp> = ({
	open,
	setOpen,
	giftCard,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<EditGiftCard setOpen={setOpen} giftCard={giftCard} />}
		/>
	);
};

export default EditGiftCardModal;
