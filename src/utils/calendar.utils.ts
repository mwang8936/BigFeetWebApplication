import { formatTimeFromNumber } from './string.utils';

import STORES from '../constants/store.constants';

/**
 * Generates a list of formatted time strings between a start and end time.
 *
 * @param start - The start time as a number in increments of 0.5 (e.g., 9 for 9:00 AM).
 * @param end - The end time as a number in increments of 0.5 (e.g., 17.5 for 5:30 PM).
 * @returns string[] - An array of formatted time strings (e.g., ["9:00 AM", "9:30 AM", "10:00 AM"]).
 *
 * This function generates a list of time slots between the specified start and end times.
 * If the start and end times are valid (included in `possibleTimes` and start is less than end),
 * they will override the default start and end times from the `STORES` object.
 * It iterates in 30-minute intervals, formats each time, and returns them as an array of strings.
 *
 * Example usage:
 * const times = getListOfTimes(9, 17); // ["9:00 AM", "9:30 AM", "10:00 AM", ..., "5:00 PM"]
 */
export function getListOfTimes(start: number, end: number): string[] {
	const possibleTimes: number[] = [];

	let defaultStart = STORES.start;
	let defaultEnd = STORES.end;

	// Override default times if valid custom times are provided
	if (start < 24 && end < 24 && start < end) {
		defaultStart = start;
		defaultEnd = end;
	}

	// Generate time slots in 30-minute intervals
	for (let i = defaultStart; i <= defaultEnd; i += 0.5) {
		possibleTimes.push(i);
	}

	const timeArr: string[] = [];

	// Format each time slot and add to the array
	for (const time of possibleTimes) {
		const formattedTime = formatTimeFromNumber(time);
		timeArr.push(formattedTime);
	}

	return timeArr;
}

/**
 * Converts a time string in the format 'HH:MM AM/PM' to a number representing the hour in 24-hour format.
 *
 * @param time - The time string to convert (e.g., '2:30 PM').
 * @returns number - The hour as a number in 24-hour format (e.g., 14 for '2:30 PM').
 *
 * This function splits the time string to extract the hour part and converts it to a number.
 * If the time string includes 'PM', it adds 12 to the hour to convert to 24-hour format.
 * If the hour is 12 AM, it keeps it as 0. If the hour is 12 PM, it remains 12.
 *
 * Example usage:
 * const hour = timeHourToNumber('2:30 PM'); // 14
 */
export function timeHourToNumber(time: string): number {
	// Extract the hour from the time string and convert it to a number
	let hour: number =
		parseInt(time.split(':')[0]) + (time.includes('PM') ? 12 : 0);

	// Adjust for 12 AM and 12 PM cases
	if (hour === 24) hour = 12;

	return hour;
}

/**
 * Converts a time string in the format 'HH:MM' to a number representing the minute.
 *
 * @param time - The time string to convert (e.g., '2:30 PM' or '14:45').
 * @returns number - The minute as a number (e.g., 30 for '2:30 PM').
 *
 * This function splits the time string to extract the minute part and converts it to a number.
 *
 * Example usage:
 * const minute = timeMinuteToNumber('2:30 PM'); // 30
 */
export function timeMinuteToNumber(time: string): number {
	// Extract the minute from the time string and convert it to a number
	const minute: number = parseInt(time.split(':')[1]);

	return minute;
}

/**
 * Determines if the given time matches the current time based on specific criteria.
 *
 * @param time - The time string to check in the format 'HH:mm AM/PM' (e.g., '6:30 PM').
 * @returns boolean - True if the given time matches the current time based on the criteria, false otherwise.
 *
 * This function checks if the provided time matches the current time. It considers the following:
 * - The hour from the provided time must match the current hour.
 * - The provided time must either have zero minutes or the current minutes must be at least 30.
 *
 * Example usage:
 * const isScrollable = scrollable('6:30 PM'); // Returns true or false based on the current time.
 */
export function scrollable(time: string): boolean {
	// Get the current date and time
	const currentDate = new Date();
	const currentHours = currentDate.getHours();
	const currentMinutes = currentDate.getMinutes();

	// Extract hours from the given time string
	const hours: number = timeHourToNumber(time);

	// Check if the minutes part of the given time is zero
	const minutesIsZero: boolean = timeMinuteToNumber(time) === 0;

	// Check if the given hours match the current hours
	const sameHours = hours === currentHours;

	// Check if the current minutes are at least 30 if the given time's minutes are zero
	const sameMinutes = currentMinutes >= 30 !== minutesIsZero;

	// Return true if both hours and minutes criteria are satisfied
	return sameHours && sameMinutes;
}

/**
 * Converts a Date object to a number representing the total milliseconds from hours and minutes.
 *
 * @param date - The Date object from which to extract the hours and minutes.
 * @returns number - The total milliseconds calculated from the hours and minutes.
 *
 * This function calculates the total milliseconds by converting the hours to milliseconds
 * and adding the milliseconds obtained from the minutes.
 *
 * Example usage:
 * const totalMilliseconds = getTimeFromHoursAndMinutes(new Date('2024-10-11T14:30:00')); // Returns total milliseconds from 14:30
 */
export function getTimeFromHoursAndMinutes(date: Date): number {
	const hourTime = date.getHours() * 60 * 60 * 1000;
	const minuteTime = date.getMinutes() * 60 * 1000;

	return hourTime + minuteTime;
}
