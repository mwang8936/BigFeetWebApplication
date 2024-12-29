import { FC } from 'react';

import CalendarGrid from './CalendarGrid.Component';
import CashOutGrid from './CashOutGrid.Component';
import PayoutGrid from './PayoutGrid.Component';
import ReservationTag from './Reservation.Component';
import ScheduleGrid from './ScheduleGrid.Component';
import SignatureGrid from './SignatureGrid.Component';
import TipGrid from './TipGrid.Component';
import TotalGrid from './TotalGrid.Component';
import VipGrid from './VipGrid.Component';

import { useScheduleDateContext } from '../../Scheduler.Component';

import Employee from '../../../../../../models/Employee.Model';
import Schedule from '../../../../../../models/Schedule.Model';

import {
	getTimeFromHoursAndMinutes,
	timeHourToNumber,
	timeMinuteToNumber,
} from '../../../../../../utils/calendar.utils';
import { doesDateOverlap } from '../../../../../../utils/date.utils';

interface CalendarEmployeeColumnProp {
	employee: Employee;
	schedule?: Schedule;
	timeArr: string[];
	colNum: number;
}

const CalendarEmployeeColumn: FC<CalendarEmployeeColumnProp> = ({
	employee,
	schedule,
	timeArr,
	colNum,
}) => {
	const { date } = useScheduleDateContext();

	const renderGrids = () => {
		const grids = [];
		for (let i = 2; i < timeArr.length + 2; i++) {
			const gridDate = new Date(date);
			gridDate.setHours(timeHourToNumber(timeArr[i - 2]));
			gridDate.setMinutes(timeMinuteToNumber(timeArr[i - 2]));

			const start = schedule?.start
				? getTimeFromHoursAndMinutes(schedule.start)
				: undefined;
			const end = schedule?.end
				? getTimeFromHoursAndMinutes(schedule.end)
				: undefined;

			const getBlocked = (): { top: number; bottom: number } | undefined => {
				const thirtyMinutes = 30 * 60 * 1000;

				if (!start && !end) {
					return undefined;
				}

				const gridStart = getTimeFromHoursAndMinutes(gridDate);

				if (start && !end) {
					let startPercent = ((start - gridStart) / thirtyMinutes) * 100;

					if (startPercent > 100) {
						return { top: 0, bottom: 100 };
					}

					if (startPercent < 0) {
						return { top: 0, bottom: 0 };
					}

					return { top: 0, bottom: startPercent };
				}

				if (!start && end) {
					const endPercent = ((end - gridStart) / thirtyMinutes) * 100;

					if (endPercent < 0) {
						return { top: 0, bottom: 100 };
					}

					if (endPercent > 100) {
						return { top: 0, bottom: 0 };
					}
					return { top: endPercent, bottom: 100 };
				}

				let startPercent = ((start! - gridStart) / thirtyMinutes) * 100;
				let endPercent = ((end! - gridStart) / thirtyMinutes) * 100;

				if (startPercent > 100) {
					return { top: 0, bottom: 100 };
				}

				if (endPercent < 0) {
					return { top: 0, bottom: 100 };
				}

				if (startPercent > 0) {
					return { top: 0, bottom: startPercent };
				}

				if (endPercent < 100) {
					return { top: endPercent, bottom: 100 };
				}
			};

			const blocked = getBlocked();

			if (schedule?.start) {
				if (
					schedule.start.getHours() === gridDate.getHours() &&
					schedule.start.getMinutes() > gridDate.getMinutes() &&
					schedule.start.getMinutes() < gridDate.getMinutes() + 30
				)
					gridDate.setMinutes(schedule.start.getMinutes());
			}

			const overlappingReservations = schedule?.reservations
				?.filter((reservation) => {
					const startDate = reservation.reserved_date;

					const time = reservation.time ?? reservation.service.time;
					const endDate = new Date(startDate.getTime() + time * (1000 * 60));

					return doesDateOverlap(gridDate, startDate, endDate, 30);
				})
				?.sort((a, b) => b.reserved_date.getTime() - a.reserved_date.getTime());

			if (overlappingReservations?.length) {
				const overlappingReservation = overlappingReservations[0];

				const time =
					overlappingReservation.time ?? overlappingReservation.service.time;
				const startDate = new Date(
					overlappingReservation.reserved_date.getTime() + time * (1000 * 60)
				);

				gridDate.setMinutes(
					Math.max(gridDate.getMinutes(), startDate.getMinutes())
				);
			}

			const grid = (
				<CalendarGrid
					key={`row-${i} col-${colNum}`}
					date={gridDate}
					employee={employee}
					blocked={blocked}
					row={i}
					col={colNum}
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
			/>
		));
	};

	return (
		<>
			<ScheduleGrid colNum={colNum} employee={employee} schedule={schedule} />

			{renderGrids()}

			{renderReservations()}

			<TotalGrid
				row={timeArr.length + 2}
				colNum={colNum}
				reservations={schedule?.reservations || []}
			/>

			<CashOutGrid
				row={timeArr.length + 3}
				colNum={colNum}
				reservations={schedule?.reservations || []}
			/>

			<TipGrid
				row={timeArr.length + 4}
				colNum={colNum}
				reservations={schedule?.reservations || []}
			/>

			<VipGrid
				row={timeArr.length + 5}
				colNum={colNum}
				defaultEmployeeId={employee.employee_id}
				vipPackages={schedule?.vip_packages || []}
			/>

			<PayoutGrid
				row={timeArr.length + 6}
				colNum={colNum}
				award={schedule?.award ?? 0}
				reservations={schedule?.reservations || []}
				vipPackages={schedule?.vip_packages || []}
			/>

			<SignatureGrid
				row={timeArr.length + 7}
				colNum={colNum}
				employee={employee}
				signedOff={schedule?.signed || false}
			/>
		</>
	);
};

export default CalendarEmployeeColumn;
