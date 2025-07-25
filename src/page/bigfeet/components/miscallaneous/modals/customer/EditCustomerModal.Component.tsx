import { FC } from 'react';

import EditCustomer from './EditCustomer.Component';

import BaseModal from '../BaseModal.Component';

import Customer from '../../../../../../models/Customer.Model';

interface EditCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	customer: Customer;
}

const EditCustomerModal: FC<EditCustomerModalProp> = ({
	open,
	setOpen,
	customer,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<EditCustomer setOpen={setOpen} customer={customer} />}
		/>
	);
};

export default EditCustomerModal;
