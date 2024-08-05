import { FC } from 'react';

import EditCustomer from './EditCustomer.Component';

import BaseModal from '../BaseModal.Component';

import Customer from '../../../../../../models/Customer.Model';

import { UpdateCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';

interface EditCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	customer: Customer;
	editable: boolean;
	onEditCustomer(
		customerId: number,
		request: UpdateCustomerRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteCustomer(customerId: number): Promise<void>;
}

const EditCustomerModal: FC<EditCustomerModalProp> = ({
	open,
	setOpen,
	customer,
	editable,
	onEditCustomer,
	deletable,
	onDeleteCustomer,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<EditCustomer
					setOpen={setOpen}
					customer={customer}
					editable={editable}
					onEditCustomer={onEditCustomer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			}
		/>
	);
};

export default EditCustomerModal;
