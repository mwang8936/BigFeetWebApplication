import { FC } from 'react';

import Warning from './Warning.Component';

import BaseModal from '../../BaseModal.Component';

interface WarningModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	title: string;
	message: string;
}

const WarningModal: FC<WarningModalProp> = ({
	open,
	setOpen,
	title,
	message,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<Warning setOpen={setOpen} title={title} message={message} />
			}
		/>
	);
};

export default WarningModal;
