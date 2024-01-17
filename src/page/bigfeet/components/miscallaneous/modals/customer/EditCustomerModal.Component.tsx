import { FC } from 'react';
import BaseModal from '../BaseModal.Component';
import Customer from '../../../../../../models/Customer.Model';
import EditCustomer from './EditCustomer.Component';
import { UpdateCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';

interface EditCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	customer: Customer;
	editable: boolean;
	onEditCustomer(
		phoneNumber: string,
		request: UpdateCustomerRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteCustomer(phoneNumber: string): Promise<void>;
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
