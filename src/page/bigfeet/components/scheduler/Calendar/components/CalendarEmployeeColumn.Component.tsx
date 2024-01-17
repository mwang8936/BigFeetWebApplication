import { FC, useState } from 'react';
import Employee from '../../../../../../models/Employee.Model';
import ReservationTag from './Reservation.Component';
import CalendarGrid from './CalendarGrid.Component';
import {
	timeHourToNumber,
	timeMinuteToNumber,
} from '../../../../../../utils/calendar.utils';
import Schedule from '../../../../../../models/Schedule.Model';
import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../../../../../../models/requests/Reservation.Request.Model';
import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../../../../../../models/requests/Schedule.Request.Model';
import ScheduleGrid from './ScheduleGrid.Component';
import SignatureGrid from './SignatureGrid.Component';
import { useUserContext } from '../../../../BigFeet.Page';
import TotalGrid from './TotalGrid.Component';
import TipGrid from './TipGrid.Component';
import VipGrid from './VipGrid.Component';

interface CalendarEmployeeColumnProp {
	date: Date;
	employee: Employee;
	schedule?: Schedule;
	timeArr: string[];
	colNum: number;
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

const CalendarEmployeeColumn: FC<CalendarEmployeeColumnProp> = ({
	date,
	employee,
	schedule,
	timeArr,
	colNum,
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
	const { user } = useUserContext();

	const renderGrids = () => {
		const grids = [];
		for (let i = 2; i < timeArr.length + 2; i++) {
			const gridDate = new Date(date);
			gridDate.setHours(timeHourToNumber(timeArr[i - 2]));
			gridDate.setMinutes(timeMinuteToNumber(timeArr[i - 2]));
			const grid = (
				<CalendarGrid
					key={`row-${i} col-${colNum}`}
					date={gridDate}
					employee={employee}
					row={i}
					col={colNum}
					creatable={creatable}
					onAddReservation={onAddReservation}
				/>
			);

			grids.push(grid);
		}
		return grids;
	};

	const renderReservations = () => {
		return schedule?.reservations.map((reservation) => (
			<ReservationTag
				key={reservation.reservation_id}
				reservation={reservation}
				colNum={colNum}
				editable={editable}
				onEditReservation={onEditReservation}
				deletable={deletable}
				onDeleteReservation={onDeleteReservation}
			/>
		));
	};

	return (
		<>
			<ScheduleGrid
				colNum={colNum}
				employee={employee}
				date={date}
				schedule={schedule}
				creatable={creatable}
				onAddSchedule={onAddSchedule}
				editable={editable}
				onEditSchedule={onEditSchedule}
			/>
			{renderGrids()}
			{renderReservations()}
			<TotalGrid
				row={timeArr.length + 2}
				colNum={colNum}
				reservations={schedule?.reservations || []}
			/>
			<TipGrid
				row={timeArr.length + 3}
				colNum={colNum}
				reservations={schedule?.reservations || []}
			/>
			<VipGrid
				row={timeArr.length + 4}
				colNum={colNum}
				vipPackages={schedule?.vip_packages || []}
			/>
			<SignatureGrid
				row={timeArr.length + 5}
				colNum={colNum}
				date={date}
				signedOff={schedule?.signed || false}
				signable={user.employee_id === employee.employee_id}
				onScheduleSigned={onScheduleSigned}
			/>
		</>
	);
};

export default CalendarEmployeeColumn;
