import { FC } from 'react';

import AddPayroll from './AddPayroll.Component';

import BaseModal from '../BaseModal.Component';

import Employee from '../../../../../../models/Employee.Model';
import { PayrollPart } from '../../../../../../models/enums';

interface AddPayrollModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	payrollPart: PayrollPart;
	employee: Employee;
}

const AddPayrollModal: FC<AddPayrollModalProp> = ({
	open,
	setOpen,
	payrollPart,
	employee,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddPayroll
					setOpen={setOpen}
					payrollPart={payrollPart}
					employee={employee}
				/>
			}
		/>
	);
};

export default AddPayrollModal;
