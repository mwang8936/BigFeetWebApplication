import { FC } from 'react';

import DeleteCustomer from './DeleteCustomer.Component';

import BaseModal from '../BaseModal.Component';

interface DeleteCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	phoneNumber: string;
	deletable: boolean;
	onDeleteCustomer(phoneNumber: string): Promise<void>;
}

const DeleteCustomerModal: FC<DeleteCustomerModalProp> = ({
	open,
	setOpen,
	phoneNumber,
	deletable,
	onDeleteCustomer,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteCustomer
					setOpen={setOpen}
					phoneNumber={phoneNumber}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			}
		/>
	);
};

export default DeleteCustomerModal;
