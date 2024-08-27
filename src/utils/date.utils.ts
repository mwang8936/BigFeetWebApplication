import HOLIDAYS from '../constants/holiday.constants';

/**
 * Compares two Date objects to determine if they represent the same calendar date.
 *
 * @param date1 - The first Date object to compare.
 * @param date2 - The second Date object to compare.
 * @returns boolean - True if both dates represent the same year, month, and day; false otherwise.
 *
 * This function checks if two Date objects represent the same calendar date by comparing
 * the year, month, and day parts of the dates.
 *
 * Example usage:
 * const date1 = new Date('2024-07-29T10:00:00');
 * const date2 = new Date('2024-07-29T15:00:00');
 * const isSameDate = sameDate(date1, date2); // Returns true
 */
export function sameDate(date1: Date, date2: Date): boolean {
	// Compare the year, month, and date parts of both Date objects
	return (
		date1.getFullYear() == date2.getFullYear() && // Check if years are the same
		date1.getMonth() == date2.getMonth() && // Check if months are the same
		date1.getDate() == date2.getDate() // Check if days are the same
	);
}

/**
 * Compares two Date objects to determine if they represent the same time.
 *
 * @param time1 - The first Date object to compare.
 * @param time2 - The second Date object to compare.
 * @returns boolean - True if both dates represent the same hours and minutes; false otherwise.
 *
 * This function checks if two Date objects represent the same time by comparing
 * the hours and minutes parts of the dates.
 *
 * Example usage:
 * const time1 = new Date('2024-07-29T10:00:00');
 * const time2 = new Date('2024-07-29T10:00:30');
 * const isSameTime = sameTime(time1, time2); // Returns true
 */
export function sameTime(time1: Date, time2: Date): boolean {
	// Compare the hours and minutes parts of both Date objects
	return (
		time1.getHours() == time2.getHours() && // Check if hours are the same
		time1.getMinutes() == time2.getMinutes() // Check if minutes are the same
	);
}

/**
 * Converts given hours and minutes into a Date object.
 *
 * @param hours - The hours to set in the Date object.
 * @param minutes - The minutes to set in the Date object.
 * @returns Date - A Date object set to the specified hours and minutes on an arbitrary date.
 *
 * This function creates a Date object set to January 1, 1970, with the given hours and minutes.
 * The year, month, and day are set to arbitrary values (1970-01-01) as the focus is on the time.
 *
 * Example usage:
 * const date = timeToDate(10, 30); // Returns a Date object set to 10:30 AM on January 1, 1970
 */
export function timeToDate(hours: number, minutes: number): Date {
	// Create a new Date object set to January 1, 1970, with the specified hours and minutes
	return new Date(1970, 1, 1, hours, minutes);
}

/**
 * Checks if a target date overlaps with a given date range (startDate to endDate).
 * Optionally, a minute range can be provided to create a target date range.
 *
 * @param targetDate - The date to check for overlap.
 * @param startDate - The start date of the range to check against.
 * @param endDate - The end date of the range to check against.
 * @param minuteRange - Optional. The number of minutes to extend the target date to create a range.
 * @returns boolean - True if there is an overlap, false otherwise.
 *
 * The function first trims the seconds and milliseconds from the targetDate, startDate, and endDate.
 * If a minuteRange is provided, it creates a target date range from targetDate to targetDate + minuteRange.
 * It then checks if any part of this target date range overlaps with the provided date range.
 * If no minuteRange is provided, it checks if targetDate falls within the startDate and endDate range.
 */
export function doesDateOverlap(
	targetDate: Date,
	startDate: Date,
	endDate: Date,
	minuteRange?: number
): boolean {
	// Trim seconds and milliseconds from targetDate, startDate, and endDate
	const targetDateTrimmed = new Date(targetDate);
	targetDateTrimmed.setSeconds(0);
	targetDateTrimmed.setMilliseconds(0);

	const startDateTrimmed = new Date(startDate);
	startDateTrimmed.setSeconds(0);
	startDateTrimmed.setMilliseconds(0);

	const endDateTrimmed = new Date(endDate);
	endDateTrimmed.setSeconds(0);
	endDateTrimmed.setMilliseconds(0);

	if (minuteRange) {
		// If minuteRange is provided, create a target date range
		const targetStartDate = targetDateTrimmed;
		const targetEndDate = new Date(
			targetDateTrimmed.getTime() + minuteRange * (1000 * 60)
		);

		// Check for overlap with the provided date range
		return (
			(targetStartDate >= startDateTrimmed &&
				targetStartDate < endDateTrimmed) || // starts in between startDate and endDate
			(targetEndDate <= endDateTrimmed && targetEndDate > startDateTrimmed) || // ends in between startDate and endDate
			(targetStartDate <= startDateTrimmed && targetEndDate >= endDateTrimmed) // starts before startDate and ends after endDate
		);
	} else {
		// If no minuteRange is provided, check if targetDate falls within the date range
		return (
			targetDateTrimmed >= startDateTrimmed &&
			targetDateTrimmed <= endDateTrimmed
		);
	}
}

/**
 * Checks if a given date is a holiday based on predefined holiday lists for each year.
 *
 * @param date - The date to check if it is a holiday.
 * @returns boolean - True if the date is a holiday, false otherwise.
 *
 * The function first retrieves the year from the given date.
 * It then checks if there is a holiday list available for that year in the HOLIDAYS object.
 * If a holiday list is available, it checks if the given date matches any holiday in that list
 * by comparing the day and month.
 */
export function isHoliday(date: Date): boolean {
	// Retrieve the year from the given date
	const year = date.getFullYear();

	// Check if there is a holiday list for the specified year
	if (HOLIDAYS[year]) {
		// Check if the given date matches any holiday in the list for that year
		return HOLIDAYS[year].some(
			(holiday) =>
				holiday.getDate() === date.getDate() && // Compare day
				holiday.getMonth() === date.getMonth() // Compare month
		);
	}

	// Return false if there are no holidays for the year or the date is not a holiday
	return false;
}
