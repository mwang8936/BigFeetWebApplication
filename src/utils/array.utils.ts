/**
 * Checks if two arrays have the same content, regardless of order.
 *
 * @param arr1 - The first array to compare.
 * @param arr2 - The second array to compare.
 * @returns boolean - True if both arrays contain the same elements, false otherwise.
 *
 * This function checks if two arrays have the same elements in any order.
 * It returns false if the arrays have different lengths or if any element
 * in one array is not found in the other.
 *
 * Example usage:
 * const array1 = [1, 2, 3];
 * const array2 = [3, 1, 2];
 * arraysHaveSameContent(array1, array2); // Returns true
 */
export function arraysHaveSameContent<T>(arr1: T[], arr2: T[]): boolean {
	if (arr1.length !== arr2.length) {
		return false;
	}

	if (!arr1.every((item) => arr2.includes(item))) {
		return false;
	}

	if (!arr2.every((item) => arr1.includes(item))) {
		return false;
	}

	return true;
}
