export function moneyToString(money: number): string {
	if (Number.isInteger(money)) {
		return money.toString();
	} else {
		return money.toFixed(2);
	}
}
