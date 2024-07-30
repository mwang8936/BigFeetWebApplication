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
