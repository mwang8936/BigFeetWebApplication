/**
 * Converts a number representing money into a string format.
 *
 * @param money - The amount of money to convert, represented as a number.
 *
 * @returns A string representing the money value. If the money amount is an integer,
 *         it returns the number as a string without decimal places. If the amount has
 *         decimal places, it returns the number formatted to two decimal places.
 */
export function moneyToString(money: number): string {
	if (Number.isInteger(money)) {
		// If the money amount is an integer, return it as a string without decimal places.
		return money.toString();
	} else {
		// If the money amount has decimal places, format it to two decimal places.
		return money.toFixed(2);
	}
}

/**
 * Converts a session count into a string format.
 *
 * @param sessionCount - The number of sessions to convert, represented as a number.
 *
 * @returns A string representing the session count. If the session count is an integer,
 *         it returns the number as a string without decimal places. If the session count has
 *         decimal places, it returns the number formatted to one decimal place.
 */
export function sessionToString(sessionCount: number): string {
	if (Number.isInteger(sessionCount)) {
		// If the money amount is an integer, return it as a string without decimal places.
		return sessionCount.toString();
	} else {
		// If the money amount has decimal places, format it to one decimal places.
		return sessionCount.toFixed(1);
	}
}

/**
 * Converts a decimal percentage to a string representation in whole or two decimal places.
 *
 * @param percentage - The percentage to convert, represented as a number (e.g., 0.25 for 25%).
 *
 * @returns A string representing the percentage. If the converted percentage is an integer,
 *          it returns the number as a string without decimal places. If the percentage has
 *          decimal places, it returns the number formatted to two decimal places.
 *
 * Example usage:
 * const result = percentageToString(0.2575); // "25.75"
 * const result = percentageToString(0.3); // "30"
 * const result = percentageToString(1); // "100"
 */
export function percentageToString(percentage: number): string {
	const hundredPercentage = percentage * 100;

	if (Number.isInteger(hundredPercentage)) {
		// If the percentage is a whole number, return it as a string without decimal places.
		return hundredPercentage.toString();
	} else {
		// If the percentage has decimal places, format it to two decimal places.
		return hundredPercentage.toFixed(2);
	}
}
