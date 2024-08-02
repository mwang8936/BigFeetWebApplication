import { useState, createContext, useContext, FC } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Calendar from './Calendar/Calendar.Component';
import { Permissions, Role } from '../../../../models/enums';
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
import {
	addReservation,
	deleteReservation,
	updateReservation,
} from '../../../../service/reservation.service';
import { useNavigate } from 'react-router-dom';
import AddReservationModal from '../miscallaneous/modals/scheduler/calendar/AddReservationModal.Component';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';
import ZoomOverlay from './components/ZoomOverlay.Component';
import {
	addSchedule,
	updateSchedule,
} from '../../../../service/schedule.service';
import { signProfileSchedule } from '../../../../service/profile.service';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../models/requests/Vip-Package.Request.Model';
import {
	addVipPackage,
	deleteVipPackage,
	updateVipPackage,
} from '../../../../service/vip-package.service';
import FilterDateModal from '../miscallaneous/modals/scheduler/FilterDateModal.Component';
import STORES from '../../../../constants/store.constants';
import { sortEmployees } from '../../../../utils/employee.utils';
import ERRORS from '../../../../constants/error.constants';
import { useTranslation } from 'react-i18next';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../utils/toast.utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { formatDateToQueryKey } from '../../../../utils/string.utils';
import { moneyToString } from '../../../../utils/number.utils';
import {
	useSchedulesQuery,
	useServicesQuery,
} from '../../../../service/query/get-items.query';
import User from '../../../../models/User.Model';
import { useCustomersQuery } from '../../../hooks/customer.hooks';
import { useEmployeesQuery } from '../../../hooks/employee.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';

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
	const navigate = useNavigate();

	const [openAddReservationModal, setOpenAddReservationModal] = useState(false);

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
		Permissions.PERMISSION_ADD_RESERVATION,
		Permissions.PERMISSION_ADD_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const addReservationMutation = useMutation({
		mutationFn: (data: { request: AddReservationRequest }) =>
			addReservation(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Reservation...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					'schedules',
					formatDateToQueryKey(variables.request.reserved_date),
				],
			});
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			successToast(context.toastId, t('Reservation Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Add Reservation'),
					error.message
				);
		},
	});

	const onAddReservation = async (request: AddReservationRequest) => {
		addReservationMutation.mutate({ request });
	};

	const addScheduleMutation = useMutation({
		mutationFn: (data: { request: AddScheduleRequest }) =>
			addSchedule(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(variables.request.date)],
			});
			successToast(context.toastId, t('Schedule Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(context.toastId, t('Failed to Add Schedule'), error.message);
		},
	});

	const onAddSchedule = async (request: AddScheduleRequest) => {
		addScheduleMutation.mutate({ request });
	};

	const addVipPackageMutation = useMutation({
		mutationFn: (data: { request: AddVipPackageRequest }) =>
			addVipPackage(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(variables.request.date)],
			});
			successToast(context.toastId, t('Vip Package Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Add Vip Package'),
					error.message
				);
		},
	});

	const onAddVipPackage = async (request: AddVipPackageRequest) => {
		addVipPackageMutation.mutate({ request });
	};

	const editable = [
		Permissions.PERMISSION_UPDATE_RESERVATION,
		Permissions.PERMISSION_UPDATE_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const editReservationMutation = useMutation({
		mutationFn: (data: {
			reservationId: number;
			request: UpdateReservationRequest;
		}) => updateReservation(navigate, data.reservationId, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Reservation...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(date)],
			});
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			successToast(context.toastId, t('Reservation Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Reservation'),
					error.message
				);
		},
	});

	const onEditReservation = async (
		reservationId: number,
		request: UpdateReservationRequest
	) => {
		editReservationMutation.mutate({ reservationId, request });
	};

	const editScheduleMutation = useMutation({
		mutationFn: (data: {
			date: Date;
			employeeId: number;
			request: UpdateScheduleRequest;
		}) => updateSchedule(navigate, data.date, data.employeeId, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(date)],
			});
			successToast(context.toastId, t('Schedule Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Schedule'),
					error.message
				);
		},
	});

	const onEditSchedule = async (
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	) => {
		editScheduleMutation.mutate({ date, employeeId, request });
	};

	const editVipPackageMutation = useMutation({
		mutationFn: (data: { serial: string; request: UpdateVipPackageRequest }) =>
			updateVipPackage(navigate, data.serial, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(date)],
			});
			successToast(context.toastId, t('Vip Package Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Vip Package'),
					error.message
				);
		},
	});

	const onEditVipPackage = async (
		serial: string,
		request: UpdateVipPackageRequest
	) => {
		editVipPackageMutation.mutate({ serial, request });
	};

	const deletable = [
		Permissions.PERMISSION_DELETE_RESERVATION,
		Permissions.PERMISSION_DELETE_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const deleteReservationMutation = useMutation({
		mutationFn: (data: { reservationId: number }) =>
			deleteReservation(navigate, data.reservationId),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Deleting Reservation...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(date)],
			});
			successToast(context.toastId, t('Reservation Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Reservation'),
					error.message
				);
		},
	});

	const onDeleteReservation = async (reservationId: number) => {
		deleteReservationMutation.mutate({ reservationId });
	};

	const deleteVipPackageMutation = useMutation({
		mutationFn: (data: { serial: string }) =>
			deleteVipPackage(navigate, data.serial),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Deleting Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(date)],
			});
			successToast(context.toastId, t('Vip Package Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Vip Package'),
					error.message
				);
		},
	});

	const onDeleteVipPackage = async (serial: string) => {
		deleteVipPackageMutation.mutate({ serial });
	};

	const signProfileScheduleMutation = useMutation({
		mutationFn: (data: { date: Date }) =>
			signProfileSchedule(navigate, data.date),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Signing Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(date)],
			});
			successToast(context.toastId, t('Schedule Signed Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Sign Schedule'),
					error.message
				);
		},
	});

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

	const totalReservations = schedules.flatMap(
		(schedule) => schedule.reservations
	);

	const totalSessions = totalReservations
		.flatMap((reservation) => [
			reservation.service.acupuncture,
			reservation.service.feet,
			reservation.service.body,
		])
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	const totalCash = totalReservations
		.map((reservation) => reservation.cash || 0)
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
				<div className="vertical-center ms-10">
					<PermissionsButton
						btnTitle={t('Add Reservation')}
						btnType={ButtonType.ADD}
						top={false}
						right={false}
						disabled={!creatable}
						missingPermissionMessage={ERRORS.reservation.permissions.add}
						onClick={() => setOpenAddReservationModal(true)}
					/>
				</div>
				<div className="vertical-center flex text-gray-600 text-xl">
					{t('Total Cash')}:
					<span className="font-bold ms-2">{moneyToString(totalCash)}</span>
				</div>
				<div className="vertical-center flex flex-col">
					<h1 className="my-auto mx-auto text-gray-600 text-3xl">
						{t('Scheduler')}
					</h1>
					<h1 className="mx-auto text-gray-600 text-xl">{displayDate()}</h1>
				</div>
				<div className="vertical-center flex text-gray-600 text-xl">
					{t('Total Reservations')}:
					<span className="font-bold ms-2">{totalSessions}</span>
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
			<div className="absolute flex flex-row justify-between h-auto w-auto p-2 right-[5%] bottom-0 mb-10 z-[4] border border-black bg-gray-200 bg-opacity-50">
				<ZoomOverlay zoomIn={zoomIn} zoomOut={zoomOut} zoomReset={zoomReset} />
			</div>
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
		</ScheduleDateContext.Provider>
	);
};

export default Scheduler;
