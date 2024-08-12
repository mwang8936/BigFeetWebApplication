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
	// Filter to find reservations where the employee ID matches the ID being checked.
	const reservationsForSameEmployee = reservations.filter(
		(res) => res.employee_id === employeeId
	);

	// Calculate the end date and time for the new reservation based on the service duration.
	const endDate = new Date(startDate.getTime() + service.time * 60000);

	// Further filter reservations to find those that overlap with the new reservation.
	const conflictingReservations = reservationsForSameEmployee.filter(
		(res) =>
			res.reservation_id !== reservationId && // Exclude the current reservation from conflict checks.
			doesDateOverlap(res.reserved_date, startDate, endDate, res.service.time) // Check for overlap in date and time.
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

export const getReservationOverlappingOrder = (
	reservation: Reservation,
	reservations: Reservation[]
) => {
	const employeeId = reservation.employee_id;

	// Filter to find reservations where the employee ID matches the ID being checked.
	const reservationsForSameEmployee = reservations.filter(
		(res) => res.employee_id === employeeId
	);

	const startDate = reservation.reserved_date;
	const service = reservation.service;

	// Calculate the end date and time for the current reservation based on the service duration.
	const endDate = new Date(startDate.getTime() + service.time * 60000);

	// Further filter reservations to find those that the current reservation falls within.
	const conflictingReservations = reservationsForSameEmployee.filter((res) => {
		const resStartDate = res.reserved_date;
		const resEndDate = new Date(
			resStartDate.getTime() + res.service.time * 60000
		);

		return (
			doesDateOverlap(startDate, resStartDate, resEndDate) && // Check if start date falls within the reservation
			doesDateOverlap(endDate, resStartDate, resEndDate) // Check if end date falls within the reservation
		);
	});

	// Sort overlapping reservations by when the reservation was created.
	const sortedConflictingReservations = conflictingReservations.sort(
		(a, b) => a.created_at.getTime() - b.created_at.getTime()
	);

	const reservationId = reservation.reservation_id;

	// Find the rank of our reservation
	const rank = sortedConflictingReservations.findIndex(
		(res) => res.reservation_id === reservationId
	);

	if (rank === -1) {
		return 0;
	} else {
		return rank;
	}
};
