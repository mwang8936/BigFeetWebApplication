import { useState, createContext, useContext, FC } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import Calendar from './Calendar/Calendar.Component';
import ZoomOverlay from './components/ZoomOverlay.Component';

import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';

import FilterDateModal from '../miscallaneous/modals/scheduler/FilterDateModal.Component';
import AddReservationModal from '../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';
import GiftCardsModal from '../miscallaneous/modals/scheduler/calendar/GiftCardModal.Component';

import { useCustomersQuery } from '../../../hooks/customer.hooks';
import { useEmployeesQuery } from '../../../hooks/employee.hooks';
import {
	useAddGiftCardMutation,
	useDeleteGiftCardMutation,
	useGiftCardsQuery,
	useUpdateGiftCardMutation,
} from '../../../hooks/gift-card.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';
import {
	useAddReservationMutation,
	useDeleteReservationMutation,
	useUpdateReservationMutation,
} from '../../../hooks/reservation.hooks';
import {
	useAddScheduleMutation,
	useSignProfileScheduleMutation,
	useSchedulesQuery,
	useUpdateScheduleMutation,
} from '../../../hooks/schedule.hooks';
import { useServicesQuery } from '../../../hooks/service.hooks';
import {
	useAddVipPackageMutation,
	useDeleteVipPackageMutation,
	useUpdateVipPackageMutation,
} from '../../../hooks/vip-package.hooks';

import ERRORS from '../../../../constants/error.constants';
import STORES from '../../../../constants/store.constants';

import Employee from '../../../../models/Employee.Model';
import { PaymentMethod, Permissions, Role } from '../../../../models/enums';
import GiftCard from '../../../../models/Gift-Card.Model';
import Schedule from '../../../../models/Schedule.Model';
import User from '../../../../models/User.Model';

import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '../../../../models/requests/GIft-Card.Request';
import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../../../../models/requests/Reservation.Request.Model';
import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../../../../models/requests/Schedule.Request.Model';

import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../models/requests/Vip-Package.Request.Model';

import { sameDate } from '../../../../utils/date.utils';
import { sortEmployees } from '../../../../utils/employee.utils';
import { moneyToString } from '../../../../utils/number.utils';
import { formatDateToQueryKey } from '../../../../utils/string.utils';

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

