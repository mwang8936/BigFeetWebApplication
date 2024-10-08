import { FC } from 'react';

import BaseModal from '../../BaseModal.Component';
import DeleteGiftCard from './DeleteGiftCard.Component';

interface DeleteGiftCardModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	giftCardId: string;
	deletable: boolean;
	onDeleteGiftCard(reservationId: string): Promise<void>;
}

const DeleteGiftCardModal: FC<DeleteGiftCardModalProp> = ({
	open,
	setOpen,
	giftCardId,
	deletable,
	onDeleteGiftCard,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteGiftCard
					setOpen={setOpen}
					giftCardId={giftCardId}
					deletable={deletable}
					onDeleteGiftCard={onDeleteGiftCard}
				/>
			}
		/>
	);
};

export default DeleteGiftCardModal;
