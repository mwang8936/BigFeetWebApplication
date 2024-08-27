import { FC } from 'react';
import { moneyToString } from '../../../../../../utils/number.utils';
import { useTranslation } from 'react-i18next';
import { Permissions, TipMethod } from '../../../../../../models/enums';
import Reservation from '../../../../../../models/Reservation.Model';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { useScheduleDateContext } from '../../Scheduler.Component';
import { isHoliday } from '../../../../../../utils/date.utils';
import { useSchedulesQuery } from '../../../../../hooks/schedule.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';
import User from '../../../../../../models/User.Model';
import Schedule from '../../../../../../models/Schedule.Model';
import STORES from '../../../../../../constants/store.constants';

interface PayoutGridProp {
	row: number;
	colNum: number;
	addAward: boolean;
	reservations: Reservation[];
	vipPackages: VipPackage[];
}

const PayoutGrid: FC<PayoutGridProp> = ({
	row,
	colNum,
	addAward,
	reservations,
	vipPackages,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const userQuery = useUserQuery({
		gettable: true,
	});
	const user: User = userQuery.data;

	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = scheduleQuery.data ?? [];

	const totalReservations = schedules
		.flatMap((schedule) => schedule.reservations)
		.filter((reservation) => {
			const time = reservation.time ?? reservation.service.time;
			const endDate = reservation.reserved_date.getTime() + time * (1000 * 60);

			return endDate <= new Date().getTime();
		});

	const totalSessions = totalReservations
		.flatMap((reservation) => [
			reservation.service.acupuncture * 1.5,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const awardMoney = totalSessions - STORES.award_reservation_count;

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
		addAward && awardMoney > 0 ? (
			<span>
				{t('Payout')}{' '}
				<span className="font-bold">
					{`= \$${moneyToString(
						requestedTotal +
							holidayTotal +
							tipsTotal +
							vipPackagesCommissionTotal
					)}`}

					<span className="text-red-500">{` + \$${awardMoney} = \$${moneyToString(
						requestedTotal +
							holidayTotal +
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
					requestedTotal + holidayTotal + tipsTotal + vipPackagesCommissionTotal
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
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 group overflow-visible cursor-pointer">
				{payoutElement}
			</div>
		</>
	);
};

export default PayoutGrid;
