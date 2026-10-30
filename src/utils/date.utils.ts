import { DateTime } from 'luxon';

import HOLIDAYS from '../constants/holiday.constants';

/**
 * BC stopped changing its clocks in 2026 and now stays on UTC-7 all year, while
 * America/Los_Angeles keeps falling back to UTC-8. Browsers with older tz data
 * still have America/Vancouver falling back at 2AM on 2026-11-01, so from that
 * moment on a fixed UTC-7 zone is used instead of trusting the tz database.
 * Before it, America/Vancouver is correct with any tz data.
 */
const BC_PERMANENT_TIME_START = Date.UTC(2026, 10, 1, 9); // 2026-11-01 2AM UTC-7

// The Etc/GMT zones invert the sign, so this is UTC-7.
const BC_PERMANENT_TIME_ZONE = 'Etc/GMT+7';

const BC_HISTORICAL_TIME_ZONE = 'America/Vancouver';

/**
 * Returns the time zone to use for a given instant in BC.
 *
 * @param date - The instant to get the time zone for. Defaults to now.
 * @returns string - An IANA time zone usable with Intl and luxon.
 */
export function getBCTimeZone(date: Date = new Date()): string {
	return date.getTime() >= BC_PERMANENT_TIME_START
		? BC_PERMANENT_TIME_ZONE
		: BC_HISTORICAL_TIME_ZONE;
}

/**
 * Returns the time zone to use for a BC calendar day, for when the day is known
 * but the instant is not yet (e.g. finding the start of that day).
 *
 * @param year - The year of the day.
 * @param month - The month of the day (1 for January, 12 for December).
 * @param day - The day of the month.
 * @returns string - An IANA time zone usable with Intl and luxon.
 */
export function getBCTimeZoneForDay(
	year: number,
	month: number,
	day: number
): string {
	return Date.UTC(year, month - 1, day) >= Date.UTC(2026, 10, 1)
		? BC_PERMANENT_TIME_ZONE
		: BC_HISTORICAL_TIME_ZONE;
}

/**
 * The calendar date and wall clock time of an instant, as read in BC.
 */
export interface BCDateParts {
	year: number;
	month: number;
	day: number;
	hour: number;
	minute: number;
	second: number;
}

// Creating an Intl.DateTimeFormat is slow, so one is kept per time zone.
const bcFormatters = new Map<string, Intl.DateTimeFormat>();

/**
 * Reads the calendar date and wall clock time of an instant in BC.
 *
 * @param date - The instant to read. Defaults to now.
 * @returns BCDateParts - The year, month (1-12), day, hour (0-23), minute and
 * second shown on a BC clock at that instant.
 *
 * The store always operates on BC time, so this is used instead of getHours(),
 * getDate() and the like, which read the browser's clock and so depend on the
 * time zone the computer is set to.
 *
 * Example usage:
 * const { hour } = getBCParts(new Date('2026-10-29T17:00:00Z')); // Returns 10
 */
export function getBCParts(date: Date = new Date()): BCDateParts {
	const timeZone = getBCTimeZone(date);

	let formatter = bcFormatters.get(timeZone);
	if (!formatter) {
		formatter = new Intl.DateTimeFormat('en-US', {
			timeZone,
			hourCycle: 'h23',
			year: 'numeric',
			month: 'numeric',
			day: 'numeric',
			hour: 'numeric',
			minute: 'numeric',
			second: 'numeric',
		});
		bcFormatters.set(timeZone, formatter);
	}

	const parts: BCDateParts = {
		year: 0,
		month: 0,
		day: 0,
		hour: 0,
		minute: 0,
		second: 0,
	};

	for (const part of formatter.formatToParts(date)) {
		if (part.type in parts) {
			parts[part.type as keyof BCDateParts] = Number(part.value);
		}
	}

	// Some browsers still format midnight as 24 with h23.
	parts.hour %= 24;

	return parts;
}

/**
 * Creates the instant a BC clock shows the given calendar date and time.
 *
 * @param parts - The year, month (1-12) and day, plus an optional hour,
 * minute and second (each defaulting to 0).
 * @returns Date - The instant of that BC wall clock time.
 *
 * Example usage:
 * const date = fromBCParts({ year: 2026, month: 10, day: 29, hour: 10 }); // 2026-10-29T17:00:00Z
 */
export function fromBCParts({
	year,
	month,
	day,
	hour = 0,
	minute = 0,
	second = 0,
}: {
	year: number;
	month: number;
	day: number;
	hour?: number;
	minute?: number;
	second?: number;
}): Date {
	return DateTime.fromObject(
		{ year, month, day, hour, minute, second },
		{ zone: getBCTimeZoneForDay(year, month, day) }
	).toJSDate();
}

