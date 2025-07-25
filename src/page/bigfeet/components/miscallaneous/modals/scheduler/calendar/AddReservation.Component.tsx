import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';

import WarningModal from './WarningModal.Component';

import AddBottom from '../../AddBottom.Component';

import AddDate from '../../../add/AddDate.Component';
import AddDropDown from '../../../add/AddDropDown.Component';
import AddInput from '../../../add/AddInput.Component';
import AddMinute from '../../../add/AddMinute.Component';
import AddNumber from '../../../add/AddNumber.Component';
import AddPhoneNumber from '../../../add/AddPhoneNumber.Component';
import AddTextArea from '../../../add/AddTextArea.Component';
import AddTime from '../../../add/AddTime.Component';
import AddToggleSwitch, {
	ToggleColor,
} from '../../../add/AddToggleSwitch.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useCustomersQuery } from '../../../../../../hooks/customer.hooks';
import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useAddReservationMutation } from '../../../../../../hooks/reservation.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';
import { useServicesQuery } from '../../../../../../hooks/service.hooks';

import {
	genderDropDownItems,
	getEmployeeDropDownItems,
	getServiceDropDownItems,
} from '../../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';
import STORES from '../../../../../../../constants/store.constants';

import Customer from '../../../../../../../models/Customer.Model';
import Employee from '../../../../../../../models/Employee.Model';
import { Gender, Permissions, Role } from '../../../../../../../models/enums';
import Schedule from '../../../../../../../models/Schedule.Model';
import Service from '../../../../../../../models/Service.Model';
import User from '../../../../../../../models/User.Model';

import { AddReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';

import { getTimeFromHoursAndMinutes } from '../../../../../../../utils/calendar.utils';
import {
	reservationBedConflict,
	reservationEmployeeConflict,
} from '../../../../../../../utils/reservation.utils';
import {
	formatPhoneNumber,
	formatTimeFromDate,
} from '../../../../../../../utils/string.utils';

interface AddReservationProp {
	setOpen(open: boolean): void;
	defaultDate?: Date;
	defaultEmployeeId?: number;
}

const AddReservation: FC<AddReservationProp> = ({
	setOpen,
	defaultDate,
	defaultEmployeeId,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [dateInput, setDateInput] = useState<Date | null>(defaultDate || date);
	const [employeeIdInput, setEmployeeIdInput] = useState<number | null>(
		defaultEmployeeId || null
	);
	const [serviceIdInput, setServiceIdInput] = useState<number | null>(null);
	const [endTimeInput, setEndTimeInput] = useState<number | null>(null);
	const [bedsRequiredInput, setBedsRequiredInput] = useState<number | null>(
		null
	);
	const [genderInput, setGenderInput] = useState<Gender | null>(null);
	const [requestedInput, setRequestedInput] = useState<boolean>(false);
	const [messageInput, setMessageInput] = useState<string | null>(null);
	const [customerIdInput, setCustomerIdInput] = useState<number | null>(null);
	const [customerPhoneNumberInput, setCustomerPhoneNumberInput] = useState<
		string | null
	>(null);
	const [customerVipSerialInput, setCustomerVipSerialInput] = useState<
		string | null
	>(null);
	const [customerNameInput, setCustomerNameInput] = useState<string | null>(
		null
	);
	const [customerNotesInput, setCustomerNotesInput] = useState<string | null>(
		null
	);

	const [invalidDate, setInvalidDate] = useState<boolean>(false);
	const [invalidTime, setInvalidTime] = useState<boolean>(false);
	const [invalidEndTime, setInvalidEndTime] = useState<boolean>(false);
	const [invalidBedsRequired, setInvalidBedsRequired] =
		useState<boolean>(false);
	const [invalidCustomerPhoneNumber, setInvalidCustomerPhoneNumber] =
		useState<boolean>(false);
	const [invalidCustomerVipSerial, setInvalidCustomerVipSerial] =
		useState<boolean>(false);
	const [invalidCustomerName, setInvalidCustomerName] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);
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

	const createdBy = user.username;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_RESERVATION
	);

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

	const customerQuery = useCustomersQuery({
		gettable: customerGettable,
		staleTime: Infinity,
	});
	const customers: Customer[] = customerQuery.data || [];

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const serviceQuery = useServicesQuery({
		gettable: serviceGettable,
		staleTime: Infinity,
	});
	const services: Service[] = serviceQuery.data || [];

	const scheduleQuery = useSchedulesQuery({
		date: dateInput || date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const employeeDropDownItems = getEmployeeDropDownItems(employees);
	const serviceDropDownItems = getServiceDropDownItems(services);

	useEffect(() => {
		const missingRequiredInput =
			dateInput === null || employeeIdInput === null || serviceIdInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [dateInput, employeeIdInput, serviceIdInput]);

	useEffect(() => {
		const invalidCustomer =
			customerPhoneNumberInput !== null || customerVipSerialInput !== null
				? invalidCustomerPhoneNumber ||
				  invalidCustomerVipSerial ||
				  invalidCustomerName
				: false;

		const invalidInput =
			invalidDate ||
			invalidTime ||
			invalidEndTime ||
			invalidBedsRequired ||
			invalidCustomer;

		setInvalidInput(invalidInput);
	}, [
		invalidDate,
		invalidTime,
		invalidEndTime,
		invalidBedsRequired,
		invalidCustomerPhoneNumber,
		invalidCustomerVipSerial,
		invalidCustomerName,
		customerPhoneNumberInput,
	]);

	useEffect(() => {
		if (
			serviceIdInput === null ||
			dateInput === null ||
			invalidDate ||
			invalidTime
		) {
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
	}, [serviceIdInput, dateInput, invalidDate, invalidTime]);

	useEffect(() => {
		if (endTimeInput === 0) setEndTimeInput(null);
	}, [endTimeInput]);

	useEffect(() => {
		if (
			customerPhoneNumberInput?.length === LENGTHS.customer.phone_number - 4 &&
			customerIdInput === null
		) {
			const customer = customers.find(
				(customer) => customer.phone_number === customerPhoneNumberInput
			);
			if (customer) {
				setCustomerIdInput(customer.customer_id);

				setCustomerVipSerialInput(customer.vip_serial);
				setCustomerNameInput(customer.customer_name);
				setCustomerNotesInput(customer.notes);

				setInvalidCustomerVipSerial(false);
				setInvalidCustomerName(false);
			}
		} else if (
			customerVipSerialInput?.length === LENGTHS.customer.vip_serial &&
			customerIdInput === null
		) {
			const customer = customers.find(
				(customer) => customer.vip_serial === customerVipSerialInput
			);
			if (customer) {
				setCustomerIdInput(customer.customer_id);

				setCustomerPhoneNumberInput(customer.phone_number);
				setCustomerNameInput(customer.customer_name);
				setCustomerNotesInput(customer.notes);

				setInvalidCustomerPhoneNumber(false);
				setInvalidCustomerName(false);
			}
		} else if (
			customerIdInput !== null &&
			customerPhoneNumberInput?.length !== LENGTHS.customer.phone_number - 4 &&
			customerVipSerialInput?.length !== LENGTHS.customer.vip_serial
		) {
			setCustomerIdInput(null);

			setCustomerNameInput(null);
			setCustomerNotesInput(null);

			setInvalidCustomerName(false);
		}
	}, [customerPhoneNumberInput, customerVipSerialInput]);

	useEffect(() => {
		if (dateInput && serviceIdInput) {
			const service = services.find(
				(service) => service.service_id === serviceIdInput
			);
			if (service) {
				const startDate = new Date(dateInput);

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

				if (employeeIdInput) {
					const reservationConflict = reservationEmployeeConflict(
						startDate,
						employeeIdInput,
						time,
						reservations
					);

					if (reservationConflict) {
						setOpenConflictWarningModal(true);
					}
				}
			} else {
				setNoBeds(false);
			}
		} else {
			setNoBeds(false);
		}
	}, [
		dateInput,
		employeeIdInput,
		serviceIdInput,
		endTimeInput,
		bedsRequiredInput,
	]);

	useEffect(() => {
		if (employeeIdInput && genderInput) {
			const employee = employees.find(
				(employee) => employee.employee_id === employeeIdInput
			);

			if (employee) {
				const sameGender = employee.gender === genderInput;

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
	}, [employeeIdInput, genderInput]);

	useEffect(() => {
		if (dateInput && employeeIdInput) {
			const schedule = schedules.find(
				(schedule) => schedule.employee.employee_id === employeeIdInput
			);

			if (schedule) {
				const startTime = schedule.start
					? getTimeFromHoursAndMinutes(schedule.start)
					: undefined;
				const endTime = schedule.end
					? getTimeFromHoursAndMinutes(schedule.end)
					: undefined;

				if (startTime && getTimeFromHoursAndMinutes(dateInput) < startTime) {
					setOpenScheduleWarningModal(true);
				} else if (endTime) {
					if (getTimeFromHoursAndMinutes(dateInput) > endTime) {
						setOpenScheduleWarningModal(true);
					}

					const service = services.find(
						(service) => service.service_id === serviceIdInput
					);

					if (service) {
						const time = endTimeInput ?? service.time;

						if (
							getTimeFromHoursAndMinutes(dateInput) + time * 60 * 1000 >
							endTime
						) {
							setOpenScheduleWarningModal(true);
						}
					}
				}
			}
		}
	}, [dateInput, employeeIdInput, serviceIdInput, endTimeInput]);

	const addReservationMutation = useAddReservationMutation({
		onSuccess: () => setOpen(false),
	});
	const onAddReservation = async (request: AddReservationRequest) => {
		addReservationMutation.mutate({ request });
	};

	const onAdd = () => {
		const reserved_date = dateInput as Date;
		const employee_id = employeeIdInput as number;
		const service_id = serviceIdInput as number;
		const time = endTimeInput ?? undefined;
		const beds_required = bedsRequiredInput ?? undefined;
		const requested_gender = genderInput ?? undefined;
		const requested_employee = requestedInput;
		const message = messageInput?.trim();
		const customer_id = customerIdInput ?? undefined;
		const phone_number = customerPhoneNumberInput?.trim();
		const vip_serial = customerVipSerialInput?.trim();
		const customer_name = customerNameInput?.trim();
		const notes = customerNotesInput?.trim();

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
			created_by: createdBy,
		};

		onAddReservation(addReservationRequest);
	};

	const service = services.find(
		(service) => service.service_id === serviceIdInput
	);

	const maxEndTime = service?.time ?? NUMBERS.service.time;

	const time = endTimeInput ?? service?.time;
	const endDate =
		dateInput && time
			? new Date(dateInput.getTime() + time * (1000 * 60))
			: undefined;
	const endTimeText = endDate ? formatTimeFromDate(endDate) : undefined;

	const currentCustomer: Customer | undefined =
		customerIdInput !== null
			? customers.find((customer) => customer.customer_id === customerIdInput)
			: undefined;

	const currentPhoneNumberText =
		currentCustomer?.phone_number &&
		t('Phone Number') + ': ' + formatPhoneNumber(currentCustomer.phone_number);

	const currentVipSerialText =
		currentCustomer?.vip_serial &&
		t('VIP Serial') + ': ' + currentCustomer.vip_serial;

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
							{t('Add Reservation')}
						</Dialog.Title>

						<div className="mt-2">
							<AddDate
								date={dateInput}
								setDate={setDateInput}
								label={LABELS.reservation.date}
								validationProp={{
									minDate: undefined,
									maxDate: undefined,
									required: true,
									requiredMessage: ERRORS.reservation.date.required,
									invalid: invalidDate,
									setInvalid: setInvalidDate,
									invalidMessage: ERRORS.reservation.date.invalid,
								}}
							/>

							<AddTime
								time={dateInput}
								setTime={setDateInput}
								label={LABELS.reservation.time}
								validationProp={{
									min: STORES.start,
									max: STORES.end,
									required: true,
									requiredMessage: ERRORS.reservation.time.required,
									invalid: invalidTime,
									setInvalid: setInvalidTime,
									invalidMessage: ERRORS.reservation.time.invalid,
								}}
							/>

							<AddDropDown
								option={
									employeeDropDownItems[
										employeeDropDownItems.findIndex(
											(option) => option.id === employeeIdInput
										) || 0
									]
								}
								options={employeeDropDownItems}
								setOption={(option) => {
									setEmployeeIdInput(option.id as number | null);
								}}
								label={LABELS.reservation.employee_id}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.reservation.employee_id.required,
								}}
							/>

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

							{dateInput !== null &&
								serviceIdInput !== null &&
								!invalidDate &&
								!invalidTime && (
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
														invalidMessage:
															ERRORS.service.beds_required.invalid,
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

							<AddDropDown
								option={
									genderDropDownItems[
										genderDropDownItems.findIndex(
											(option) => option.id === genderInput
										) || 0
									]
								}
								options={genderDropDownItems}
								setOption={(option) => {
									setGenderInput(option.id as Gender | null);
								}}
								label={LABELS.reservation.requested_gender}
								validationProp={{
									required: false,
								}}
							/>

							<AddToggleSwitch
								setChecked={setRequestedInput}
								checked={requestedInput}
								falseText={'Not Requested'}
								trueText={'Requested'}
								toggleColour={ToggleColor.GREEN}
								label={LABELS.reservation.requested_employee}
								name={NAMES.reservation.requested_employee}
								disabled={false}
							/>

							<AddTextArea
								text={messageInput}
								setText={setMessageInput}
								label={LABELS.reservation.message}
								name={NAMES.reservation.message}
								validationProp={{
									required: false,
								}}
								placeholder={PLACEHOLDERS.reservation.message}
							/>

							<div className="customer-optional-div">
								<span className="customer-optional-title">
									{t('Customer (Optional)')}:
									{customerIdInput !== null && (
										<span className="current-customer-span">
											<span>{t('Current Customer')}:</span>

											<span>{currentPhoneNumberText}</span>

											<span>{currentVipSerialText}</span>
										</span>
									)}
								</span>

								<AddPhoneNumber
									phoneNumber={customerPhoneNumberInput}
									setPhoneNumber={setCustomerPhoneNumberInput}
									label={LABELS.customer.phone_number}
									name={NAMES.customer.phone_number}
									validationProp={{
										required: false,
										invalid: invalidCustomerPhoneNumber,
										setInvalid: setInvalidCustomerPhoneNumber,
										invalidMessage: ERRORS.customer.phone_number.invalid,
									}}
								/>

								<AddInput
									text={customerVipSerialInput}
									setText={setCustomerVipSerialInput}
									label={LABELS.customer.vip_serial}
									name={NAMES.customer.vip_serial}
									type="text"
									validationProp={{
										maxLength: LENGTHS.customer.vip_serial,
										pattern: PATTERNS.customer.vip_serial,
										required: false,
										invalid: invalidCustomerVipSerial,
										setInvalid: setInvalidCustomerVipSerial,
										invalidMessage: ERRORS.customer.vip_serial.invalid,
									}}
									placeholder={PLACEHOLDERS.customer.vip_serial}
								/>

								{((customerPhoneNumberInput?.length === 10 &&
									!invalidCustomerPhoneNumber) ||
									(customerVipSerialInput?.length === 6 &&
										!invalidCustomerVipSerial)) && (
									<>
										<AddInput
											text={customerNameInput}
											setText={setCustomerNameInput}
											label={LABELS.customer.customer_name}
											name={NAMES.customer.customer_name}
											type="text"
											validationProp={{
												maxLength: LENGTHS.customer.customer_name,
												required: false,
												invalid: invalidCustomerName,
												setInvalid: setInvalidCustomerName,
												invalidMessage: ERRORS.customer.customer_name.invalid,
											}}
											placeholder={PLACEHOLDERS.customer.customer_name}
										/>

										<AddTextArea
											text={customerNotesInput}
											setText={setCustomerNotesInput}
											label={LABELS.customer.notes}
											name={NAMES.customer.notes}
											validationProp={{
												required: false,
											}}
											placeholder={PLACEHOLDERS.customer.notes}
										/>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={
					!creatable ||
					missingRequiredInput ||
					invalidInput ||
					noBeds ||
					genderMismatch
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
						: genderMismatch
						? ERRORS.warnings.gender_mismatch.title
						: ''
				}
				onAdd={onAdd}
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

export default AddReservation;
