import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import WarningModal from './WarningModal.Component';

import AddBottom from '../../AddBottom.Component';

import AddDropDown from '../../../add/AddDropDown.Component';
import AddMinute from '../../../add/AddMinute.Component';
import AddNumber from '../../../add/AddNumber.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useAddReservationMutation } from '../../../../../../hooks/reservation.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';
import { useServicesQuery } from '../../../../../../hooks/service.hooks';

import { getServiceDropDownItems } from '../../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';
import NAMES from '../../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import STORES from '../../../../../../../constants/store.constants';

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
import { formatTimeFromDate } from '../../../../../../../utils/string.utils';

interface ReservationAddOnProp {
	setOpen(open: boolean): void;
	reservation: Reservation;
}

const ReservationAddOn: FC<ReservationAddOnProp> = ({
	setOpen,
	reservation,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [serviceIdInput, setServiceIdInput] = useState<number | null>(null);
	const [endTimeInput, setEndTimeInput] = useState<number | null>(null);
	const [bedsRequiredInput, setBedsRequiredInput] = useState<number | null>(
		null
	);

	const [invalidEndTime, setInvalidEndTime] = useState<boolean>(false);
	const [invalidBedsRequired, setInvalidBedsRequired] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);
	const [noBeds, setNoBeds] = useState<boolean>(false);

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

	const startDate = new Date(
		reservation.reserved_date.getTime() +
			(reservation.time ?? reservation.service.time) * (1000 * 60)
	);

	useEffect(() => {
		const missingRequiredInput = serviceIdInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [serviceIdInput]);

	useEffect(() => {
		const invalidInput = invalidEndTime || invalidBedsRequired;

		setInvalidInput(invalidInput);
	}, [invalidEndTime, invalidBedsRequired]);

	useEffect(() => {
		if (serviceIdInput === null) {
			setEndTimeInput(null);
			setBedsRequiredInput(null);

			setInvalidEndTime(false);
			setInvalidBedsRequired(false);
		} else {
			const service: Service | undefined = services.find(
				(service) => service.service_id === serviceIdInput
			);

			if (service) {
				setEndTimeInput(service.time);
				setBedsRequiredInput(service.beds_required);
			}
		}
	}, [serviceIdInput]);

	useEffect(() => {
		if (endTimeInput === 0) setEndTimeInput(null);
	}, [endTimeInput]);

	useEffect(() => {
		if (serviceIdInput) {
			const service = services.find(
				(service) => service.service_id === serviceIdInput
			);

			if (service) {
				const time = endTimeInput ?? service.time;
				const bedsRequired = bedsRequiredInput ?? service.beds_required;

				const reservations = schedules.flatMap(
					(schedule) => schedule.reservations
				);

				const bedsConflict = reservationBedConflict(
					startDate,
					time,
					bedsRequired,
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
					time,
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
	}, [serviceIdInput, endTimeInput, bedsRequiredInput]);

	const addReservationMutation = useAddReservationMutation({
		onSuccess: () => setOpen(false),
	});
	const onAddReservation = async (request: AddReservationRequest) => {
		addReservationMutation.mutate({ request });
	};

	const onAdd = () => {
		const reserved_date = startDate;
		const employee_id = reservation.employee_id;
		const service_id = serviceIdInput as number;
		const time = endTimeInput ?? undefined;
		const beds_required = bedsRequiredInput ?? undefined;
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
			time,
			beds_required,
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
	};

	const service = services.find(
		(service) => service.service_id === serviceIdInput
	);

	const maxEndTime = service?.time ?? NUMBERS.service.time;

	const time = endTimeInput ?? service?.time;
	const endDate = time
		? new Date(reservation.reserved_date.getTime() + time * (1000 * 60))
		: undefined;
	const endTimeText = endDate ? formatTimeFromDate(endDate) : undefined;

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
									{startDate.toLocaleTimeString('en-US', {
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

							{serviceIdInput !== null && (
								<div className="mb-4">
									<Accordion>
										<AccordionSummary
											expandIcon={<ExpandMoreIcon />}
											aria-controls="panel1-content"
											id="panel1-header">
											{t('Service Settings')}
										</AccordionSummary>

										<AccordionDetails>
											<AddMinute
												minutes={endTimeInput}
												setMinutes={setEndTimeInput}
												label={LABELS.service.time}
												name={NAMES.service.time}
												validationProp={{
													max: maxEndTime,
													required: false,
													invalid: invalidEndTime,
													setInvalid: setInvalidEndTime,
													invalidMessage: {
														key: 'Minute Invalid',
														value: {
															max: maxEndTime,
														},
													},
												}}
											/>

											<AddNumber
												input={bedsRequiredInput}
												setInput={setBedsRequiredInput}
												label={LABELS.service.beds_required}
												name={NAMES.service.beds_required}
												validationProp={{
													max: STORES.beds,
													required: false,
													invalid: invalidBedsRequired,
													setInvalid: setInvalidBedsRequired,
													invalidMessage: ERRORS.service.beds_required.invalid,
												}}
												placeholder={PLACEHOLDERS.service.beds_required}
											/>

											<span className="font-bold text-lg text-gray-800">
												{t('End Time', { time: endTimeText })}
											</span>
										</AccordionDetails>
									</Accordion>
								</div>
							)}
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={
					!creatable || missingRequiredInput || invalidInput || noBeds
				}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.reservation.permissions.add
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: noBeds
						? ERRORS.warnings.no_beds.title
						: ''
				}
				onAdd={onAdd}
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

export default ReservationAddOn;
