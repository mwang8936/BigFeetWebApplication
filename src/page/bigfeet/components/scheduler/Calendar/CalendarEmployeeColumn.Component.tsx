import { useState } from 'react';
import Schedule from '../../../../../models/Schedule.Model';
import AddReservationDialog from '../AddReservationDialog.Component';
import ReservationTag from './Reservation.Component';
import { timeToDate } from '../../../../../utils/date.utils';

interface CalendarEmployeeColumnProp {
	username: string;
	schedule: Schedule;
	colNum: number;
	numRows: number;
}

export default function CalendarEmployeeColumn(
	prop: CalendarEmployeeColumnProp
) {
	const [open, setOpen] = useState(false);
	const [time, setTime] = useState<Date>();
	const renderGrids = () => {
		const grids = [];
		for (let i = 2; i < prop.numRows + 2; i++) {
			const grid = (
				<div
					key={`row-${i} col-${prop.colNum}`}
					style={{ gridRowStart: i, gridColumnStart: prop.colNum }}
					className='border-slate-500 border-b border-r cursor-pointer'
					onClick={() => {
						const hours = 10 + Math.floor((i - 2) / 2);
						const minutes = 30 * (i % 2);
						setTime(timeToDate(hours, minutes));
						setOpen(true);
					}}
				></div>
			);
			grids.push(grid);
		}
		return grids;
	};

	const renderReservations = () => {
		return (prop.schedule.reservations || []).map((reservation) => (
			<ReservationTag
				key={reservation.reservation_id}
				reservation={reservation}
				colNum={prop.colNum}
			/>
		));
	};

	return (
		<>
			<div
				style={{ gridColumnStart: prop.colNum }}
				className='row-start-[1] sticky top-0 z-0 bg-white border-slate-300 bg-clip-padding text-slate-900 border-b text-sm text-ellipsis font-medium py-2 text-center'
			>
				{prop.username}
			</div>
			{renderGrids()}
			{renderReservations()}
			<AddReservationDialog
				open={open}
				setOpen={setOpen}
				defaultDate={prop.schedule.date}
				defaultTime={time}
				defaultEmployeeId={prop.schedule.employee?.employee_id}
			/>
		</>
	);
}
