export function formatPhoneNumber(phoneNumber: string): string {
	if (phoneNumber.length != 10) {
		return phoneNumber;
	} else {
		const areaCode = phoneNumber.slice(0, 3);
		const firstPart = phoneNumber.slice(3, 6);
		const secondPart = phoneNumber.slice(6);

		return `(${areaCode}) ${firstPart}-${secondPart}`;
	}
}

export function formatTimeFromDate(date: Date): string {
	const hour = date.getHours();
	const minute = date.getMinutes();

	return `${hour === 12 ? 12 : hour % 12}:${minute <= 9 ? '0' : ''}${minute} ${
		hour >= 12 ? 'PM' : 'AM'
	}`;
}

export function formatTimeFromNumber(time: number): string {
	const hour = Math.floor(time);
	const minute = (time - hour) * 60;

	return `${hour === 12 ? 12 : hour % 12}:${minute <= 9 ? '0' : ''}${minute} ${
		hour >= 12 ? 'PM' : 'AM'
	}`;
}

export function formatDateToQueryKey(date: Date): string {
	return date.toISOString().split('T')[0];
}
