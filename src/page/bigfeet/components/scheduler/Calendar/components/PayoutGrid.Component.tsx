import { FC } from 'react';
import { moneyToString } from '../../../../../../utils/number.utils';
import { useTranslation } from 'react-i18next';
import { TipMethod } from '../../../../../../models/enums';
import Reservation from '../../../../../../models/Reservation.Model';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { useScheduleDateContext } from '../../Scheduler.Component';
import { isHoliday } from '../../../../../../utils/date.utils';
import STORES from '../../../../../../constants/store.constants';

interface PayoutGridProp {
	row: number;
	colNum: number;
	award: number;
	reservations: Reservation[];
	vipPackages: VipPackage[];
}

const PayoutGrid: FC<PayoutGridProp> = ({
	row,
	colNum,
	award,
	reservations,
	vipPackages,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const awardMoney = Math.max(award - STORES.award_reservation_count, 0);

	const completedReservations = reservations.filter((reservation) => {
		const time = reservation.time ?? reservation.service.time;
		const endDate = reservation.reserved_date.getTime() + time * (1000 * 60);

		return endDate <= new Date().getTime();
	});
	const reservationSessions = completedReservations.filter(
		(reservation) =>
			reservation.service.body > 0 ||
			reservation.service.feet > 0 ||
			reservation.service.acupuncture > 0
	);

	const requestedSessions = reservationSessions.filter(
		(reservation) => reservation.requested_employee
	);

	const requestedTotal = requestedSessions
		.flatMap((reservation) => [
			reservation.service.acupuncture,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const holidayTotal = isHoliday(date)
		? reservationSessions
				.flatMap((reservation) => [
					reservation.service.acupuncture,
					reservation.service.feet,
					reservation.service.body,
				])
				.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0) * 2
		: 0;

	const cashOutTotal = reservations
		.map((reservation) => reservation.cash_out ?? 0)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const tipReservations = reservations.filter(
		(reservation) =>
			(reservation.tip_method === TipMethod.HALF ||
				reservation.tip_method === TipMethod.MACHINE) &&
			reservation.tips !== null
	);
	const tipsTotal =
		tipReservations
			.map((reservation) => reservation.tips as number)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0) * 0.9;

	const vipPackagesCommissionTotal = vipPackages
		.map(
			(vipPackage) =>
				vipPackage.commission_amount / vipPackage.employee_ids.length
		)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const payoutElement =
		awardMoney > 0 ? (
			<span>
				{t('Payout')}{' '}
				<span className="font-bold">
					{`= \$${moneyToString(
						requestedTotal +
							holidayTotal +
							cashOutTotal +
							tipsTotal +
							vipPackagesCommissionTotal
					)}`}

					<span className="text-red-500">{` + \$${moneyToString(
						awardMoney
					)} = \$${moneyToString(
						requestedTotal +
							holidayTotal +
							cashOutTotal +
							tipsTotal +
							vipPackagesCommissionTotal +
							awardMoney
					)}`}</span>
				</span>
			</span>
		) : (
			<span>
				{t('Payout')}{' '}
				<span className="font-bold">{`= \$${moneyToString(
					requestedTotal +
						holidayTotal +
						cashOutTotal +
						tipsTotal +
						vipPackagesCommissionTotal
				)}`}</span>
			</span>
		);
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 group overflow-visible cursor-pointer"
			>
				{payoutElement}
			</div>
		</>
	);
};

export default PayoutGrid;
