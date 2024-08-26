import { FC } from 'react';

import ChangeProfilePassword from './ChangeProfilePassword.Component';

import BaseModal from '../BaseModal.Component';

interface ChangeProfilePasswordModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const ChangeProfilePasswordModal: FC<ChangeProfilePasswordModalProp> = ({
	open,
	setOpen,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<ChangeProfilePassword setOpen={setOpen} />}
		/>
	);
};

export default ChangeProfilePasswordModal;
