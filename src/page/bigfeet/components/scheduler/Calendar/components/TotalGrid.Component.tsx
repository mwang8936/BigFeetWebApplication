import { FC } from 'react';
import Reservation from '../../../../../../models/Reservation.Model';
import { formatTimeFromDate } from '../../../../../../utils/string.utils';
import { useTranslation } from 'react-i18next';

interface TotalGridProp {
	row: number;
	colNum: number;
	reservations: Reservation[];
}

const TotalGrid: FC<TotalGridProp> = ({ row, colNum, reservations }) => {
	const { t } = useTranslation();

	const bodyReservations = reservations.filter(
		(reservation) => reservation.service.body > 0
	);
	bodyReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const bodyTotal = bodyReservations
		.map((reservation) => reservation.service.body)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const bodyTexts = bodyReservations.map((reservation) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);
		const endTime =
			new Date(reservation.reserved_date).getTime() +
			reservation.service.time * 60 * 1000;
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});

	const feetReservations = reservations.filter(
		(reservation) => reservation.service.feet > 0
	);
	feetReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const feetTotal = feetReservations
		.map((reservation) => reservation.service.feet)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const feetTexts = feetReservations.map((reservation) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);
		const endTime =
			new Date(reservation.reserved_date).getTime() +
			reservation.service.time * 60 * 1000;
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});

	const accReservations = reservations.filter(
		(reservation) => reservation.service.accupuncture > 0
	);
	accReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const accTotal = accReservations
		.map((reservation) => reservation.service.accupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const accTexts = accReservations.map((reservation) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);
		const endTime =
			new Date(reservation.reserved_date).getTime() +
			reservation.service.time * 60 * 1000;
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 flex flex-col group overflow-visible">
				<span>
					{t('B')}: <span className="font-bold">{bodyTotal}</span>
				</span>
				<span>
					{t('F')}: <span className="font-bold">{feetTotal}</span>
				</span>
				<span>
					{t('A')}: <span className="font-bold">{accTotal}</span>
				</span>
				{(bodyReservations.length > 0 ||
					feetReservations.length > 0 ||
					accReservations.length > 0) && (
					<span className="total-tip group-hover:scale-100 z-[3]">
						{bodyReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Body Services:')}
								{bodyTexts}
								{(feetReservations.length > 0 ||
									accReservations.length > 0) && <br />}
							</span>
						)}
						{feetReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Feet Services:')}
								{feetTexts}
								{accReservations.length > 0 && <br />}
							</span>
						)}
						{accReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Accupuncture Services:')}
								{accTexts}
							</span>
						)}
					</span>
				)}
			</div>
		</>
	);
};

export default TotalGrid;
