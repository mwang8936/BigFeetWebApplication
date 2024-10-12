import { FC } from 'react';

import Reservation from '../../../../../../models/Reservation.Model';

import { moneyToString } from '../../../../../../utils/number.utils';
import { formatTimeFromDate } from '../../../../../../utils/string.utils';

interface CashOutGridProp {
	row: number;
	colNum: number;
	reservations: Reservation[];
}

const CashOutGrid: FC<CashOutGridProp> = ({ row, colNum, reservations }) => {
	const cashOutReservations = reservations.filter(
		(reservation) => reservation.cash_out
	);
	cashOutReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const cashOuts = cashOutReservations.map(
		(reservation) => reservation.cash_out as number
	);
	const cashOutTotal = cashOuts.reduce(
		(acc, curr) => acc + parseFloat(curr.toString()),
		0
	);

	const cashOutText =
		cashOuts.map((cashOut) => moneyToString(cashOut)).join(' + ') + ' = ';
	const cashOutTotalText = '$' + moneyToString(cashOutTotal);

	const cashOutTexts = cashOutReservations.map((reservation, index) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);

		const time = reservation.time ?? reservation.service.time;
		const endTime = reservation.reserved_date.getTime() + time * (1000 * 60);
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span className="flex flex-col" key={reservation.reservation_id}>
				<span>
					{`${startTimeText} - ${endTimeText} = (\$${
						reservation.cash_out && moneyToString(reservation.cash_out)
					})`}
					<br />
					{index !== cashOutReservations.length - 1 && <br />}
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
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 transition-colors ease-in-out duration-200 overflow-visible group">
				<span>
					{cashOutText}
					<span className="font-bold">{cashOutTotalText}</span>
				</span>
				{cashOutReservations.length > 0 && (
					<span className="grid-tip group-hover:scale-100 z-[3]">
						{cashOutTexts}
					</span>
				)}
			</div>
		</>
	);
};

export default CashOutGrid;
