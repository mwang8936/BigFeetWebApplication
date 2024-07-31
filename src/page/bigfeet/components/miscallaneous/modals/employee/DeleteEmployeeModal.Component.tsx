import { FC } from 'react';

import DeleteEmployee from './DeleteEmployee.Component';

import BaseModal from '../BaseModal.Component';

interface DeleteEmployeeModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employeeId: number;
	employeeName: string;
	deletable: boolean;
	onDeleteEmployee(employeeId: number): Promise<void>;
}

const DeleteEmployeeModal: FC<DeleteEmployeeModalProp> = ({
	open,
	setOpen,
	employeeId,
	employeeName,
	deletable,
	onDeleteEmployee,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteEmployee
					setOpen={setOpen}
					employeeId={employeeId}
					employeeName={employeeName}
					deletable={deletable}
					onDeleteEmployee={onDeleteEmployee}
				/>
			}
		/>
	);
};

export default DeleteEmployeeModal;
