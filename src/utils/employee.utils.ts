import Employee from '../models/Employee.Model';
import Schedule from '../models/Schedule.Model';
import { sameDate } from './date.utils';

export const sortEmployees = (
	employees: Employee[],
	schedules: Schedule[],
	date: Date
) => {
	employees.sort((a, b) => {
		const aSchedule = schedules.find(
			(schedule) =>
				sameDate(schedule.date, date) &&
				schedule.employee.employee_id === a.employee_id
		);
		const bSchedule = schedules.find(
			(schedule) =>
				sameDate(schedule.date, date) &&
				schedule.employee.employee_id === b.employee_id
		);

		const aIsWorking = aSchedule?.is_working ? -1 : 1;
		const bIsWorking = bSchedule?.is_working ? -1 : 1;

		if (aIsWorking !== bIsWorking) {
			return aIsWorking;
		}

		const aStartTime = aSchedule?.start?.getTime();
		const bStartTime = bSchedule?.start?.getTime();

		if (aStartTime !== undefined && bStartTime !== undefined) {
			return aStartTime - bStartTime;
		} else if (aStartTime !== undefined) {
			return -1;
		} else if (bStartTime !== undefined) {
			return 1;
		}

		return a.username.localeCompare(b.username);
	});
};
