export function sameDate(date1: Date, date2: Date): boolean {
	return (
		date1.getFullYear() == date2.getFullYear() &&
		date1.getMonth() == date2.getMonth() &&
		date1.getDate() == date2.getDate()
	);
}

export function sameTime(time1: Date, time2: Date): boolean {
	return (
		time1.getHours() == time2.getHours() &&
		time1.getMinutes() == time2.getMinutes()
	);
}

export function timeToDate(hours: number, minutes: number): Date {
	return new Date(1970, 1, 1, hours, minutes);
}

export function getBeginningOfMonth(date: Date): Date {
	const beginningOfMonthDate = new Date(date);
	beginningOfMonthDate.setDate(1);
	beginningOfMonthDate.setHours(0);
	beginningOfMonthDate.setMinutes(0);
	beginningOfMonthDate.setSeconds(0);
	beginningOfMonthDate.setMilliseconds(0);

	return beginningOfMonthDate;
}

export function getBeginningOfNextMonth(date: Date): Date {
	const beginningOfNextMonthDate = new Date(date);
	beginningOfNextMonthDate.setMonth(date.getMonth() + 1);
	beginningOfNextMonthDate.setDate(1);
	beginningOfNextMonthDate.setHours(0);
	beginningOfNextMonthDate.setMinutes(0);
	beginningOfNextMonthDate.setSeconds(0);
	beginningOfNextMonthDate.setMilliseconds(0);

	return beginningOfNextMonthDate;
}

export function doesDateOverlap(
	targetDate: Date,
	startDate: Date,
	endDate: Date,
	minuteRange?: number
): boolean {
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
		const targetStartDate = targetDateTrimmed;
		const targetEndDate = new Date(
			targetDateTrimmed.getTime() + minuteRange * 60000
		);

		return (
			(targetStartDate >= startDateTrimmed &&
				targetStartDate < endDateTrimmed) || //starts in between startDate and endDate
			(targetEndDate <= endDateTrimmed && targetEndDate > startDateTrimmed) || //ends in between startDate and endDate
			(targetStartDate <= startDateTrimmed && targetEndDate >= endDateTrimmed) //starts before startDate and ends after endDate
		);
	} else {
		return (
			targetDateTrimmed >= startDateTrimmed &&
			targetDateTrimmed <= endDateTrimmed
		);
	}
}
