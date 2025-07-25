import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import {
	ArrowLongRightIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';

import WarningModal from './WarningModal.Component';

import EditBottom from '../../EditBottom.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useUpdateReservationMutation } from '../../../../../../hooks/reservation.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';

import ERRORS from '../../../../../../../constants/error.constants';

import Employee from '../../../../../../../models/Employee.Model';
import { Permissions, Role } from '../../../../../../../models/enums';
import Reservation from '../../../../../../../models/Reservation.Model';
import Schedule from '../../../../../../../models/Schedule.Model';
import User from '../../../../../../../models/User.Model';

import { UpdateReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

import { getTimeFromHoursAndMinutes } from '../../../../../../../utils/calendar.utils';
import {
	reservationBedConflict,
	reservationEmployeeConflict,
} from '../../../../../../../utils/reservation.utils';
import { formatTimeFromDate } from '../../../../../../../utils/string.utils';

interface MoveReservationProp {
	setOpen(open: boolean): void;
	reservation: Reservation;
	newEmployeeId?: number;
	newTime?: Date;
	onCancel(): void;
}

const MoveReservation: FC<MoveReservationProp> = ({
	setOpen,
	reservation,
	newEmployeeId,
	newTime,
	onCancel,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [noBeds, setNoBeds] = useState<boolean>(false);
	const [genderMismatch, setGenderMismatch] = useState<boolean>(false);

	const [openBedWarningModal, setOpenBedWarningModal] =
		useState<boolean>(false);
	const [openConflictWarningModal, setOpenConflictWarningModal] =
		useState<boolean>(false);
	const [openGenderMismatchWarningModel, setOpenGenderMismatchWarningModal] =
		useState<boolean>(false);
	const [openScheduleWarningModal, setOpenScheduleWarningModal] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const updatedBy = user.username;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_RESERVATION
	);

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const prevEmployeeUsername = employees.find(
		(employee) => employee.employee_id === reservation.employee_id
	)?.username;
	const newEmployeeUsername = employees.find(
		(employee) => employee.employee_id === newEmployeeId
	)?.username;

	useEffect(() => {
		const startDate = newTime ?? reservation.reserved_date;

		const time = reservation.time ?? reservation.service.time;
		const bedsRequired =
			reservation.beds_required ?? reservation.service.beds_required;

		const reservationId = reservation.reservation_id;

		const reservations = schedules.flatMap((schedule) => schedule.reservations);

		const bedsConflict = reservationBedConflict(
			startDate,
			time,
			bedsRequired,
			reservations,
			reservationId
		);

		if (bedsConflict) {
			setNoBeds(true);
			setOpenBedWarningModal(true);
		} else {
			setNoBeds(false);
		}

		const employeeId =
			newEmployeeId === undefined ? reservation.employee_id : newEmployeeId;

		const reservationConflict = reservationEmployeeConflict(
			startDate,
			employeeId,
			time,
			reservations,
			reservationId
		);

		if (reservationConflict) {
			setOpenConflictWarningModal(true);
		}
	}, []);

	useEffect(() => {
		if (newEmployeeId && reservation.requested_gender) {
			const employee = employees.find(
				(employee) => employee.employee_id === newEmployeeId
			);

			if (employee) {
				const sameGender = employee.gender === reservation.requested_gender;

				if (!sameGender) {
					setGenderMismatch(true);
					setOpenGenderMismatchWarningModal(true);
				} else {
					setGenderMismatch(false);
				}
			} else {
				setGenderMismatch(false);
			}
		} else {
			setGenderMismatch(false);
		}
	}, []);

	useEffect(() => {
		const startDate = newTime ?? reservation.reserved_date;
		const time = reservation.time ?? reservation.service.time;

		const employeeId =
			newEmployeeId === undefined ? reservation.employee_id : newEmployeeId;

		const schedule = schedules.find(
			(schedule) => schedule.employee.employee_id === employeeId
		);

		if (schedule) {
			const startTime = schedule.start
				? getTimeFromHoursAndMinutes(schedule.start)
				: undefined;
			const endTime = schedule.end
				? getTimeFromHoursAndMinutes(schedule.end)
				: undefined;

			if (startTime && getTimeFromHoursAndMinutes(startDate) < startTime) {
				setOpenScheduleWarningModal(true);
			} else if (endTime) {
				if (getTimeFromHoursAndMinutes(startDate) > endTime) {
					setOpenScheduleWarningModal(true);
				}

				if (
					getTimeFromHoursAndMinutes(startDate) + time * 60 * 1000 >
					endTime
				) {
					setOpenScheduleWarningModal(true);
				}
			}
		}
	}, []);

	const updateReservationMutation = useUpdateReservationMutation({
		onSuccess: () => setOpen(false),
	});
	const onEditReservation = async (
		reservationId: number,
		request: UpdateReservationRequest,
		originalDate: Date,
		newDate?: Date
	) => {
		updateReservationMutation.mutate({
			reservationId,
			request,
			originalDate,
			newDate,
		});
	};

	const onEdit = () => {
		if (
			newTime ||
			(newEmployeeId !== undefined && newEmployeeId !== reservation.employee_id)
		) {
			const updateReservationRequest: UpdateReservationRequest = {
				reserved_date: newTime,
				employee_id: newEmployeeId,
				updated_by: updatedBy,
			};

			onEditReservation(
				reservation.reservation_id,
				updateReservationRequest,
				reservation.reserved_date,
				newTime
			);
		}
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
						<PencilSquareIcon
							className="h-6 w-6 text-blue-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Edit Reservation')}
						</Dialog.Title>

						<div className="mt-2">
							{t(
								'Would you like to make the following changes to the reservation?'
							)}
							<div className="flex flex-col text-m text-black font-bold mt-3">
								{prevEmployeeUsername &&
									newEmployeeUsername &&
									prevEmployeeUsername !== newEmployeeUsername && (
										<span className="flex flex-row">
											<span className="me-3 font-medium">{t('Employee')}:</span>

											{prevEmployeeUsername}

											<ArrowLongRightIcon
												className="h-6 w-6 mx-3 text-black"
												aria-hidden="true"
											/>

											{newEmployeeUsername}
										</span>
									)}

								{newTime && (
									<span className="flex flex-row">
										<span className="me-3 font-medium">{t('Time')}:</span>

										{formatTimeFromDate(reservation.reserved_date)}

										<ArrowLongRightIcon
											className="h-6 w-6 mx-3 text-black"
											aria-hidden="true"
										/>

										{newTime && formatTimeFromDate(newTime)}
									</span>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => {
					onCancel();
					setOpen(false);
				}}
				disabledEdit={!editable || noBeds || genderMismatch}
				editMissingPermissionMessage={
					!editable
						? ERRORS.reservation.permissions.edit
						: noBeds
						? ERRORS.warnings.no_beds.title
						: genderMismatch
						? ERRORS.warnings.gender_mismatch.title
						: ''
				}
				onEdit={onEdit}
			/>

			<WarningModal
				open={openGenderMismatchWarningModel}
				setOpen={setOpenGenderMismatchWarningModal}
				title={ERRORS.warnings.gender_mismatch.title}
				message={ERRORS.warnings.gender_mismatch.message}
			/>

			<WarningModal
				open={openBedWarningModal}
				setOpen={setOpenBedWarningModal}
				title={ERRORS.warnings.no_beds.title}
				message={t(
					ERRORS.warnings.no_beds.message.key,
					ERRORS.warnings.no_beds.message.value
				)}
			/>

			<WarningModal
				open={openConflictWarningModal}
				setOpen={setOpenConflictWarningModal}
				title={ERRORS.warnings.conflicts.title}
				message={ERRORS.warnings.conflicts.message}
			/>

			<WarningModal
				open={openScheduleWarningModal}
				setOpen={setOpenScheduleWarningModal}
				title={ERRORS.warnings.schedule.title}
				message={ERRORS.warnings.schedule.message}
			/>
		</>
	);
};

export default MoveReservation;
