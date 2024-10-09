import { FC, useState } from 'react';

import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component';

import AddPayrollModal from '../../miscallaneous/modals/payroll/AddPayrollModal.Component';

import { useUserQuery } from '../../../../hooks/profile.hooks';

import ERRORS from '../../../../../constants/error.constants';

import Employee from '../../../../../models/Employee.Model';
import { PayrollPart, Permissions } from '../../../../../models/enums';
import User from '../../../../../models/User.Model';

interface GeneratePayrollProp {
	employee: Employee;
	part: PayrollPart;
}

const GeneratePayroll: FC<GeneratePayrollProp> = ({ employee, part }) => {
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_PAYROLL
	);

	let btnText = 'Add Payroll: First Half';
	if (part === PayrollPart.PART_2) {
		btnText = 'Add Payroll: Second Half';
	}

	return (
		<div className="h-full m-auto text-xl font-bold flex flex-col items-center justify-center">
			<PermissionsButton
				btnTitle={btnText}
				btnType={ButtonType.ADD}
				top={false}
				disabled={!creatable}
				missingPermissionMessage={ERRORS.employee.permissions.add}
				onClick={() => setOpenAddModal(true)}
			/>

			<AddPayrollModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				payrollPart={part}
				employee={employee}
			/>
		</div>
	);
};

export default GeneratePayroll;
