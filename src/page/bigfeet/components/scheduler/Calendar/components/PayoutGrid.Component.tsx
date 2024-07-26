import { FC } from 'react';
import { moneyToString } from '../../../../../../utils/number.utils';
import { useTranslation } from 'react-i18next';
import { TipMethod } from '../../../../../../models/enums';
import Reservation from '../../../../../../models/Reservation.Model';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { useScheduleDateContext } from '../../Scheduler.Component';
import { isHoliday } from '../../../../../../utils/date.utils';

interface PayoutGridProp {
	row: number;
	colNum: number;
	reservations: Reservation[];
	vipPackages: VipPackage[];
}

const PayoutGrid: FC<PayoutGridProp> = ({
	row,
	colNum,
	reservations,
	vipPackages,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const reservationSessions = reservations.filter(
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
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 group overflow-visible cursor-pointer">
				<span>
					{t('Payout')}{' '}
					<span className="font-bold">{`= \$${moneyToString(
						requestedTotal +
							holidayTotal +
							tipsTotal +
							vipPackagesCommissionTotal
					)}`}</span>
				</span>
			</div>
		</>
	);
};

export default PayoutGrid;
