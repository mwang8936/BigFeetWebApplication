import { FC } from 'react';

import AddService from './AddService.Component';

import BaseModal from '../BaseModal.Component';

interface AddServiceModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const AddServiceModal: FC<AddServiceModalProp> = ({ open, setOpen }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<AddService setOpen={setOpen} />}
		/>
	);
};

export default AddServiceModal;
