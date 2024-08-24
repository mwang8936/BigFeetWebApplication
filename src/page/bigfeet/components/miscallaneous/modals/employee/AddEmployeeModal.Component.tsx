import { FC } from 'react';

import AddEmployee from './AddEmployee.Component';

import BaseModal from '../BaseModal.Component';

interface AddEmployeeModalProp {
	open: boolean;
	setOpen(open: boolean): void;
}

const AddEmployeeModal: FC<AddEmployeeModalProp> = ({ open, setOpen }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<AddEmployee setOpen={setOpen} />}
		/>
	);
};

export default AddEmployeeModal;
