import { FC, useState } from 'react';
import Employee from '../../../../../../models/Employee.Model';
import AddReservationModal from '../../../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';
import { AddReservationRequest } from '../../../../../../models/requests/Reservation.Request.Model';

interface CalendarGridProp {
	date: Date;
	employee: Employee;
	row: number;
	col: number;
	creatable: boolean;
	onAddReservation(request: AddReservationRequest): Promise<void>;
}

const CalendarGrid: FC<CalendarGridProp> = ({
	date,
	employee,
	row,
	col,
	creatable,
	onAddReservation,
}) => {
	const [open, setOpen] = useState(false);

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
				creatable={creatable}
				onAddReservation={onAddReservation}
			/>
		</div>
	);
};

export default CalendarGrid;
