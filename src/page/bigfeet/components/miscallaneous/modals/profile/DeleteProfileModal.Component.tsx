import { FC } from 'react';

import DeleteProfile from './DeleteProfile.Component';

import BaseModal from '../BaseModal.Component';

interface DeleteProfileModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const DeleteProfileModal: FC<DeleteProfileModalProp> = ({ open, setOpen }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteProfile setOpen={setOpen} />}
		/>
	);
};

export default DeleteProfileModal;
