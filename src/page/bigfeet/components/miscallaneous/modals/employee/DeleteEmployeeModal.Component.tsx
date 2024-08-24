import { FC } from 'react';

import DeleteEmployee from './DeleteEmployee.Component';

import BaseModal from '../BaseModal.Component';

import Employee from '../../../../../../models/Employee.Model';

interface DeleteEmployeeModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employee: Employee;
}

const DeleteEmployeeModal: FC<DeleteEmployeeModalProp> = ({
	open,
	setOpen,
	employee,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteEmployee setOpen={setOpen} employee={employee} />}
		/>
	);
};

export default DeleteEmployeeModal;