const Scheduler: FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const [openAddReservationModal, setOpenAddReservationModal] = useState(false);
	const [openGiftCardModal, setOpenGiftCardModal] = useState(false);

	const [date, setDate] = useState<Date>(new Date());
	const [filtered, setFiltered] = useState(false);
	const [openFilterDialog, setOpenFilterDialog] = useState(false);

	const [scale, setScale] = useState(1);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const customerGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_CUSTOMER
	);
	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const giftCardGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_GIFT_CARD
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);
	const serviceGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);

	useCustomersQuery({
		gettable: customerGettable,
		refetchInterval: 1000 * 60 * 5,
	});

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

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

	useServicesQuery({
		gettable: serviceGettable,
		refetchInterval: 1000 * 60 * 5,
	});

	sortEmployees(employees, schedules, date);

	const giftCardCreatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_GIFT_CARD
	);
	const scheduleCreatable = [
		Permissions.PERMISSION_ADD_RESERVATION,
		Permissions.PERMISSION_ADD_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const addGiftCardMutation = useAddGiftCardMutation({});

	const onAddGiftCard = async (request: AddGiftCardRequest) => {
		addGiftCardMutation.mutate({ request });
	};

	const addReservationMutation = useAddReservationMutation({});

	const onAddReservation = async (request: AddReservationRequest) => {
		addReservationMutation.mutate({ request });
	};

	const addScheduleMutation = useAddScheduleMutation({});

	const onAddSchedule = async (request: AddScheduleRequest) => {
		addScheduleMutation.mutate({ request });
	};

	const addVipPackageMutation = useAddVipPackageMutation({});

	const onAddVipPackage = async (request: AddVipPackageRequest) => {
		addVipPackageMutation.mutate({ request });
	};

	const giftCardEditable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_GIFT_CARD
	);
	const scheduleEditable = [
		Permissions.PERMISSION_UPDATE_RESERVATION,
		Permissions.PERMISSION_UPDATE_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const updateGiftCardMutation = useUpdateGiftCardMutation({});

	const onEditGiftCard = async (
		giftCardId: string,
		request: UpdateGiftCardRequest
	) => {
		const originalDate = date;
		const newDate = request.date;

		updateGiftCardMutation.mutate({
			giftCardId,
			request,
			originalDate,
			newDate,
		});
	};

	const updateReservationMutation = useUpdateReservationMutation({});

	const onEditReservation = async (
		reservationId: number,
		request: UpdateReservationRequest
	) => {
		const originalDate = date;
		const newDate = request.reserved_date;

		updateReservationMutation.mutate({
			reservationId,
			request,
			originalDate,
			newDate,
		});
	};

	const updateScheduleMutation = useUpdateScheduleMutation({});

	const onEditSchedule = async (
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	) => {
		updateScheduleMutation.mutate({ date, employeeId, request });
	};

	const updateVipPackageMutation = useUpdateVipPackageMutation({});

	const onEditVipPackage = async (
		serial: string,
		request: UpdateVipPackageRequest
	) => {
		const originalDate = date;
		const newDate = request.date;

		updateVipPackageMutation.mutate({ serial, request, originalDate, newDate });
	};

	const giftCardDeletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_GIFT_CARD
	);
	const deletable = [
		Permissions.PERMISSION_DELETE_RESERVATION,
		Permissions.PERMISSION_DELETE_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const deleteGiftCardMutation = useDeleteGiftCardMutation({});

	const onDeleteGiftCard = async (giftCardId: string) => {
		deleteGiftCardMutation.mutate({ giftCardId, date });
	};

	const deleteReservationMutation = useDeleteReservationMutation({});

	const onDeleteReservation = async (reservationId: number) => {
		deleteReservationMutation.mutate({ reservationId, date });
	};

	const deleteVipPackageMutation = useDeleteVipPackageMutation({});

	const onDeleteVipPackage = async (serial: string) => {
		deleteVipPackageMutation.mutate({ serial, date });
	};

	const signProfileScheduleMutation = useSignProfileScheduleMutation({});

	const onScheduleSigned = async (date: Date) => {
		signProfileScheduleMutation.mutate({ date });
	};

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

	const totalCash =
		totalReservations
			.map((reservation) => reservation.cash || 0)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0) +
		giftCards
			.filter((giftCard) => giftCard.payment_method === PaymentMethod.CASH)
			.map((giftCard) => giftCard.payment_amount)
			.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const onDateFiltered = (selectedDate: Date) => {
		const currentDate = new Date();
		setFiltered(
			selectedDate.getFullYear != currentDate.getFullYear ||
				selectedDate.getMonth() != currentDate.getMonth() ||
				selectedDate.getDate() != currentDate.getDate()
		);
		setDate(selectedDate);

		if (scheduleGettable && !sameDate(date, selectedDate)) {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(selectedDate)],
			});
		}
	};

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
		return sameDate(new Date(), date)
			? `${t('Today')} - ${date.toDateString()}`
			: date.toDateString();
	};

	return (
		<ScheduleDateContext.Provider value={{ date, setDate }}>
			<div className="h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
				<div className="vertical-center ms-10 flex flex-col">
					<PermissionsButton
						btnTitle={t('Add Reservation')}
						btnType={ButtonType.ADD}
						top={false}
						right={false}
						disabled={!scheduleCreatable}
						missingPermissionMessage={ERRORS.reservation.permissions.add}
						onClick={() => setOpenAddReservationModal(true)}
					/>

					<PermissionsButton
						btnTitle={t('Add Gift Card')}
						btnType={ButtonType.ADD}
						top={false}
						right={false}
						disabled={!giftCardCreatable}
						missingPermissionMessage={ERRORS.gift_card.permissions.add}
						onClick={() => setOpenGiftCardModal(true)}
					/>
				</div>
				<div className="vertical-center flex text-gray-600 text-xl">
					{t('Total Cash')}:
					<span className="font-bold ms-2">${moneyToString(totalCash)}</span>
				</div>
				<div className="vertical-center flex flex-col">
					<h1 className="my-auto mx-auto text-gray-600 text-3xl">
						{t('Scheduler')}
					</h1>
					<h1 className="mx-auto text-gray-600 text-xl">{displayDate()}</h1>
				</div>
				<div className="vertical-center flex flex-col text-gray-600 text-xl">
					<div className="flex">
						{t('Total Reservations')}:
						<span className="font-bold ms-2">{totalSessions}</span>
					</div>
					<div className="flex">
						{t('Total Gift Cards')}:
						<span className="font-bold ms-2">
							${moneyToString(totalGiftCardAmount)}
						</span>
					</div>
				</div>

				<AdjustmentsHorizontalIcon
					className={`h-16 w-16 ${
						filtered ? 'text-blue-600' : 'text-gray-600'
					} my-auto me-10 cursor-pointer`}
					onClick={() => {
						setOpenFilterDialog(true);
					}}
				/>

				<FilterDateModal
					open={openFilterDialog}
					setOpen={setOpenFilterDialog}
					date={date}
					onDateSelected={onDateFiltered}
					editable={true}
					selectPast={true}
					selectFuture={true}
				/>
			</div>
			<ZoomOverlay zoomIn={zoomIn} zoomOut={zoomOut} zoomReset={zoomReset} />
			<div
				className="flex border border-gray-500 overflow-auto transform transition-transform duration-300 ease-in-out"
				style={{
					transform: `scale(${scale})`,
					transformOrigin: 'top left',
					width: `${100 / scale}%`,
					height: `${100 / scale}%`,
				}}>
				<Calendar
					date={date}
					start={STORES.start}
					end={STORES.end}
					employees={employees}
					schedules={schedules}
					creatable={scheduleCreatable}
					onAddReservation={onAddReservation}
					onAddSchedule={onAddSchedule}
					onAddVipPackage={onAddVipPackage}
					editable={scheduleEditable}
					onEditReservation={onEditReservation}
					onEditSchedule={onEditSchedule}
					onEditVipPackage={onEditVipPackage}
					deletable={deletable}
					onDeleteReservation={onDeleteReservation}
					onDeleteVipPackage={onDeleteVipPackage}
					onScheduleSigned={onScheduleSigned}
				/>
			</div>
			<AddReservationModal
				open={openAddReservationModal}
				setOpen={setOpenAddReservationModal}
				creatable={scheduleCreatable}
				onAddReservation={onAddReservation}
			/>

			<GiftCardsModal
				open={openGiftCardModal}
				setOpen={setOpenGiftCardModal}
				giftCards={giftCards}
				creatable={scheduleCreatable}
				onAddGiftCard={onAddGiftCard}
				editable={giftCardEditable}
				onEditGiftCard={onEditGiftCard}
				deletable={giftCardDeletable}
				onDeleteGiftCard={onDeleteGiftCard}
			/>
		</ScheduleDateContext.Provider>
	);
};

export default Scheduler;
