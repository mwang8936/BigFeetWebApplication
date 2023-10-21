export function sameDate(date1: Date, date2: Date) {
	return (
		date1.getFullYear() == date2.getFullYear() &&
		date1.getMonth() == date2.getMonth() &&
		date1.getDate() == date2.getDate()
	);
}

export function sameTime(time1: Date, time2: Date) {
	return (
		time1.getHours() == time2.getHours() &&
		time1.getMinutes() == time2.getMinutes() &&
		time1.getSeconds() == time2.getSeconds()
	);
}

export function timeToDate(hours: number, minutes: number) {
	return new Date(1970, 1, 1, hours, minutes);
}
