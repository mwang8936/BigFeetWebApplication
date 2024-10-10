import { FC, useState } from 'react';

import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component';

import AddAcupunctureReportModal from '../../miscallaneous/modals/payroll/AddAcupunctureReportModal.Component';

import { useUserQuery } from '../../../../hooks/profile.hooks';

import ERRORS from '../../../../../constants/error.constants';

import Employee from '../../../../../models/Employee.Model';
import { Permissions } from '../../../../../models/enums';
import User from '../../../../../models/User.Model';

interface GenerateAcupunctureReportProp {
	employee: Employee;
}

const GenerateAcupunctureReport: FC<GenerateAcupunctureReportProp> = ({
	employee,
}) => {
	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_PAYROLL
	);

	return (
		<div className="h-full m-auto text-xl font-bold flex flex-col items-center justify-center py-12">
			<PermissionsButton
				btnTitle={'Add Payroll: Acupuncture Report'}
				btnType={ButtonType.ADD}
				disabled={!creatable}
				missingPermissionMessage={ERRORS.employee.permissions.add}
				onClick={() => setOpenAddModal(true)}
			/>

			<AddAcupunctureReportModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				employee={employee}
			/>
		</div>
	);
};

export default GenerateAcupunctureReport;
