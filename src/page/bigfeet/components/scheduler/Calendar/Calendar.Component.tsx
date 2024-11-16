import { FC } from 'react';

import { useScheduleDateContext } from '../Scheduler.Component';

import CalendarEmployeeColumn from './components/CalendarEmployeeColumn.Component';
import CalendarFixedColumn from './components/CalendarFixedColumn.Component';

import { useCustomersQuery } from '../../../../hooks/customer.hooks';
import { useEmployeesQuery } from '../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../hooks/profile.hooks';
import { useSchedulesQuery } from '../../../../hooks/schedule.hooks';
import { useServiceRecordsQuery } from '../../../../hooks/service.hooks';

import STORES from '../../../../../constants/store.constants';

import Employee from '../../../../../models/Employee.Model';
import { Permissions, Role } from '../../../../../models/enums';
import Schedule from '../../../../../models/Schedule.Model';
import User from '../../../../../models/User.Model';

import { getListOfTimes } from '../../../../../utils/calendar.utils';
import { sameDate } from '../../../../../utils/date.utils';
import { sortEmployees } from '../../../../../utils/employee.utils';

const Calendar: FC = () => {
	const { date } = useScheduleDateContext();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const customerGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_CUSTOMER
	);
	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);
	const serviceGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);

	useCustomersQuery({
		gettable: customerGettable,
		staleTime: Infinity,
	});

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	useServiceRecordsQuery({
		date,
		gettable: serviceGettable,
		staleTime: Infinity,
	});

	sortEmployees(employees, schedules, date);

	const timeArr = getListOfTimes(STORES.start, STORES.end);

	return (
		<div
			className="grid h-fit relative"
			style={{
				gridTemplateRows: `auto repeat(${timeArr.length},100px) repeat(6,auto)`,
				gridTemplateColumns: `auto repeat(${employees.length},200px)`,
			}}>
			<CalendarFixedColumn timeArr={timeArr} />

			{employees.map((employee, index) => {
				const schedule = schedules.find(
					(schedule) =>
						schedule.employee?.employee_id === employee.employee_id &&
						sameDate(date, schedule.date)
				);

				return (
					<CalendarEmployeeColumn
						key={employee.employee_id}
						employee={employee}
						schedule={schedule}
						timeArr={timeArr}
						colNum={index + 2}
					/>
				);
			})}
		</div>
	);
};

export default Calendar;
