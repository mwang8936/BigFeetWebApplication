/**
 * Formats a 10-digit phone number into the (XXX) XXX-XXXX format.
 *
 * @param phoneNumber - The phone number string to format.
 * @returns string - The formatted phone number if it has 10 digits, otherwise returns the original string.
 *
 * The function checks if the phone number has exactly 10 digits.
 * If so, it formats the number into the (XXX) XXX-XXXX format by extracting the area code,
 * the first part of the number, and the second part of the number.
 * If the phone number does not have exactly 10 digits, it returns the original string.
 */
export const formatPhoneNumber = (phoneNumber: string) => {
	// Remove all non-digit characters
	const cleaned = phoneNumber.replace(/\D/g, '');

	// Handle different lengths of digits and apply formatting
	if (cleaned.length <= 3) {
		return `${cleaned}`;
	} else if (cleaned.length <= 6) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
	} else if (cleaned.length <= 10) {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	} else {
		return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
			6,
			10
		)}`;
	}
};

/**
 * Formats a Date object into a 12-hour time string with AM/PM notation.
 *
 * @param date - The Date object to format.
 * @returns string - The formatted time in the format of HH:mm AM/PM.
 *
 * The function extracts the hours and minutes from the provided Date object.
 * It converts the hours into a 12-hour format and ensures that single-digit minutes are padded with a leading zero.
 * The function also appends AM or PM based on the time of day.
 */
export function formatTimeFromDate(date: Date): string {
	// Extract hours and minutes from the date object
	const hour = date.getHours();
	const minute = date.getMinutes();

	// Convert hours to 12-hour format and handle edge cases
	const formattedHour = hour === 12 ? 12 : hour % 12;
	const formattedMinute = minute <= 9 ? `0${minute}` : `${minute}`;

	// Determine AM or PM
	const period = hour >= 12 ? 'PM' : 'AM';

	// Return the formatted time string
	return `${formattedHour}:${formattedMinute} ${period}`;
}

/**
 * Formats a time number into a 12-hour time string with AM/PM notation.
 *
 * @param time - The time represented as a decimal number where the integer part represents hours and the fractional part represents minutes.
 * @returns string - The formatted time in the format of HH:mm AM/PM.
 *
 * The function converts a time number into hours and minutes, then formats it into a 12-hour clock format with AM/PM notation.
 * It handles cases where hours and minutes need to be padded or adjusted for proper time formatting.
 */
export function formatTimeFromNumber(time: number): string {
	// Extract hours from the time number
	const hour = Math.floor(time);

	// Calculate minutes from the fractional part of the time number
	const minute = (time - hour) * 60;

	// Format hours to 12-hour clock format, accounting for noon and midnight
	const formattedHour = hour === 12 ? 12 : hour % 12;

	// Format minutes, padding with a leading zero if necessary
	const formattedMinute =
		minute <= 9 ? `0${minute.toFixed(0)}` : `${minute.toFixed(0)}`;

	// Determine AM or PM based on the hour
	const period = hour >= 12 ? 'PM' : 'AM';

	// Return the formatted time string
	return `${formattedHour.toFixed(0)}:${formattedMinute} ${period}`;
}

/**
 * Formats a Date object into a string suitable for use as a query key in React Query.
 *
 * @param date - The Date object to be formatted.
 * @returns string - The formatted date string in the format "MM/DD/YYYY", adjusted to the America/Los_Angeles time zone.
 *
 * The function converts the date into a string with the format "MM/DD/YYYY" considering the specified time zone.
 */
export function formatDateToQueryKey(date: Date): string {
	// Convert the date to a localized string in 'America/Los_Angeles' time zone
	return date.toLocaleString('en-US', {
		timeZone: 'America/Los_Angeles', // Set the time zone to 'America/Los_Angeles'
		year: 'numeric', // Format year as a 4-digit number
		month: '2-digit', // Format month as a 2-digit number
		day: '2-digit', // Format day as a 2-digit number
	});
}
