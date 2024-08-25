import { FC } from 'react';

import SignProfileSchedule from './SignProfileSchedule.Component';
import SignSchedule from './SignSchedule.Component';

import BaseModal from '../../BaseModal.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import Employee from '../../../../../../../models/Employee.Model';
import User from '../../../../../../../models/User.Model';

interface SignScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employee: Employee;
}

const SignScheduleModal: FC<SignScheduleModalProp> = ({
	open,
	setOpen,
	employee,
}) => {
	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				user.employee_id === employee.employee_id ? (
					<SignProfileSchedule setOpen={setOpen} />
				) : (
					<SignSchedule setOpen={setOpen} employee={employee} />
				)
			}
		/>
	);
};

export default SignScheduleModal;
