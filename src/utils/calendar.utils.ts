import { formatTimeFromNumber } from './string.utils';

export function getListOfTimes(start: number, end: number): string[] {
	const possibleTimes: number[] = [];

	let defaultStart = 10;
	let defaultEnd = 22.5;

	if (
		possibleTimes.includes(start) &&
		possibleTimes.includes(end) &&
		start < end
	) {
		defaultStart = start;
		defaultEnd = end;
	}

	for (let i = defaultStart; i <= defaultEnd; i += 0.5) {
		possibleTimes.push(i);
	}

	const timeArr: string[] = [];

	for (const time of possibleTimes) {
		const formattedTime = formatTimeFromNumber(time);
		timeArr.push(formattedTime);
	}

	return timeArr;
}

export function timeHourToNumber(time: string): number {
	let hour: number =
		parseInt(time.split(':')[0]) + (time.includes('PM') ? 12 : 0);
	if (hour === 24) hour = 12;
	return hour;
}

export function timeMinuteToNumber(time: string): number {
	const minute: number = parseInt(time.split(':')[1]);
	return minute;
}

//time is in format: 6:30 PM
export function scrollable(time: string): boolean {
	const currentDate = new Date();
	const currentHours = currentDate.getHours();
	const currentMinutes = currentDate.getMinutes();

	const hours: number = timeHourToNumber(time);
	const minutesIsZero: boolean = timeMinuteToNumber(time) === 0;

	const sameHours = hours === currentHours;
	const sameMinutes = currentMinutes >= 30 !== minutesIsZero;

	return sameHours && sameMinutes;
}
