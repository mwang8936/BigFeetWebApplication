import { FC, useEffect, useState } from 'react';
import {
	ArrowLongRightIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { useUserContext } from '../../../../../BigFeet.Page';
import Employee from '../../../../../../../models/Employee.Model';
import { UpdateReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';
import Reservation from '../../../../../../../models/Reservation.Model';
import {
	formatDateToQueryKey,
	formatTimeFromDate,
} from '../../../../../../../utils/string.utils';
import EditBottom from '../../EditBottom.Component';
import ERRORS from '../../../../../../../constants/error.constants';
import WarningModal from './WarningModal.Component';
import { doesDateOverlap } from '../../../../../../../utils/date.utils';
import STORES from '../../../../../../../constants/store.constants';
import { useTranslation } from 'react-i18next';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../../../../../../../service/employee.service';
import { Permissions, Role } from '../../../../../../../models/enums';
import { useNavigate } from 'react-router-dom';
import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';
import { getSchedules } from '../../../../../../../service/schedule.service';
import { getProfileSchedules } from '../../../../../../../service/profile.service';
import Schedule from '../../../../../../../models/Schedule.Model';
import {
	reservationBedConflict,
	reservationEmployeeConflict,
} from '../../../../../../../utils/reservation.utils';

interface MoveReservationProp {
	setOpen(open: boolean): void;
	updatedBy: string;
	reservation: Reservation;
	newEmployeeId?: number;
	newTime?: Date;
	editable: boolean;
	onEditReservation(
		reservationId: number,
		request: UpdateReservationRequest
	): Promise<void>;
	onCancel(): void;
}

const MoveReservation: FC<MoveReservationProp> = ({
	setOpen,
	updatedBy,
	reservation,
	newEmployeeId,
	newTime,
	editable,
	onEditReservation,
	onCancel,
}) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [openBedWarningModal, setOpenBedWarningModal] =
		useState<boolean>(false);
	const [openConflictWarningModal, setOpenConflictWarningModal] =
		useState<boolean>(false);
	const [openGenderMismatchWarningModel, setOpenGenderMismatchWarningModal] =
		useState<boolean>(false);

	const [noBeds, setNoBeds] = useState<boolean>(false);
	const [conflict, setConflict] = useState<boolean>(false);
	const [genderMismatch, setGenderMismatch] = useState<boolean>(false);

	const { user } = useUserContext();
	const { date } = useScheduleDateContext();

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const employeeQuery = useQuery({
		queryKey: ['employees'],
		queryFn: () => getEmployees(navigate),
		enabled: employeeGettable,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || []
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const scheduleQuery = useQuery({
		queryKey: ['schedules', formatDateToQueryKey(date)],
		queryFn: () => {
			if (scheduleGettable) {
				return getSchedules(navigate, {
					start: date,
					end: date,
				});
			} else {
				return getProfileSchedules(navigate);
			}
		},
		enabled: scheduleGettable,
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
		const startDate = newTime
			? new Date(newTime)
			: new Date(reservation.reserved_date);

		const service = reservation.service;

		const reservationId = reservation.reservation_id;

		const reservations = schedules.flatMap((schedule) => schedule.reservations);

		const bedsConflict = reservationBedConflict(
			startDate,
			service,
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
			service,
			reservations,
			reservationId
		);

		if (reservationConflict) {
			setConflict(true);
			setOpenConflictWarningModal(true);
		} else {
			setConflict(false);
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
			onEditReservation(reservation.reservation_id, updateReservationRequest);
			setOpen(false);
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
				disabledEdit={!editable || conflict || noBeds || genderMismatch}
				editMissingPermissionMessage={
					!editable
						? ERRORS.reservation.permissions.edit
						: conflict
						? ERRORS.warnings.conflicts.title
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
		</>
	);
};

export default MoveReservation;
