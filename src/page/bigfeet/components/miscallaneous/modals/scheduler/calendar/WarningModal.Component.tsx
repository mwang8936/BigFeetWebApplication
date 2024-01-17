import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import Warning from './Warning.Component';

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
