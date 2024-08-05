import { FC } from 'react';

import DeleteCustomer from './DeleteCustomer.Component';

import BaseModal from '../BaseModal.Component';

import Customer from '../../../../../../models/Customer.Model';

interface DeleteCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	customer: Customer;
	deletable: boolean;
	onDeleteCustomer(customerId: number): Promise<void>;
}

const DeleteCustomerModal: FC<DeleteCustomerModalProp> = ({
	open,
	setOpen,
	customer,
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
					customer={customer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			}
		/>
	);
};

export default DeleteCustomerModal;
