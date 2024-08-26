import { FC } from 'react';

import ChangeEmployeePassword from './ChangeEmployeePassword.Component';

import BaseModal from '../BaseModal.Component';

import Employee from '../../../../../../models/Employee.Model';

interface ChangeEmployeePasswordModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employee: Employee;
}

const ChangeEmployeePasswordModal: FC<ChangeEmployeePasswordModalProp> = ({
	open,
	setOpen,
	employee,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<ChangeEmployeePassword setOpen={setOpen} employee={employee} />
			}
		/>
	);
};

export default ChangeEmployeePasswordModal;