/**
 * Returns the instant at the given BC wall clock time on the BC day of a date.
 *
 * @param date - Any instant on the BC day to use.
 * @param hours - The hours on a BC clock (0-23).
 * @param minutes - The minutes on a BC clock.
 * @returns Date - The new instant. The given date is not changed.
 *
 * Example usage:
 * const opening = setBCTime(new Date(), 8, 0); // 8:00 AM BC today
 */
export function setBCTime(date: Date, hours: number, minutes: number): Date {
	const { year, month, day } = getBCParts(date);

	return fromBCParts({ year, month, day, hour: hours, minute: minutes });
}

/**
 * Converts an instant into the Date a date or time picker should be given.
 *
 * @param date - The instant to show.
 * @returns Date - A Date whose local fields (getHours() etc.) hold the BC wall
 * clock time of the instant.
 *
 * The MUI pickers display and edit the browser's local fields, so they are
 * handed the BC wall clock as local fields, and whatever is picked is turned
 * back into a real instant with fromPickerDate.
 */
export function toPickerDate(date: Date): Date {
	const { year, month, day, hour, minute, second } = getBCParts(date);

	return new Date(year, month - 1, day, hour, minute, second);
}

/**
 * Converts a Date coming out of a date or time picker into a real instant.
 *
 * @param date - The picked Date, whose local fields hold a BC wall clock time.
 * @returns Date - The instant of that BC wall clock time.
 */
export function fromPickerDate(date: Date): Date {
	return fromBCParts({
		year: date.getFullYear(),
		month: date.getMonth() + 1,
		day: date.getDate(),
		hour: date.getHours(),
		minute: date.getMinutes(),
		second: date.getSeconds(),
	});
}

/**
 * Compares two Date objects to determine if they fall on the same BC calendar date.
 *
 * @param date1 - The first Date object to compare.
 * @param date2 - The second Date object to compare.
 * @returns boolean - True if both dates fall on the same year, month, and day in BC; false otherwise.
 *
 * Example usage:
 * const date1 = new Date('2024-07-29T10:00:00-07:00');
 * const date2 = new Date('2024-07-29T15:00:00-07:00');
 * const isSameDate = sameDate(date1, date2); // Returns true
 */
export function sameDate(date1: Date, date2: Date): boolean {
	const parts1 = getBCParts(date1);
	const parts2 = getBCParts(date2);

	return (
		parts1.year === parts2.year &&
		parts1.month === parts2.month &&
		parts1.day === parts2.day
	);
}

/**
 * Converts a string from an API response into a Date when it holds one.
 *
 * @param value - The string to convert.
 * @returns Date | string - The Date it represents, or the original string if it
 * is not a date or time.
 *
 * - 'YYYY-MM-DD' (or with a single digit month or day) becomes midnight of
 *   that day in BC.
 * - ISO date times become the instant they describe.
 * - 'HH:mm:ss' times become that BC wall clock time, see timeToDate.
 */
