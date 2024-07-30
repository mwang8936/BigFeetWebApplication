import { doesDateOverlap } from './date.utils';

import STORES from '../constants/store.constants';

import Reservation from '../models/Reservation.Model';
import Service from '../models/Service.Model';

/**
 * Checks if there is a conflict for an employee's reservation with other existing reservations.
 *
 * @param startDate - The start date and time of the new reservation.
 * @param employeeId - The ID of the employee to check for conflicts.
 * @param service - The service being reserved, including its duration and overlap rules.
 * @param reservations - The list of existing reservations to check against.
 * @param reservationId - Optional. The ID of the current reservation being checked, to exclude it from conflict checks.
 *
 * @returns A boolean indicating if there is a conflict with the employee's reservation based on the provided parameters.
 */
export const reservationEmployeeConflict = (
	startDate: Date,
	employeeId: number,
	service: Service,
	reservations: Reservation[],
	reservationId?: number
): boolean => {
	// If the service allows overlapping reservations, no conflict can be determined from the provided reservations.
	if (service.can_overlap) return false;

	// Calculate the end date and time for the new reservation based on the service duration.
	const endDate = new Date(startDate.getTime() + service.time * 60000);

	// Filter reservations to find those that overlap with the new reservation and do not allow overlapping.
	const reservationsAtSameTime = reservations.filter(
		(res) =>
			res.reservation_id !== reservationId && // Exclude the current reservation from conflict checks.
			!res.service.can_overlap && // Ensure the existing reservation does not allow overlap.
			doesDateOverlap(res.reserved_date, startDate, endDate, res.service.time) // Check for overlap in date and time.
	);

	// Further filter to find conflicts where the employee ID matches the ID being checked.
	const conflictingReservations = reservationsAtSameTime.filter(
		(res) => res.employee_id === employeeId
	);

	// Return true if there are any conflicting reservations for the specified employee.
	return conflictingReservations.length > 0;
};

interface Interval {
	start: number;
	end: number;
	beds_required: number;
}

enum eventType {
	start = 'start',
	end = 'end',
}

interface Event {
	time: number;
	beds_required: number;
	type: eventType;
}

/**
 * Checks if a new reservation conflicts with existing reservations based on bed requirements.
 *
 * @param startDate - The start date and time of the new reservation.
 * @param service - The service being reserved, including its bed requirements.
 * @param reservations - The list of existing reservations to check against.
 * @param reservationId - Optional. The ID of the current reservation being checked, to exclude it from conflict checks.
 *
 * @returns A boolean indicating if there is a bed conflict with the new reservation based on the provided parameters.
 */
export const reservationBedConflict = (
	startDate: Date,
	service: Service,
	reservations: Reservation[],
	reservationId?: number
): boolean => {
	// If the service does not require any beds, there cannot be a bed conflict.
	if (service.beds_required <= 0) return false;

	// Calculate the end date and time for the new reservation based on the service duration.
	const endDate = new Date(startDate.getTime() + service.time * 60000);

	// Define the interval for the new reservation.
	const newInterval: Interval = {
		start: startDate.getTime(),
		end: endDate.getTime(),
		beds_required: service.beds_required,
	};

	// Get all existing reservations that overlap with the new reservation and require beds.
	const intervals: Interval[] = reservations
		.filter(
			(res) =>
				res.reservation_id !== reservationId && // Exclude the current reservation from conflict checks.
				res.service.beds_required > 0 && // Consider only reservations that require beds.
				doesDateOverlap(res.reserved_date, startDate, endDate, res.service.time) // Check for overlap in date and time.
		)
		.map((res) => {
			const resService = res.service;

			// Calculate the start and end date and time for each existing reservation.
			const resStartDate = res.reserved_date;
			const resEndDate = new Date(
				resStartDate.getTime() + resService.time * 60000
			);

			return {
				start: resStartDate.getTime(),
				end: resEndDate.getTime(),
				beds_required: resService.beds_required,
			};
		});

	// Create an array of events for the new and existing reservations.
	const events: Event[] = [];

	// Add start and end events for existing reservations.
	intervals.forEach((interval) => {
		events.push({
			time: interval.start,
			beds_required: interval.beds_required,
			type: eventType.start,
		});
		events.push({
			time: interval.end,
			beds_required: interval.beds_required,
			type: eventType.end,
		});
	});

	// Add start and end events for the new reservation.
	events.push({
		time: newInterval.start,
		beds_required: newInterval.beds_required,
		type: eventType.start,
	});
	events.push({
		time: newInterval.end,
		beds_required: newInterval.beds_required,
		type: eventType.end,
	});

	// Sort events by time. If times are the same, prioritize 'end' events over 'start' events.
	events.sort((a, b) => {
		if (a.time === b.time) {
			return a.type === eventType.end ? -1 : 1; // Prioritize 'end' events to handle simultaneous events correctly.
		}
		return a.time - b.time;
	});

	let activeIntervals = 0;
	let maxOverlaps = 0;

	// Process events to find the maximum number of overlapping beds.
	for (const event of events) {
		if (event.type === eventType.start) {
			activeIntervals += event.beds_required;
			if (activeIntervals > maxOverlaps) {
				maxOverlaps = activeIntervals;

				// Return true if the maximum number of overlapping beds exceeds the available beds.
				if (maxOverlaps > STORES.beds) return true;
			}
		} else {
			activeIntervals -= event.beds_required;
		}
	}

	// Return false if no bed conflict was found.
	return false;
};
