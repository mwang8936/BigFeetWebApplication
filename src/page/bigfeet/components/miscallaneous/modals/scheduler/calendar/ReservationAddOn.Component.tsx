import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import WarningModal from './WarningModal.Component';

import AddBottom from '../../AddBottom.Component';

import AddDropDown from '../../../add/AddDropDown.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';
import { useServicesQuery } from '../../../../../../hooks/service.hooks';

import { getServiceDropDownItems } from '../../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';

import Employee from '../../../../../../../models/Employee.Model';
import { Permissions, Role } from '../../../../../../../models/enums';
import Reservation from '../../../../../../../models/Reservation.Model';
import Schedule from '../../../../../../../models/Schedule.Model';
import Service from '../../../../../../../models/Service.Model';
import User from '../../../../../../../models/User.Model';

import { AddReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

import {
	reservationBedConflict,
	reservationEmployeeConflict,
} from '../../../../../../../utils/reservation.utils';

interface ReservationAddOnProp {
	setOpen(open: boolean): void;
	reservation: Reservation;
	onAddReservation(request: AddReservationRequest): Promise<void>;
}

const ReservationAddOn: FC<ReservationAddOnProp> = ({
	setOpen,
	reservation,
	onAddReservation,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [serviceIdInput, setServiceIdInput] = useState<number | null>(null);

	const [noBeds, setNoBeds] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [openBedWarningModal, setOpenBedWarningModal] =
		useState<boolean>(false);
	const [openConflictWarningModal, setOpenConflictWarningModal] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_RESERVATION
	);

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);
	const serviceGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = employeeQuery.data || [];

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const serviceQuery = useServicesQuery({
		gettable: serviceGettable,
		staleTime: Infinity,
	});
	const services: Service[] = serviceQuery.data || [];

	const employee = employees.find(
		(employee) => employee.employee_id === reservation.employee_id
	);

	const serviceDropDownItems = getServiceDropDownItems(services);

	useEffect(() => {
		const missingRequiredInput = serviceIdInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [serviceIdInput]);

	useEffect(() => {
		if (serviceIdInput) {
			const service = services.find(
				(service) => service.service_id === serviceIdInput
			);

			if (service) {
				const startDate = new Date(
					reservation.reserved_date.getTime() + reservation.service.time * 60000
				);

				const reservations = schedules.flatMap(
					(schedule) => schedule.reservations
				);

				const bedsConflict = reservationBedConflict(
					startDate,
					service,
					reservations
				);

				if (bedsConflict) {
					setNoBeds(true);
					setOpenBedWarningModal(true);
				} else {
					setNoBeds(false);
				}

				const employeeId = reservation.employee_id;

				const reservationConflict = reservationEmployeeConflict(
					startDate,
					employeeId,
					service,
					reservations
				);

				if (reservationConflict) {
					setOpenConflictWarningModal(true);
				}
			} else {
				setNoBeds(false);
			}
		} else {
			setNoBeds(false);
		}
	}, [serviceIdInput]);

	const onAdd = () => {
		const reserved_date = new Date(
			reservation.reserved_date.getTime() + reservation.service.time * 60000
		);
		const employee_id = reservation.employee_id;
		const service_id = serviceIdInput as number;
		const requested_gender = reservation.requested_gender ?? undefined;
		const requested_employee = reservation.requested_employee;
		const message = reservation.message?.trim();
		const customer_id = reservation.customer?.customer_id;
		const phone_number = reservation.customer?.phone_number?.trim();
		const vip_serial = reservation.customer?.vip_serial?.trim();
		const customer_name = reservation.customer?.customer_name?.trim();
		const notes = reservation.customer?.notes?.trim();

		const addReservationRequest: AddReservationRequest = {
			reserved_date,
			employee_id,
			service_id,
			requested_gender,
			requested_employee,
			message,
			customer_id,
			phone_number,
			vip_serial,
			customer_name,
			notes,
			created_by: user.username,
		};

		onAddReservation(addReservationRequest);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<PlusCircleIcon
							className="h-6 w-6 text-green-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Reservation Add On')}
						</Dialog.Title>

						<div className="mt-2">
							{t('Add on a reservation')}

							<div className="flex flex-col text-m text-black font-bold mt-3 mb-6">
								<span>
									{t('Employee')}: {employee?.username ?? ''}
								</span>

								<span>
									{t('Time')}:{' '}
									{new Date(
										reservation.reserved_date.getTime() +
											reservation.service.time * 60000
									).toLocaleTimeString('en-US', {
										timeZone: 'America/Los_Angeles',
										hour12: true,
										hour: '2-digit',
										minute: '2-digit',
									})}
								</span>
							</div>

							<AddDropDown
								option={
									serviceDropDownItems[
										serviceDropDownItems.findIndex(
											(option) => option.id === serviceIdInput
										) || 0
									]
								}
								options={serviceDropDownItems}
								setOption={(option) => {
									setServiceIdInput(option.id as number | null);
								}}
								label={LABELS.reservation.service_id}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.reservation.service_id.required,
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || noBeds}
				addMissingPermissionMessage={
					!creatable
						? t(ERRORS.reservation.permissions.add)
						: missingRequiredInput
						? t(ERRORS.required)
						: noBeds
						? t(ERRORS.warnings.no_beds.title)
						: ''
				}
				onAdd={onAdd}
			/>

			<WarningModal
				open={openBedWarningModal}
				setOpen={setOpenBedWarningModal}
				title={t(ERRORS.warnings.no_beds.title)}
				message={t(
					ERRORS.warnings.no_beds.message.key,
					ERRORS.warnings.no_beds.message.value
				)}
			/>

			<WarningModal
				open={openConflictWarningModal}
				setOpen={setOpenConflictWarningModal}
				title={t(ERRORS.warnings.conflicts.title)}
				message={t(ERRORS.warnings.conflicts.message)}
			/>
		</>
	);
};

export default ReservationAddOn;
