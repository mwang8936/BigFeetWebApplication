import { useState, createContext, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import Calendar from './Calendar/Calendar.Component';
import ZoomOverlay from './components/ZoomOverlay.Component';

import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';

import FilterDateModal from '../miscallaneous/modals/scheduler/FilterDateModal.Component';
import AddReservationModal from '../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';
import GiftCardsModal from '../miscallaneous/modals/scheduler/calendar/GiftCardModal.Component';

import { useGiftCardsQuery } from '../../../hooks/gift-card.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';
import { useSchedulesQuery } from '../../../hooks/schedule.hooks';

import ERRORS from '../../../../constants/error.constants';

import {
	Language,
	PaymentMethod,
	Permissions,
	Role,
} from '../../../../models/enums';
import GiftCard from '../../../../models/Gift-Card.Model';
import Schedule from '../../../../models/Schedule.Model';
import User from '../../../../models/User.Model';

import { sameDate } from '../../../../utils/date.utils';
import { moneyToString } from '../../../../utils/number.utils';

const ScheduleDateContext = createContext<
	{ date: Date; setDate(date: Date): void } | undefined
>(undefined);

export function useScheduleDateContext() {
	const context = useContext(ScheduleDateContext);
	if (context === undefined) {
		throw new Error(
			'useScheduleDateContext must be within ScheduleDateProvider.'
		);
	}

	return context;
}

const CalendarScaleContext = createContext<
	{ scale: number; setScale(scale: number): void } | undefined
>(undefined);

export function useCalendarScaleContext() {
	const context = useContext(CalendarScaleContext);

	if (context === undefined) {
		throw new Error(
			'useCalendarScaleContext must be within CalendarScaleProvider.'
		);
	}

	return context;
}

const Scheduler: FC = () => {
	const { t } = useTranslation();

	const [openAddReservationModal, setOpenAddReservationModal] = useState(false);
	const [openGiftCardModal, setOpenGiftCardModal] = useState(false);

	const [date, setDate] = useState<Date>(new Date());
	const [openFilterDialog, setOpenFilterDialog] = useState(false);

	const [scale, setScale] = useState(1);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	const giftCardGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_GIFT_CARD
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const giftCardsQuery = useGiftCardsQuery({
		date,
		gettable: giftCardGettable,
		staleTime: Infinity,
	});
	const giftCards: GiftCard[] = (giftCardsQuery.data as GiftCard[]) || [];

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const giftCardCreatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_GIFT_CARD
	);

	const reservationCreatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_RESERVATION
	);

	const totalGiftCardAmount = giftCards
		.map((giftCard) => giftCard.payment_amount)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const totalReservations = schedules.flatMap(
		(schedule) => schedule.reservations
	);

	const totalSessions = totalReservations
		.flatMap((reservation) => [
			reservation.service.acupuncture * 1.5,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const total10MinuteSessions = totalReservations.filter(
		(reservation) =>
			reservation.service.time === 10 &&
			!reservation.service.body &&
			!reservation.service.feet &&
			!reservation.service.acupuncture
	).length;
	const total15MinuteSessions = totalReservations.filter(
		(reservation) =>
			reservation.service.time === 15 &&
			!reservation.service.body &&
			!reservation.service.feet &&
			!reservation.service.acupuncture
	).length;
	const total30MinuteSessions = totalReservations.filter(
		(reservation) =>
			reservation.service.time === 30 &&
			!reservation.service.body &&
			!reservation.service.feet &&
			!reservation.service.acupuncture
	).length;

	const totalCash =
		totalReservations
			.map((reservation) => reservation.cash || 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0) +
		giftCards
			.filter((giftCard) => giftCard.payment_method === PaymentMethod.CASH)
			.map((giftCard) => giftCard.payment_amount)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const filtered = !sameDate(date, new Date());

	const zoomIn = () => {
		setScale((prevScale) => prevScale + 0.1);
	};

	const zoomOut = () => {
		setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
	};

	const zoomReset = () => {
		setScale(1);
	};

	const displayDate = () => {
		let localeDateFormat;
		if (language === Language.SIMPLIFIED_CHINESE) {
			localeDateFormat = 'zh-CN';
		} else if (language === Language.TRADITIONAL_CHINESE) {
			localeDateFormat = 'zh-TW';
		} else {
			localeDateFormat = undefined;
		}

		const dateString = date.toLocaleDateString(localeDateFormat, {
			year: 'numeric',
			month: 'long',
			day: 'numeric',
			weekday: 'short',
		});

		return sameDate(new Date(), date)
			? `${t('Today')} - ${dateString}`
			: dateString;
	};

	return (
		<ScheduleDateContext.Provider value={{ date, setDate }}>
			<CalendarScaleContext.Provider value={{ scale, setScale }}>
				<div className="h-28 border-b-2 border-gray-400 flex flex-row justify-between">
					<div className="vertical-center ms-10 flex flex-col">
						<PermissionsButton
							btnTitle={'Add Reservation'}
							btnType={ButtonType.ADD}
							top={false}
							right={false}
							disabled={!reservationCreatable}
							missingPermissionMessage={ERRORS.reservation.permissions.add}
							onClick={() => setOpenAddReservationModal(true)}
						/>

						<PermissionsButton
							btnTitle={'Add Gift Card'}
							btnType={ButtonType.ADD}
							top={false}
							right={false}
							disabled={!giftCardCreatable}
							missingPermissionMessage={ERRORS.gift_card.permissions.add}
							onClick={() => setOpenGiftCardModal(true)}
						/>
					</div>

					<div className="vertical-center flex flex-col text-gray-600 text-xl">
						<div className="flex">
							{t('Total Reservations')}:
							<span className="font-bold ms-2">{totalSessions}</span>
						</div>

						<div className="flex">
							{t('Total Cash')}:
							<span className="font-bold ms-2">
								${moneyToString(totalCash)}
							</span>
						</div>

						<div className="flex">
							{t('Total Gift Cards')}:
							<span className="font-bold ms-2">
								${moneyToString(totalGiftCardAmount)}
							</span>
						</div>
					</div>

					<div className="vertical-center flex flex-col">
						<h1 className="my-auto mx-auto text-gray-600 text-3xl">
							{t('Scheduler')}
						</h1>

						<h1 className="mx-auto text-gray-600 text-xl">{displayDate()}</h1>
					</div>

					<div className="vertical-center flex flex-col text-gray-600 text-xl">
						<div className="flex">
							{t('10 Minutes')}:
							<span className="font-bold ms-2">{total10MinuteSessions}</span>
						</div>

						<div className="flex">
							{t('15 Minutes')}:
							<span className="font-bold ms-2">{total15MinuteSessions}</span>
						</div>

						<div className="flex">
							{t('30 Minutes')}:
							<span className="font-bold ms-2">{total30MinuteSessions}</span>
						</div>
					</div>

					<div className="vertical-center ms-10 flex flex-row ">
						<AdjustmentsHorizontalIcon
							className={`h-16 w-16 ${
								filtered
									? 'text-blue-600 hover:text-blue-400'
									: 'text-gray-600 hover:text-gray-400'
							} my-auto me-10 cursor-pointer transition-colors duration-200 hover:scale-110`}
							onClick={() => setOpenFilterDialog(true)}
						/>
					</div>

					<FilterDateModal
						open={openFilterDialog}
						setOpen={setOpenFilterDialog}
					/>
				</div>

				<ZoomOverlay zoomIn={zoomIn} zoomOut={zoomOut} zoomReset={zoomReset} />

				<div
					className="flex border border-gray-500 overflow-auto"
					style={{
						transform: `scale(${scale})`,
						transformOrigin: 'top left',
						width: `${100 / scale}%`,
						height: `${100 / scale}%`,
					}}>
					<Calendar />
				</div>

				<AddReservationModal
					open={openAddReservationModal}
					setOpen={setOpenAddReservationModal}
				/>

				<GiftCardsModal
					open={openGiftCardModal}
					setOpen={setOpenGiftCardModal}
					giftCards={giftCards}
				/>
			</CalendarScaleContext.Provider>
		</ScheduleDateContext.Provider>
	);
};

export default Scheduler;
