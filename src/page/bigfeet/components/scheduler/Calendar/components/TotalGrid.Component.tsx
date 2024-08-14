import { FC } from 'react';
import Reservation from '../../../../../../models/Reservation.Model';
import { formatTimeFromDate } from '../../../../../../utils/string.utils';
import { useTranslation } from 'react-i18next';
import { isHoliday } from '../../../../../../utils/date.utils';
import { useScheduleDateContext } from '../../Scheduler.Component';
import { moneyToString } from '../../../../../../utils/number.utils';

interface TotalGridProp {
	row: number;
	colNum: number;
	reservations: Reservation[];
}

const TotalGrid: FC<TotalGridProp> = ({ row, colNum, reservations }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const completedReservations = reservations.filter((reservation) => {
		const endDate =
			reservation.reserved_date.getTime() + reservation.service.time * 60000;

		return endDate <= new Date().getTime();
	});

	const bodyReservations = completedReservations.filter(
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
			<span
				key={`body-${reservation.reservation_id}`}>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});

	const feetReservations = completedReservations.filter(
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
			<span
				key={`feet-${reservation.reservation_id}`}>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});

	const acupunctureReservations = completedReservations.filter(
		(reservation) => reservation.service.acupuncture > 0
	);
	acupunctureReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const acupunctureTotal = acupunctureReservations
		.map((reservation) => reservation.service.acupuncture)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const acupunctureTexts = acupunctureReservations.map((reservation) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);
		const endTime =
			new Date(reservation.reserved_date).getTime() +
			reservation.service.time * 60 * 1000;
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span
				key={`acupuncture-${reservation.reservation_id}`}>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});

	const requestedReservations = reservations.filter((reservation) => {
		const isRequestedReservation =
			reservation.requested_employee &&
			(reservation.service.body > 0 ||
				reservation.service.feet > 0 ||
				reservation.service.acupuncture > 0);

		if (!isRequestedReservation) return false;

		const endDate =
			reservation.reserved_date.getTime() + reservation.service.time * 60000;

		const isCompleted = endDate <= new Date().getTime();
		return isCompleted;
	});
	requestedReservations.sort(
		(a, b) => a.reserved_date.getTime() - b.reserved_date.getTime()
	);
	const requestedTotal = requestedReservations
		.flatMap((reservation) => [
			reservation.service.acupuncture,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const requestedTexts = requestedReservations.map((reservation) => {
		const startTimeText = formatTimeFromDate(reservation.reserved_date);
		const endTime =
			new Date(reservation.reserved_date).getTime() +
			reservation.service.time * 60 * 1000;
		const endTimeText = formatTimeFromDate(new Date(endTime));
		return (
			<span
				key={`requested-${reservation.reservation_id}`}>{`${startTimeText} - ${endTimeText} (${reservation.service.shorthand})`}</span>
		);
	});
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 flex flex-col group overflow-visible">
				<span>
					{t('B')}: <span className="font-bold">{bodyTotal}</span>
				</span>
				<span>
					{t('F')}: <span className="font-bold">{feetTotal}</span>
				</span>
				<span>
					{t('A')}: <span className="font-bold">{acupunctureTotal}</span>
				</span>
				<span>
					{t('Requested Pay')}:{' '}
					<span className="font-bold">{`${requestedTotal} X \$1 = \$${moneyToString(
						requestedTotal
					)}`}</span>
				</span>
				{isHoliday(date) && (
					<span>
						{t('Holiday')}:{' '}
						<span className="font-bold">
							{bodyTotal > 0 && `${bodyTotal}${t('B')}`}
							{bodyTotal > 0 && feetTotal > 0 && ' + '}
							{feetTotal > 0 && `${feetTotal}${t('F')}`}
							{(bodyTotal > 0 || feetTotal > 0) &&
								acupunctureTotal > 0 &&
								' + '}
							{acupunctureTotal > 0 && `${acupunctureTotal}${t('A')}`}
							{` = ${
								bodyTotal + feetTotal + acupunctureTotal
							} X $2 = $${moneyToString(
								(bodyTotal + feetTotal + acupunctureTotal) * 2
							)}`}
						</span>
					</span>
				)}
				{(bodyReservations.length > 0 ||
					feetReservations.length > 0 ||
					acupunctureReservations.length > 0) && (
					<span className="grid-tip group-hover:scale-100 z-[3]">
						{bodyReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Body Services')}:{bodyTexts}
								{(feetReservations.length > 0 ||
									acupunctureReservations.length > 0 ||
									requestedReservations.length > 0) && <br />}
							</span>
						)}
						{feetReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Feet Services')}:{feetTexts}
								{(acupunctureReservations.length > 0 ||
									requestedReservations.length > 0) && <br />}
							</span>
						)}
						{acupunctureReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Acupuncture Services')}:{acupunctureTexts}
								{requestedReservations.length > 0 && <br />}
							</span>
						)}
						{requestedReservations.length > 0 && (
							<span className="flex flex-col">
								{t('Requested Reservations')}:{requestedTexts}
							</span>
						)}
					</span>
				)}
			</div>
		</>
	);
};

export default TotalGrid;
