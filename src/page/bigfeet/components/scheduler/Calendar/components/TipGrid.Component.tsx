import { FC } from 'react';
import Reservation from '../../../../../../models/Reservation.Model';
import { TipMethod } from '../../../../../../models/enums';
import { formatTimeFromDate } from '../../../../../../utils/string.utils';
import { moneyToString } from '../../../../../../utils/number.utils';

interface TipGridProp {
	row: number;
	colNum: number;
	reservations: Reservation[];
}

const TipGrid: FC<TipGridProp> = ({ row, colNum, reservations }) => {
	const tipReservations = reservations.filter(
		(reservation) =>
			(reservation.tip_method === TipMethod.HALF ||
				reservation.tip_method === TipMethod.MACHINE) &&
			reservation.tips !== null
	);
	tipReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const tips = tipReservations.map((reservation) => reservation.tips as number);
	const tipsTotal = tips.reduce(
		(acc, curr) => acc + parseFloat(curr.toString()),
		0
	);
	const tipsPayout = tipsTotal * 0.9;

	const tipsText = tips.map((tip) => moneyToString(tip)).join(' + ') + ' = ';
	const tipsTotalText = '$' + moneyToString(tipsTotal);
	const tipsPayoutText = '$' + tipsPayout.toFixed(2).toString();

	const tipsTexts = tipReservations.map((reservation, index) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);
		const endTime =
			new Date(reservation.reserved_date).getTime() +
			reservation.service.time * 60 * 1000;
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span className="flex flex-col" key={reservation.reservation_id}>
				<span>
					{`${startTimeText} - ${endTimeText} = (\$${
						reservation.tips && moneyToString(reservation.tips)
					})`}
					<br />
					{index !== tipReservations.length - 1 && <br />}
				</span>
			</span>
		);
	});
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 group overflow-visible">
				<span>
					{tipsText}
					<span className="font-bold">{tipsTotalText}</span>
				</span>
				<br />
				<span className="font-bold">{`${tipsTotalText} X 90% = ${tipsPayoutText}`}</span>
				{tipReservations.length > 0 && (
					<span className="grid-tip group-hover:scale-100 z-[3]">
						{tipsTexts}
					</span>
				)}
			</div>
		</>
	);
};

export default TipGrid;
