import { FC } from 'react';

import AddCustomer from './AddCustomer.Component';

import BaseModal from '../BaseModal.Component';

import { AddCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';

interface AddCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddCustomer(addCustomerRequest: AddCustomerRequest): Promise<void>;
}

const AddCustomerModal: FC<AddCustomerModalProp> = ({
	open,
	setOpen,
	creatable,
	onAddCustomer,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddCustomer
					setOpen={setOpen}
					creatable={creatable}
					onAddCustomer={onAddCustomer}
				/>
			}
		/>
	);
};

export default AddCustomerModal;
