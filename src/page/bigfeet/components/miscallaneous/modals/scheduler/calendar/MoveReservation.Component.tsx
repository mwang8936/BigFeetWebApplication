import { FC, useEffect, useState } from 'react';
import {
	ArrowLongRightIcon,
	PencilSquareIcon,
} from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import {
	useEmployeesContext,
	useSchedulesContext,
	useUserContext,
} from '../../../../../BigFeet.Page';
import Employee from '../../../../../../../models/Employee.Model';
import { UpdateReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';
import Reservation from '../../../../../../../models/Reservation.Model';
import { formatTimeFromDate } from '../../../../../../../utils/string.utils';
import EditBottom from '../../EditBottom.Component';
import ERRORS from '../../../../../../../constants/error.constants';
import WarningModal from './WarningModal.Component';
import { doesDateOverlap } from '../../../../../../../utils/date.utils';
import STORES from '../../../../../../../constants/store.constants';
import { useTranslation } from 'react-i18next';

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

	const [openBedWarningModal, setOpenBedWarningModal] =
		useState<boolean>(false);
	const [openConflictWarningModal, setOpenConflictWarningModal] =
		useState<boolean>(false);

	const [noBeds, setNoBeds] = useState<boolean>(false);
	const [conflict, setConflict] = useState<boolean>(false);

	const { schedules } = useSchedulesContext();

	let allEmployees: Employee[] = [];

	try {
		const { employees } = useEmployeesContext();
		allEmployees.push(...employees);
	} catch {
		const { user } = useUserContext();
		allEmployees.push(user);
	}

	const prevEmployeeUsername = allEmployees.find(
		(employee) => employee.employee_id === reservation.employee_id
	)?.username;
	const newEmployeeUsername = allEmployees.find(
		(employee) => employee.employee_id === newEmployeeId
	)?.username;

	useEffect(() => {
		const service = reservation.service;

		const startDate = newTime
			? new Date(newTime)
			: new Date(reservation.reserved_date);
		const endDate = new Date(startDate.getTime() + service.time * 60000);

		const reservationsAtSameTime = schedules
			.flatMap((schedule) => schedule.reservations)
			.filter(
				(res) =>
					res.reservation_id !== reservation.reservation_id &&
					doesDateOverlap(
						res.reserved_date,
						startDate,
						endDate,
						res.service.time
					)
			);

		const bodyReservationsAtSameTime = reservationsAtSameTime.filter(
			(reservation) => reservation.service.body > 0
		);
		if (bodyReservationsAtSameTime.length >= STORES.beds) {
			setNoBeds(true);
			setOpenBedWarningModal(true);
		} else {
			setNoBeds(false);
		}

		const employeeId =
			newEmployeeId === undefined ? reservation.employee_id : newEmployeeId;
		const conflictingReservations = reservationsAtSameTime.filter(
			(reservation) => reservation.employee_id === employeeId
		);
		if (conflictingReservations.length > 0) {
			setConflict(true);
			setOpenConflictWarningModal(true);
		} else {
			setConflict(false);
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
											<span className="me-3 font-medium">{t('Employee:')}</span>
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
										<span className="me-3 font-medium">{t('Time:')}</span>
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
				disabledEdit={!editable || noBeds || conflict}
				editMissingPermissionMessage={
					!editable
						? ERRORS.reservation.permissions.edit
						: noBeds
						? ERRORS.warnings.no_beds.title
						: conflict
						? ERRORS.warnings.conflicts.title
						: ''
				}
				onEdit={onEdit}
			/>
			<WarningModal
				open={openBedWarningModal}
				setOpen={setOpenBedWarningModal}
				title={ERRORS.warnings.no_beds.title}
				message={ERRORS.warnings.no_beds.message}
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
