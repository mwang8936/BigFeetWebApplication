import { FC } from 'react';

import DeleteProfile from './DeleteProfile.Component';

import BaseModal from '../BaseModal.Component';

interface DeleteProfileModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	userId: number;
	username: string;
	deletable: boolean;
	onDeleteUser(userId: number): Promise<void>;
}

const DeleteProfileModal: FC<DeleteProfileModalProp> = ({
	open,
	setOpen,
	userId,
	username,
	deletable,
	onDeleteUser,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteProfile
					setOpen={setOpen}
					userId={userId}
					username={username}
					deletable={deletable}
					onDeleteUser={onDeleteUser}
				/>
			}
		/>
	);
};

export default DeleteProfileModal;
