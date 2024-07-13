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
