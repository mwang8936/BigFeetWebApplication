import { useState, createContext, useContext, FC } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Calendar from './Calendar/Calendar.Component';
import { PaymentMethod, Permissions, Role } from '../../../../models/enums';
import Schedule from '../../../../models/Schedule.Model';
import { sameDate } from '../../../../utils/date.utils';
import Employee from '../../../../models/Employee.Model';
import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../../../../models/requests/Reservation.Request.Model';
import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../../../../models/requests/Schedule.Request.Model';
import AddReservationModal from '../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';
import ZoomOverlay from './components/ZoomOverlay.Component';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../models/requests/Vip-Package.Request.Model';
import FilterDateModal from '../miscallaneous/modals/scheduler/FilterDateModal.Component';
import STORES from '../../../../constants/store.constants';
import { sortEmployees } from '../../../../utils/employee.utils';
import ERRORS from '../../../../constants/error.constants';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';
import { formatDateToQueryKey } from '../../../../utils/string.utils';
import { moneyToString } from '../../../../utils/number.utils';
import User from '../../../../models/User.Model';
import { useCustomersQuery } from '../../../hooks/customer.hooks';
import { useEmployeesQuery } from '../../../hooks/employee.hooks';
import { useSchedulesQuery } from '../../../hooks/schedule.hooks';
import { useServicesQuery } from '../../../hooks/service.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';
import {
	useAddScheduleMutation,
	useSignProfileScheduleMutation,
	useUpdateScheduleMutation,
} from '../../../hooks/schedule.hooks';
import {
	useAddReservationMutation,
	useDeleteReservationMutation,
	useUpdateReservationMutation,
} from '../../../hooks/reservation.hooks';
import {
	useAddVipPackageMutation,
	useDeleteVipPackageMutation,
	useUpdateVipPackageMutation,
} from '../../../hooks/vip-package.hooks';
import {
	useAddGiftCardMutation,
	useDeleteGiftCardMutation,
	useGiftCardsQuery,
	useUpdateGiftCardMutation,
} from '../../../hooks/gift-card.hooks';
import GiftCard from '../../../../models/Gift-Card.Model';
import GiftCardsModal from '../miscallaneous/modals/scheduler/calendar/GiftCardModal.Component';
import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '../../../../models/requests/GIft-Card.Request';

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

	const zoomIn = () => {
		setScale((prevScale) => prevScale + 0.1);
	};

	const zoomOut = () => {
		setScale((prevScale) => Math.max(0.1, prevScale - 0.1));
	};

	const zoomReset = () => {
		setScale(1);
	};

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
	const serviceGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	useCustomersQuery({
		gettable: customerGettable,
		refetchInterval: 1000 * 60 * 5,
	});
	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		refetchInterval: 1000 * 60 * 5,
	});
	const giftCardsQuery = useGiftCardsQuery({
		date,
		gettable: giftCardGettable,
		refetchInterval: 1000 * 60 * 5,
	});
	const giftCards: GiftCard[] = (giftCardsQuery.data as GiftCard[]) || [];
	useServicesQuery({
		gettable: serviceGettable,
		refetchInterval: 1000 * 60 * 5,
	});
	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: 0,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	let employeeList: Employee[] = [];

	try {
		const employees: Employee[] = (
			(employeeQuery.data as Employee[]) || []
		).filter((employee) => employee.role !== Role.DEVELOPER);
		employeeList.push(...employees);
	} catch {
		employeeList.push(user);
	}
	sortEmployees(employeeList, schedules, date);

	const creatable = [
		Permissions.PERMISSION_ADD_GIFT_CARD,
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

	const editable = [
		Permissions.PERMISSION_UPDATE_GIFT_CARD,
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

	const getPermission = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const displayDate = () => {
		return sameDate(new Date(), date)
			? `${t('Today')} - ${date.toDateString()}`
			: date.toDateString();
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

		if (getPermission && !sameDate(date, selectedDate)) {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(selectedDate)],
			});
		}
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
						disabled={!creatable}
						missingPermissionMessage={ERRORS.reservation.permissions.add}
						onClick={() => setOpenAddReservationModal(true)}
					/>

					<PermissionsButton
						btnTitle={t('Add Gift Card')}
						btnType={ButtonType.ADD}
						top={false}
						right={false}
						disabled={!creatable}
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
					employees={employeeList}
					schedules={schedules}
					creatable={creatable}
					onAddReservation={onAddReservation}
					onAddSchedule={onAddSchedule}
					onAddVipPackage={onAddVipPackage}
					editable={editable}
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
				creatable={creatable}
				onAddReservation={onAddReservation}
			/>

			<GiftCardsModal
				open={openGiftCardModal}
				setOpen={setOpenGiftCardModal}
				giftCards={giftCards}
				creatable={creatable}
				onAddGiftCard={onAddGiftCard}
				editable={editable}
				onEditGiftCard={onEditGiftCard}
				deletable={deletable}
				onDeleteGiftCard={onDeleteGiftCard}
			/>
		</ScheduleDateContext.Provider>
	);
};

export default Scheduler;
