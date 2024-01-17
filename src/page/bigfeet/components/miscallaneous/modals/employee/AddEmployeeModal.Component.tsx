import { FC } from 'react';
import BaseModal from '../BaseModal.Component';
import { AddEmployeeRequest } from '../../../../../../models/requests/Employee.Request.Model';
import AddEmployee from './AddEmployee.Component';

interface AddEmployeeModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddEmployee(addEmployeeRequest: AddEmployeeRequest): Promise<void>;
}

const AddEmployeeModal: FC<AddEmployeeModalProp> = ({
	open,
	setOpen,
	creatable,
	onAddEmployee,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddEmployee
					setOpen={setOpen}
					creatable={creatable}
					onAddEmployee={onAddEmployee}
				/>
			}
		/>
	);
};

export default AddEmployeeModal;
