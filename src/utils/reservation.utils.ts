import STORES from '../constants/store.constants';
import Reservation from '../models/Reservation.Model';
import Service from '../models/Service.Model';
import { doesDateOverlap } from './date.utils';

export const reservationEmployeeConflict = (
	startDate: Date,
	employeeId: number,
	service: Service,
	reservations: Reservation[],
	reservationId?: number
): boolean => {
	if (service.can_overlap) return false;

	const endDate = new Date(startDate.getTime() + service.time * 60000);

	const reservationsAtSameTime = reservations.filter(
		(res) =>
			res.reservation_id !== reservationId &&
			!res.service.can_overlap &&
			doesDateOverlap(res.reserved_date, startDate, endDate, res.service.time)
	);

	const conflictingReservations = reservationsAtSameTime.filter(
		(res) => res.employee_id === employeeId
	);

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

export const reservationBedConflict = (
	startDate: Date,
	service: Service,
	reservations: Reservation[],
	reservationId?: number
): boolean => {
	if (service.beds_required <= 0) return false;

	const endDate = new Date(startDate.getTime() + service.time * 60000);

	const newInterval: Interval = {
		start: startDate.getTime(),
		end: endDate.getTime(),
		beds_required: service.beds_required,
	};

	const intervals: Interval[] = reservations
		.filter(
			(res) =>
				res.reservation_id !== reservationId &&
				res.service.beds_required > 0 &&
				doesDateOverlap(res.reserved_date, startDate, endDate, res.service.time)
		)
		.map((res) => {
			const resService = res.service;

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

	const events: Event[] = [];

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

	events.sort((a, b) => {
		if (a.time === b.time) {
			return a.type === eventType.end ? -1 : 1; // Prioritize 'end' over 'start'
		}
		return a.time - b.time;
	});

	let activeIntervals = 0;
	let maxOverlaps = 0;

	for (const event of events) {
		if (event.type === eventType.start) {
			activeIntervals += event.beds_required;
			if (activeIntervals > maxOverlaps) {
				maxOverlaps = activeIntervals;

				if (maxOverlaps > STORES.beds) return true;
			}
		} else {
			activeIntervals -= event.beds_required;
		}
	}

	return false;
};
