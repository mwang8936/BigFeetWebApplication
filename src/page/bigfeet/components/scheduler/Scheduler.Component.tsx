import { useState, createContext, useContext } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import Calendar from './Calendar/Calendar.Component';
import { useSchedulesContext, useUserContext } from '../../BigFeet.Page';
import { Permissions } from '../../../../models/enums';
import Schedule from '../../../../models/Schedule.Model';
import {
	getBeginningOfMonth,
	getBeginningOfNextMonth,
	sameDate,
} from '../../../../utils/date.utils';
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
	getSchedules,
	updateSchedule,
} from '../../../../service/schedule.service';
import { signProfileSchedule } from '../../../../service/profile.service';
import { GetSchedulesParam } from '../../../../models/params/Schedule.Param';
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
	createToast,
	errorToast,
	updateToast,
} from '../../../../utils/toast.utils';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { getCustomers } from '../../../../service/customer.service';
import { getServices } from '../../../../service/service.service';
import { getEmployees } from '../../../../service/employee.service';

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

export default function Scheduler() {
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

	const { user } = useUserContext();

	const customerGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_CUSTOMER
	);
	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const serviceGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);

	useQuery({
		queryKey: ['customers'],
		queryFn: () => getCustomers(navigate),
		enabled: customerGettable,
		refetchInterval: 1000 * 60 * 5,
	});
	const employeeQuery = useQuery({
		queryKey: ['employees'],
		queryFn: () => getEmployees(navigate),
		enabled: employeeGettable,
		refetchInterval: 1000 * 60 * 5,
	});
	useQuery({
		queryKey: ['services'],
		queryFn: () => getServices(navigate),
		enabled: serviceGettable,
		refetchInterval: 1000 * 60 * 5,
	});

	const { schedules, setSchedules } = useSchedulesContext();

	let employeeList: Employee[] = [];

	try {
		const employees: Employee[] = employeeQuery.data;
		employeeList.push(...employees);
	} catch {
		employeeList.push(user);
	}
	sortEmployees(employeeList, schedules, date);

	const creatable = [
		Permissions.PERMISSION_ADD_RESERVATION,
		Permissions.PERMISSION_ADD_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const onAddReservation = async (request: AddReservationRequest) => {
		const toastId = createToast(t('Adding Reservation...'));
		addReservation(navigate, request)
			.then((response: Schedule) => {
				const updatedSchedules = [...schedules];
				const scheduleIndex = updatedSchedules.findIndex(
					(schedule) =>
						schedule.date.getTime() === response.date.getTime() &&
						schedule.employee.employee_id === response.employee.employee_id
				);
				if (scheduleIndex === -1) {
					updatedSchedules.push(response);
				} else {
					updatedSchedules[scheduleIndex] = response;
				}
				setSchedules(updatedSchedules);
				queryClient.invalidateQueries({ queryKey: ['customers'] });
				updateToast(toastId, t('Reservation Added Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Add Reservation'), error.message)
			);
	};

	const onAddSchedule = async (request: AddScheduleRequest) => {
		const toastId = createToast(t('Adding Schedule...'));
		addSchedule(navigate, request)
			.then((response) => {
				const updatedSchedules = [...schedules];
				updatedSchedules.push(response);
				setSchedules(updatedSchedules);
				updateToast(toastId, t('Schedule Added Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Add Schedule'), error.message)
			);
	};

	const onAddVipPackage = async (request: AddVipPackageRequest) => {
		const toastId = createToast(t('Adding Vip Package...'));
		addVipPackage(navigate, request)
			.then((response: Schedule[]) => {
				const updatedSchedules = [...schedules];
				response.forEach((respSchedule) => {
					const scheduleIndex = updatedSchedules.findIndex(
						(schedule) =>
							schedule.date.getTime() === respSchedule.date.getTime() &&
							schedule.employee.employee_id ===
								respSchedule.employee.employee_id
					);
					if (scheduleIndex === -1) {
						updatedSchedules.push(respSchedule);
					} else {
						updatedSchedules[scheduleIndex] = respSchedule;
					}
				});
				setSchedules(updatedSchedules);
				updateToast(toastId, t('Vip Package Added Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Add Vip Package'), error.message)
			);
	};

	const editable = [
		Permissions.PERMISSION_UPDATE_RESERVATION,
		Permissions.PERMISSION_UPDATE_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const onEditReservation = async (
		reservationId: number,
		request: UpdateReservationRequest
	) => {
		const toastId = createToast(t('Updating Reservation...'));
		updateReservation(navigate, reservationId, request)
			.then((response: Schedule) => {
				const updatedSchedules = [...schedules];
				const oldScheduleIndex = updatedSchedules.findIndex((schedule) =>
					schedule.reservations.find(
						(reservation) => reservation.reservation_id === reservationId
					)
				);
				if (oldScheduleIndex > -1) {
					const oldSchedule = schedules[oldScheduleIndex];
					if (
						sameDate(response.date, oldSchedule.date) &&
						response.employee.employee_id === oldSchedule.employee.employee_id
					) {
						updatedSchedules[oldScheduleIndex] = response;
					} else {
						oldSchedule.reservations = oldSchedule.reservations.filter(
							(reservation) => reservation.reservation_id !== reservationId
						);
						const newScheduleIndex = updatedSchedules.findIndex(
							(schedule) =>
								sameDate(response.date, schedule.date) &&
								response.employee.employee_id == schedule.employee.employee_id
						);
						if (newScheduleIndex > -1) {
							updatedSchedules[newScheduleIndex] = response;
						} else {
							updatedSchedules.push(response);
						}
					}
				}
				setSchedules(updatedSchedules);
				queryClient.invalidateQueries({ queryKey: ['customers'] });
				updateToast(toastId, t('Reservation Updated Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Update Reservation'), error.message)
			);
	};

	const onEditSchedule = async (
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	) => {
		const toastId = createToast(t('Updating Schedule...'));
		updateSchedule(navigate, date, employeeId, request)
			.then(() => {
				const oldSchedule = schedules.find(
					(schedule) =>
						sameDate(date, schedule.date) &&
						employeeId === schedule.employee.employee_id
				);
				if (oldSchedule) {
					const updatedSchedule: Schedule = {
						...oldSchedule,
						...request,
					};
					setSchedules(
						schedules.map((schedule) =>
							sameDate(date, schedule.date) &&
							employeeId === schedule.employee.employee_id
								? updatedSchedule
								: schedule
						)
					);
				}
				updateToast(toastId, t('Schedule Updated Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Update Schedule'), error.message)
			);
	};

	const onEditVipPackage = async (
		serial: string,
		updateVipPackageRequest: UpdateVipPackageRequest
	) => {
		const toastId = createToast(t('Updating Vip Package...'));
		updateVipPackage(navigate, serial, updateVipPackageRequest)
			.then((response: Schedule[]) => {
				const updatedSchedules = [...schedules];
				updatedSchedules.forEach((schedule) => {
					schedule.vip_packages = schedule.vip_packages.filter(
						(vipPackage) => vipPackage.serial !== serial
					);
				});
				console.log(updatedSchedules);
				console.log(response);
				const test = updatedSchedules.map((schedule) => {
					const updatedSchedule = response.find(
						(respSchedule) =>
							sameDate(respSchedule.date, schedule.date) &&
							respSchedule.employee.employee_id ===
								schedule.employee.employee_id
					);

					return updatedSchedule ? updatedSchedule : schedule;
				});
				console.log(test);

				setSchedules(test);
				updateToast(toastId, t('Vip Package Updated Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Update Vip Package'), error.message)
			);
	};

	const deletable = [
		Permissions.PERMISSION_DELETE_RESERVATION,
		Permissions.PERMISSION_DELETE_SCHEDULE,
	].every((permission) => user.permissions.includes(permission));

	const onDeleteReservation = async (reservationId: number) => {
		const toastId = createToast(t('Deleting Reservation...'));
		deleteReservation(navigate, reservationId)
			.then(() => {
				const updatedSchedules = [...schedules];
				updatedSchedules.forEach(
					(schedule) =>
						(schedule.reservations = schedule.reservations.filter(
							(reservation) => reservation.reservation_id !== reservationId
						))
				);
				setSchedules(updatedSchedules);
				updateToast(toastId, t('Reservation Deleted Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Delete Reservation'), error.message)
			);
	};

	const onDeleteVipPackage = async (serial: string) => {
		const toastId = createToast(t('Deleting Vip Package...'));
		deleteVipPackage(navigate, serial)
			.then(() => {
				const updatedSchedules = [...schedules];
				updatedSchedules.forEach((schedule) => {
					schedule.vip_packages = schedule.vip_packages.filter(
						(vipPackage) => vipPackage.serial !== serial
					);
				});
				setSchedules(updatedSchedules);
				updateToast(toastId, t('Vip Package Deleted Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Delete Vip Package'), error.message)
			);
	};

	const onScheduleSigned = async (date: Date) => {
		const toastId = createToast(t('Signing Schedule...'));
		signProfileSchedule(navigate, date)
			.then(() => {
				const updatedSchedules = [...schedules];
				const updatedScheduleIndex = updatedSchedules.findIndex(
					(schedule) =>
						sameDate(date, schedule.date) &&
						schedule.employee.employee_id === user.employee_id
				);
				if (updatedScheduleIndex > -1) {
					const updatedSchedule = updatedSchedules[updatedScheduleIndex];
					updatedSchedule.signed = true;
					updatedSchedules[updatedScheduleIndex] = updatedSchedule;
					setSchedules(updatedSchedules);
				}
				updateToast(toastId, t('Schedule Signed Successfully'));
			})
			.catch((error) =>
				errorToast(toastId, t('Failed to Sign Schedule'), error.message)
			);
	};

	const getPermission = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const onGetSchedules = async (params: GetSchedulesParam) => {
		const toastId = createToast(t('Getting Schedules...'));
		getSchedules(navigate, params)
			.then((response) => {
				setSchedules(response);
				updateToast(toastId, t('Schedule Retrieved Successfully'));
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Get Schedules'), error.message);
			});
	};

	const displayDate = () => {
		return sameDate(new Date(), date)
			? `${t('Today')} - ${date.toDateString()}`
			: date.toDateString();
	};

	const totalReservations = schedules
		.filter((schedule) => sameDate(date, schedule.date))
		.flatMap((schedule) => schedule.reservations);
	const totalCash = totalReservations
		.map((reservation) => reservation.cash || 0)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);

	const onDateFiltered = (selectedDate: Date) => {
		const oldDateBeginningOfMonth = getBeginningOfMonth(date);
		const newDateBeginningOfMonth = getBeginningOfMonth(selectedDate);

		if (
			getPermission &&
			!sameDate(oldDateBeginningOfMonth, newDateBeginningOfMonth)
		) {
			const getSchedulesParam: GetSchedulesParam = {
				start: newDateBeginningOfMonth,
				end: getBeginningOfNextMonth(selectedDate),
			};
			onGetSchedules(getSchedulesParam);
		}

		const currentDate = new Date();
		setFiltered(
			selectedDate.getFullYear != currentDate.getFullYear ||
				selectedDate.getMonth() != currentDate.getMonth() ||
				selectedDate.getDate() != currentDate.getDate()
		);
		setDate(selectedDate);
	};

	return (
		<ScheduleDateContext.Provider value={{ date, setDate }}>
			<div className="h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
				<div className="h-fit my-auto flex ms-10">
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
				<div className="h-fit my-auto flex text-gray-600 text-xl">
					{t('Total Cash')}:<span className="font-bold ms-2">{totalCash}</span>
				</div>
				<div className="h-fit my-auto flex flex-col">
					<h1 className="my-auto mx-auto text-gray-600 text-3xl">
						{t('Scheduler')}
					</h1>
					<h1 className="mx-auto text-gray-600 text-xl">{displayDate()}</h1>
				</div>
				<div className="h-fit my-auto flex text-gray-600 text-xl">
					{t('Total Reservations')}:
					<span className="font-bold ms-2">{totalReservations.length}</span>
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
}
