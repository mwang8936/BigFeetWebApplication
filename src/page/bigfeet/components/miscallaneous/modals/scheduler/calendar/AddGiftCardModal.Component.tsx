import { FC } from 'react';

import AddGiftCard from './AddGiftCard.Component';

import BaseModal from '../../BaseModal.Component';

interface AddGiftCardModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const AddGiftCardModal: FC<AddGiftCardModalProp> = ({ open, setOpen }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<AddGiftCard setOpen={setOpen} />}
		/>
	);
};

export default AddGiftCardModal;