export function parseDateString(value: string): Date | string {
	const dateOnly = /^(\d{4})-(\d{1,2})-(\d{1,2})$/.exec(value);
	if (dateOnly) {
		const [year, month, day] = dateOnly.slice(1).map(Number);

		return fromBCParts({ year, month, day });
	}

	if (
		/(\d{4}-(0?[1-9]|1[012])-(0?[1-9]|[12][0-9]|3[01]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.exec(
			value
		)
	) {
		const parsed = DateTime.fromISO(value);

		return parsed.isValid ? parsed.toJSDate() : new Date(value);
	}

	const time = /^(2[0-3]|[01]?[0-9]):([0-5][0-9]):([0-5][0-9])$/.exec(value);
	if (time) {
		return timeToDate(Number(time[1]), Number(time[2]));
	}

	return value;
}

/**
 * Converts a Date object into its PST calendar date, formatted as YYYY-MM-DD.
 *
 * @param date - The Date object to convert.
 * @returns string - The PST calendar date of the given Date (e.g. "2024-07-29").
 *
 * The store always operates on PST days, so dates are compared in PST rather
 * than in whatever timezone the browser happens to be set to.
 */
export function getPSTDateString(date: Date): string {
	// en-CA formats dates as YYYY-MM-DD, which sorts correctly as a string.
	return date.toLocaleDateString('en-CA', { timeZone: getBCTimeZone(date) });
}

/**
 * Checks if a date falls on a PST day that has already ended.
 *
 * @param date - The Date object to check.
 * @returns boolean - True if the date is before the PST day currently in
 * progress; false otherwise.
 *
 * A day is over once it hits 12AM PST, so a reservation is only considered to
 * be in the past once its whole day has passed in PST.
 *
 * Example usage:
 * const isPast = isPastDate(new Date('2024-07-29T10:00:00')); // Returns true
 */
export function isPastDate(date: Date): boolean {
	return getPSTDateString(date) < getPSTDateString(new Date());
}

/**
 * Compares two Date objects to determine if they show the same BC wall clock time.
 *
 * @param time1 - The first Date object to compare.
 * @param time2 - The second Date object to compare.
 * @returns boolean - True if both dates show the same hours and minutes on a BC clock; false otherwise.
 *
 * Example usage:
 * const time1 = new Date('2024-07-29T10:00:00-07:00');
 * const time2 = new Date('2024-07-29T10:00:30-07:00');
 * const isSameTime = sameTime(time1, time2); // Returns true
 */
export function sameTime(time1: Date, time2: Date): boolean {
	const parts1 = getBCParts(time1);
	const parts2 = getBCParts(time2);

	return parts1.hour === parts2.hour && parts1.minute === parts2.minute;
}

/**
 * Converts given BC hours and minutes into a Date object.
 *
 * @param hours - The hours on a BC clock.
 * @param minutes - The minutes on a BC clock.
 * @returns Date - The instant of that BC wall clock time on an arbitrary date.
 *
 * This function uses February 1, 1970 as the date, as the focus is on the time.
 * The time-only values from the API (schedule start and end) are held this way,
 * so reading them back with getBCParts gives the same hours and minutes on any
 * computer, and sending them back gives the server the same wall clock time.
 *
 * Example usage:
 * const date = timeToDate(10, 30); // Returns 10:30 AM BC on February 1, 1970
 */
export function timeToDate(hours: number, minutes: number): Date {
	return fromBCParts({
		year: 1970,
		month: 2,
		day: 1,
		hour: hours,
		minute: minutes,
	});
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
 * @param date - The date to check if it is a holiday, either an instant (whose
 * BC calendar date is used) or a year, month (1-12) and day.
 * @returns boolean - True if the date is a holiday, false otherwise.
 *
 * The function first retrieves the year from the given date.
 * It then checks if there is a holiday list available for that year in the HOLIDAYS object.
 * If a holiday list is available, it checks if the given date matches any holiday in that list
 * by comparing the day and month. The holidays are plain calendar dates, so
 * their own local fields are read.
 */
export function isHoliday(
	date: Date | { year: number; month: number; day: number }
): boolean {
	const { year, month, day } = date instanceof Date ? getBCParts(date) : date;

	// Check if there is a holiday list for the specified year
	if (HOLIDAYS[year]) {
		// Check if the given date matches any holiday in the list for that year
		return HOLIDAYS[year].some(
			(holiday) =>
				holiday.getDate() === day && // Compare day
				holiday.getMonth() === month - 1 // Compare month
		);
	}

	// Return false if there are no holidays for the year or the date is not a holiday
	return false;
}

/**
 * Converts a given year and month number into a localized month-year string.
 *
 * @param yearNumber - The year to use for the date.
 * @param monthNumber - The month to use for the date (1 for January, 12 for December).
 * @param locale - Optional. The locale string to format the date (default is 'en-US').
 * @returns string - A formatted string representing the year and month (e.g., "January 2023").
 *
 * This function first validates the provided month number to ensure it is between 1 and 12.
 * It then creates a Date object using the provided year and month, adjusting the month index (0-11).
 * Finally, it converts the Date object into a localized string using toLocaleDateString with the
 * specified locale and options to display the full month name and year.
 *
 * Example usage:
 * const result = getYearMonthString(2023, 1); // "January 2023"
 */
export function getYearMonthString(
	yearNumber: number,
	monthNumber: number,
	locale = 'en-US'
): string {
	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error(
			'Invalid month number. Please provide a number between 1 and 12.'
		);
	}

	const date = new Date(yearNumber, monthNumber - 1);

	return date.toLocaleDateString(locale, {
		year: 'numeric',
		month: 'long',
	});
}

/**
 * Converts a given month number into a localized short month string.
 *
 * @param monthNumber - The month to use for the date (1 for January, 12 for December).
 * @param locale - Optional. The locale string to format the month (default is 'en-US').
 * @returns string - A formatted string representing the short month name (e.g., "Jan" for January).
 *
 * This function first validates the provided month number to ensure it is between 1 and 12.
 * It then creates a Date object using an arbitrary year (2000) and the provided month,
 * adjusting the month index (0-11) since JavaScript Date months are zero-indexed.
 * Finally, it converts the Date object into a localized string using toLocaleDateString with the
 * specified locale and options to display the short month name.
 *
 * Example usage:
 * const result = getShortMonthString(1); // "Jan"
 */
export function getShortMonthString(
	monthNumber: number,
	locale = 'en-US'
): string {
	if (monthNumber < 1 || monthNumber > 12) {
		throw new Error(
			'Invalid month number. Please provide a number between 1 and 12.'
		);
	}

	const date = new Date(2000, monthNumber - 1);

	return date.toLocaleDateString(locale, {
		month: 'short',
	});
}
