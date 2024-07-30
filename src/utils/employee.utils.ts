import Employee from '../models/Employee.Model';
import Schedule from '../models/Schedule.Model';
import { sameDate } from './date.utils';

/**
 * Sorts an array of employees based on their schedules for a specific date.
 * The sorting criteria are as follows:
 * 1. Employees with a defined schedule priority are sorted by priority.
 * 2. If priorities are not defined, employees are sorted based on whether they are working.
 * 3. If both priorities and working status are the same, employees are sorted by their start time.
 * 4. If none of the above criteria apply, employees are sorted alphabetically by username.
 *
 * @param employees - The array of employees to be sorted.
 * @param schedules - The array of schedules to determine employee priorities and work status.
 * @param date - The date for which the schedules are considered.
 */
export const sortEmployees = (
	employees: Employee[],
	schedules: Schedule[],
	date: Date
) => {
	employees.sort((a, b) => {
		// Find the schedule for employee `a` on the given date
		const aSchedule = schedules.find(
			(schedule) =>
				sameDate(schedule.date, date) &&
				schedule.employee.employee_id === a.employee_id
		);

		// Find the schedule for employee `b` on the given date
		const bSchedule = schedules.find(
			(schedule) =>
				sameDate(schedule.date, date) &&
				schedule.employee.employee_id === b.employee_id
		);

		// Sort by priority if both employees have defined schedule priorities
		if (aSchedule?.priority && bSchedule?.priority) {
			return aSchedule.priority - bSchedule.priority;
		}

		// If only `a` has a defined priority, `a` comes first
		if (aSchedule?.priority) return -1;

		// If only `b` has a defined priority, `b` comes first
		if (bSchedule?.priority) return 1;

		// If neither has priority, sort based on whether they are working
		const aIsWorking = aSchedule?.is_working ? -1 : 1;
		const bIsWorking = bSchedule?.is_working ? -1 : 1;

		if (aIsWorking !== bIsWorking) {
			return aIsWorking;
		}

		// If both are working or not working, sort by start time of their schedule
		const aStartTime = aSchedule?.start?.getTime();
		const bStartTime = bSchedule?.start?.getTime();

		if (aStartTime !== undefined && bStartTime !== undefined) {
			return aStartTime - bStartTime;
		} else if (aStartTime !== undefined) {
			return -1;
		} else if (bStartTime !== undefined) {
			return 1;
		}

		// If no start time is defined, sort alphabetically by username
		return a.username.localeCompare(b.username);
	});
};
