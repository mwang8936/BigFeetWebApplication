import { FC } from 'react';

import AddGiftCard from './AddGiftCard.Component';

import BaseModal from '../../BaseModal.Component';

import { AddGiftCardRequest } from '../../../../../../../models/requests/GIft-Card.Request';

interface AddGiftCardModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddGiftCard(request: AddGiftCardRequest): Promise<void>;
}

const AddGiftCardModal: FC<AddGiftCardModalProp> = ({
	open,
	setOpen,
	creatable,
	onAddGiftCard,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddGiftCard
					setOpen={setOpen}
					creatable={creatable}
					onAddGiftCard={onAddGiftCard}
				/>
			}
		/>
	);
};

export default AddGiftCardModal;
