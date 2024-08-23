import { FC } from 'react';

import AddCustomer from './AddCustomer.Component';

import BaseModal from '../BaseModal.Component';

interface AddCustomerModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const AddCustomerModal: FC<AddCustomerModalProp> = ({ open, setOpen }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<AddCustomer setOpen={setOpen} />}
		/>
	);
};

export default AddCustomerModal;
