import { FC } from 'react';

import Employee from '../../../../../models/Employee.Model';

import { getListOfTimes } from '../../../../../utils/calendar.utils';
import CalendarFixedColumn from './components/CalendarFixedColumn.Component';
import CalendarEmployeeColumn from './components/CalendarEmployeeColumn.Component';
import Schedule from '../../../../../models/Schedule.Model';
import { sameDate } from '../../../../../utils/date.utils';
import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../../../../../models/requests/Reservation.Request.Model';
import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../../../../../models/requests/Schedule.Request.Model';

interface CalendarProp {
	date: Date;
	start: number;
	end: number;
	employees: Employee[];
	schedules: Schedule[];
	creatable: boolean;
	onAddReservation(request: AddReservationRequest): Promise<void>;
	onAddSchedule(request: AddScheduleRequest): Promise<void>;
	editable: boolean;
	onEditReservation(
		reservationId: number,
		request: UpdateReservationRequest
	): Promise<void>;
	onEditSchedule(
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteReservation(reservationId: number): Promise<void>;
	onScheduleSigned(date: Date): Promise<void>;
}

const Calendar: FC<CalendarProp> = ({
	date,
	start,
	end,
	employees,
	schedules,
	creatable,
	onAddReservation,
	onAddSchedule,
	editable,
	onEditReservation,
	onEditSchedule,
	deletable,
	onDeleteReservation,
	onScheduleSigned,
}) => {
	const timeArr = getListOfTimes(start, end);
	return (
		<div
			className="grid h-fit relative"
			style={{
				gridTemplateRows: `auto repeat(${timeArr.length},100px) auto auto auto auto auto`,
				gridTemplateColumns: `auto repeat(${employees.length},200px)`,
			}}>
			<CalendarFixedColumn timeArr={timeArr} />
			{employees.map((employee, index) => (
				<CalendarEmployeeColumn
					key={employee.employee_id}
					date={date}
					employee={employee}
					schedule={schedules.find(
						(schedule) =>
							schedule.employee?.employee_id === employee.employee_id &&
							sameDate(date, schedule.date)
					)}
					timeArr={timeArr}
					colNum={index + 2}
					creatable={creatable}
					onAddReservation={onAddReservation}
					onAddSchedule={onAddSchedule}
					editable={editable}
					onEditReservation={onEditReservation}
					onEditSchedule={onEditSchedule}
					deletable={deletable}
					onDeleteReservation={onDeleteReservation}
					onScheduleSigned={onScheduleSigned}
				/>
			))}
		</div>
	);
};

export default Calendar;
