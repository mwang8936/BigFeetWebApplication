import { FC, useState } from 'react';

import { useUserQuery } from '../../../../../hooks/profile.hooks';

import Employee from '../../../../../../models/Employee.Model';
import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import AddReservationModal from '../../../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';

interface CalendarGridProp {
	date: Date;
	employee: Employee;
	row: number;
	col: number;
}

const CalendarGrid: FC<CalendarGridProp> = ({ date, employee, row, col }) => {
	const [open, setOpen] = useState(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_RESERVATION
	);

	return (
		<div
			style={{ gridRowStart: row, gridColumnStart: col }}
			className="border-slate-500 border-b border-r cursor-pointer"
			onClick={() => {
				if (creatable) setOpen(true);
			}}>
			<AddReservationModal
				open={open}
				setOpen={setOpen}
				defaultDate={date}
				defaultEmployeeId={employee.employee_id}
			/>
		</div>
	);
};

export default CalendarGrid;
