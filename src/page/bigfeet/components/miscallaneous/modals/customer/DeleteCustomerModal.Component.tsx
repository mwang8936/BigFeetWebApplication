import { FC } from 'react';

import DeleteCustomer from './DeleteCustomer.Component';

import BaseModal from '../BaseModal.Component';

import { CustomerCurrent } from '../../../../../../models/Customer.Model';

interface DeleteCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	customer: CustomerCurrent;
}

const DeleteCustomerModal: FC<DeleteCustomerModalProp> = ({
	open,
	setOpen,
	customer,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteCustomer setOpen={setOpen} customer={customer} />}
		/>
	);
};

export default DeleteCustomerModal;
