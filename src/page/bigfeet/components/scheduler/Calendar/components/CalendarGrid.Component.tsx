import { FC, useState } from 'react';

import { useUserQuery } from '../../../../../hooks/profile.hooks';

import Employee from '../../../../../../models/Employee.Model';
import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { isPastDate } from '../../../../../../utils/date.utils';

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

	// Empty slots on a day that is already over in PST cannot be filled in
	// without permission to edit past reservations.
	const pastEditable = user.permissions.includes(
		Permissions.PERMISSION_EDIT_PAST_RESERVATION
	);

	const creatable =
		user.permissions.includes(Permissions.PERMISSION_ADD_RESERVATION) &&
		(!isPastDate(date) || pastEditable);

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
			className={`border-slate-500 border-b border-r ${
				creatable ? 'cursor-pointer' : ''
			}`}
			onClick={() => {
				if (creatable) setOpen(true);
			}}>
			{blocked && (
				<div style={{ height, marginTop: top }} className="bg-yellow-200" />
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
