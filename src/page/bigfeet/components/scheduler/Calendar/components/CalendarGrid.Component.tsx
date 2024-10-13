import { FC, useState } from 'react';

import { useUserQuery } from '../../../../../hooks/profile.hooks';

import Employee from '../../../../../../models/Employee.Model';
import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import AddReservationModal from '../../../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';

interface CalendarGridProp {
	date: Date;
	employee: Employee;
	blocked?: { top: number; bottom: number };
	row: number;
	col: number;
}

const CalendarGrid: FC<CalendarGridProp> = ({
	date,
	employee,
	blocked,
	row,
	col,
}) => {
	const [open, setOpen] = useState(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_RESERVATION
	);

	// Calculate percentage stops for the gradient
	const topPercent = blocked?.top || 0;
	const bottomPercent = blocked?.bottom || 0;

	const height = `${bottomPercent - topPercent}%`;
	const top = `${topPercent / 2}%`;

	return (
		<div
			style={{
				gridRowStart: row,
				gridColumnStart: col,
			}}
			className="border-slate-500 border-b border-r cursor-pointer"
			onClick={() => {
				if (creatable) setOpen(true);
			}}>
			{blocked && (
				<div style={{ height, marginTop: top }} className="bg-red-200" />
			)}

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
