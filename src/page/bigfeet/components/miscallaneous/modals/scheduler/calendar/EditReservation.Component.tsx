import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DeleteReservationModal from './DeleteReservationModal.Component';
import ReservationAddOnModal from './ReservationAddOnModal.Component';
import WarningModal from './WarningModal.Component';

import EditBottom from '../../EditBottom.Component';

import FilledPermissionsButton from '../../../FilledPermissionsButton.Component';
import { ButtonType } from '../../../PermissionsButton.Component';

import { ToggleColor } from '../../../add/AddToggleSwitch.Component';

import EditableDate from '../../../editable/EditableDate.Component';
import EditableDropDown from '../../../editable/EditableDropDown.Component';
import EditableInput from '../../../editable/EditableInput.Component';
import EditablePayRate from '../../../editable/EditablePayRate.Component';
import EditablePayRateAutomatic from '../../../editable/EditablePayRateAutomatic.Component';
import EditablePhoneNumber from '../../../editable/EditablePhoneNumber.Component';
import EditableTextArea from '../../../editable/EditableTextArea.Component';
import EditableTime from '../../../editable/EditableTime.Component';
import EditableToggleSwitch from '../../../editable/EditableToggleSwitch.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useCustomersQuery } from '../../../../../../hooks/customer.hooks';
import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useSchedulesQuery } from '../../../../../../hooks/schedule.hooks';
import { useServicesQuery } from '../../../../../../hooks/service.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';

import Customer from '../../../../../../../models/Customer.Model';
import Employee from '../../../../../../../models/Employee.Model';
import {
	Gender,
	Permissions,
	Role,
	TipMethod,
} from '../../../../../../../models/enums';
import Reservation from '../../../../../../../models/Reservation.Model';
import Schedule from '../../../../../../../models/Schedule.Model';
import Service from '../../../../../../../models/Service.Model';
import User from '../../../../../../../models/User.Model';

import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../../../../../../../models/requests/Reservation.Request.Model';

import {
	genderDropDownItems,
	getEmployeeDropDownItems,
	getServiceDropDownItems,
	tipMethodDropDownItems,
} from '../../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';
import STORES from '../../../../../../../constants/store.constants';

import { sameDate, sameTime } from '../../../../../../../utils/date.utils';
import {
	reservationBedConflict,
	reservationEmployeeConflict,
} from '../../../../../../../utils/reservation.utils';
import { formatPhoneNumber } from '../../../../../../../utils/string.utils';

interface EditReservationProp {
	setOpen(open: boolean): void;
	updatedBy: string;
	reservation: Reservation;
	reservationEmployeeId: number;
	onAddReservation(addReservationRequest: AddReservationRequest): Promise<void>;
	editable: boolean;
	onEditReservation(
		reservationId: number,
		request: UpdateReservationRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteReservation(reservationId: number): Promise<void>;
}

const EditReservation: FC<EditReservationProp> = ({
	setOpen,
	updatedBy,
	reservation,
	reservationEmployeeId,
	onAddReservation,
	editable,
	onEditReservation,
	deletable,
	onDeleteReservation,
}) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [openAddModal, setOpenAddModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState(false);
	const [openBedWarningModal, setOpenBedWarningModal] =
		useState<boolean>(false);
	const [openConflictWarningModal, setOpenConflictWarningModal] =
		useState<boolean>(false);
	const [openGenderMismatchWarningModel, setOpenGenderMismatchWarningModal] =
		useState<boolean>(false);

	const [dateInput, setDateInput] = useState<Date | null>(
		reservation.reserved_date
	);
	const [employeeIdInput, setEmployeeIdInput] = useState<number | null>(
		reservationEmployeeId
	);
	const [serviceIdInput, setServiceIdInput] = useState<number | null>(
		reservation.service.service_id
	);
	const [genderInput, setGenderInput] = useState<Gender | null>(
		reservation.requested_gender
	);
	const [requestedInput, setRequestedInput] = useState<boolean>(
		reservation.requested_employee
	);
	const [cashInput, setCashInput] = useState<number | null>(reservation.cash);
	const [machineInput, setMachineInput] = useState<number | null>(
		reservation.machine
	);
	const [vipInput, setVipInput] = useState<number | null>(reservation.vip);
	const [giftCardInput, setGiftCardInput] = useState<number | null>(
		reservation.gift_card
	);
	const [insuranceInput, setInsuranceInput] = useState<number | null>(
		reservation.insurance
	);
	const [tipMethodInput, setTipMethodInput] = useState<TipMethod | null>(
		reservation.tip_method
	);
	const [tipsInput, setTipsInput] = useState<number | null>(reservation.tips);
	const [messageInput, setMessageInput] = useState<string | null>(
		reservation.message
	);
	const [customerIdInput, setCustomerIdInput] = useState<number | null>(
		reservation.customer?.customer_id || null
	);
	const [customerPhoneNumberInput, setCustomerPhoneNumberInput] = useState<
		string | null
	>(reservation.customer?.phone_number || null);
	const [customerVipSerialInput, setCustomerVipSerialInput] = useState<
		string | null
	>(reservation.customer?.vip_serial || null);
	const [customerNameInput, setCustomerNameInput] = useState<string | null>(
		reservation.customer?.customer_name || null
	);
	const [customerNotesInput, setCustomerNotesInput] = useState<string | null>(
		reservation.customer?.notes || null
	);

	const [invalidDate, setInvalidDate] = useState<boolean>(false);
	const [invalidTime, setInvalidTime] = useState<boolean>(false);
	const [invalidCash, setInvalidCash] = useState<boolean>(false);
	const [invalidMachine, setInvalidMachine] = useState<boolean>(false);
	const [invalidVip, setInvalidVip] = useState<boolean>(false);
	const [invalidGiftCard, setInvalidGiftCard] = useState<boolean>(false);
	const [invalidInsurance, setInvalidInsurance] = useState<boolean>(false);
	const [invalidTips, setInvalidTips] = useState<boolean>(false);
	const [invalidCustomerPhoneNumber, setInvalidCustomerPhoneNumber] =
		useState<boolean>(false);
	const [invalidCustomerVipSerial, setInvalidCustomerVipSerial] =
		useState<boolean>(false);
	const [invalidCustomerName, setInvalidCustomerName] =
		useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);
	const [noBeds, setNoBeds] = useState<boolean>(false);
	const [conflict, setConflict] = useState<boolean>(false);
	const [genderMismatch, setGenderMismatch] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const reservationCreatable = user.permissions.includes(
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
	const employees: Employee[] =
		((employeeQuery.data as Employee[]) || [user]).filter(
			(employee) => employee.role !== Role.DEVELOPER
		) || [];

	const serviceQuery = useServicesQuery({
		gettable: serviceGettable,
		staleTime: Infinity,
	});
	const services: Service[] = serviceQuery.data || [];

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const employeeDropDownItems = getEmployeeDropDownItems(employees);
	const serviceDropDownItems = getServiceDropDownItems(services);

	useEffect(() => {
		const reserved_date: Date | null | undefined =
			dateInput !== null &&
			(!sameDate(dateInput, reservation.reserved_date) ||
				!sameTime(dateInput, reservation.reserved_date))
				? dateInput
				: undefined;
		const employee_id: number | null | undefined =
			employeeIdInput === reservation.employee_id ? undefined : employeeIdInput;
		const service_id: number | null | undefined =
			serviceIdInput === reservation.service.service_id
				? undefined
				: serviceIdInput;
		const requested_gender: Gender | null | undefined =
			genderInput === reservation.requested_gender ? undefined : genderInput;
		const requested_employee: boolean | undefined =
			requestedInput === reservation.requested_employee
				? undefined
				: requestedInput;
		const cash: number | null | undefined =
			cashInput === reservation.cash ? undefined : cashInput;
		const machine: number | null | undefined =
			machineInput === reservation.machine ? undefined : machineInput;
		const vip: number | null | undefined =
			vipInput === reservation.vip ? undefined : vipInput;
		const gift_card: number | null | undefined =
			giftCardInput === reservation.gift_card ? undefined : giftCardInput;
		const insurance: number | null | undefined =
			insuranceInput === reservation.insurance ? undefined : insuranceInput;
		const tip_method: TipMethod | null | undefined =
			tipMethodInput === reservation.tip_method ? undefined : tipMethodInput;
		const tips: number | null | undefined =
			tipsInput === reservation.tips ? undefined : tipsInput;
		const trimmedMessage = messageInput ? messageInput.trim() : null;
		const message: string | null | undefined =
			trimmedMessage === reservation.message ? undefined : trimmedMessage;
		const customer_id: number | null | undefined =
			customerIdInput === (reservation.customer?.customer_id || null)
				? undefined
				: customerIdInput;
		const trimmedPhoneNumber = customerPhoneNumberInput
			? customerPhoneNumberInput.trim()
			: null;
		const phone_number: string | null | undefined =
			trimmedPhoneNumber === (reservation.customer?.phone_number || null)
				? undefined
				: trimmedPhoneNumber;
		const trimmedVipSerial = customerVipSerialInput
			? customerVipSerialInput.trim()
			: null;
		const vip_serial: string | null | undefined =
			trimmedVipSerial === (reservation.customer?.vip_serial || null)
				? undefined
				: trimmedVipSerial;
		const trimmedCustomerName = customerNameInput
			? customerNameInput.trim()
			: null;
		const customer_name: string | null | undefined =
			trimmedCustomerName === (reservation.customer?.customer_name || null)
				? undefined
				: trimmedCustomerName;
		const trimmedNotes = customerNotesInput ? customerNotesInput.trim() : null;
		const notes: string | null | undefined =
			trimmedNotes === (reservation.customer?.notes || null)
				? undefined
				: trimmedNotes;

		const changesMade =
			reserved_date !== undefined ||
			employee_id !== undefined ||
			service_id !== undefined ||
			requested_gender !== undefined ||
			requested_employee !== undefined ||
			cash !== undefined ||
			machine !== undefined ||
			vip !== undefined ||
			gift_card !== undefined ||
			insurance !== undefined ||
			tip_method !== undefined ||
			tips !== undefined ||
			message !== undefined ||
			customer_id !== undefined ||
			phone_number !== undefined ||
			vip_serial !== undefined ||
			customer_name !== undefined ||
			notes !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			dateInput === null || employeeIdInput === null || serviceIdInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		dateInput,
		employeeIdInput,
		serviceIdInput,
		genderInput,
		requestedInput,
		cashInput,
		machineInput,
		vipInput,
		giftCardInput,
		insuranceInput,
		tipMethodInput,
		tipsInput,
		messageInput,
		customerIdInput,
		customerPhoneNumberInput,
		customerVipSerialInput,
		customerNameInput,
		customerNotesInput,
	]);

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
			invalidCash ||
			invalidMachine ||
			invalidVip ||
			invalidGiftCard ||
			invalidInsurance ||
			invalidTips ||
			invalidCustomer;

		setInvalidInput(invalidInput);
	}, [
		invalidDate,
		invalidTime,
		invalidCash,
		invalidMachine,
		invalidVip,
		invalidGiftCard,
		invalidInsurance,
		invalidTips,
		invalidCustomerPhoneNumber,
		invalidCustomerVipSerial,
		invalidCustomerName,
		customerPhoneNumberInput,
	]);

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

				const reservationId = reservation.reservation_id;

				const reservations = schedules.flatMap(
					(schedule) => schedule.reservations
				);

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

				if (employeeIdInput) {
					const reservationConflict = reservationEmployeeConflict(
						startDate,
						employeeIdInput,
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
				} else {
					setConflict(false);
				}
			} else {
				setNoBeds(false);
				setConflict(false);
			}
		} else {
			setNoBeds(false);
			setConflict(false);
		}
	}, [dateInput, employeeIdInput, serviceIdInput]);

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

	const onEdit = async () => {
		const reserved_date: Date | undefined =
			dateInput !== null &&
			(!sameDate(dateInput, reservation.reserved_date) ||
				!sameTime(dateInput, reservation.reserved_date))
				? (dateInput as Date)
				: undefined;
		const employee_id: number | undefined =
			employeeIdInput === reservation.employee_id
				? undefined
				: (employeeIdInput as number);
		const service_id: number | undefined =
			serviceIdInput === reservation.service.service_id
				? undefined
				: (serviceIdInput as number);
		const requested_gender: Gender | null | undefined =
			genderInput === reservation.requested_gender ? undefined : genderInput;
		const requested_employee: boolean | undefined =
			requestedInput === reservation.requested_employee
				? undefined
				: requestedInput;
		const cash: number | null | undefined =
			cashInput === reservation.cash ? undefined : cashInput;
		const machine: number | null | undefined =
			machineInput === reservation.machine ? undefined : machineInput;
		const vip: number | null | undefined =
			vipInput === reservation.vip ? undefined : vipInput;
		const gift_card: number | null | undefined =
			giftCardInput === reservation.gift_card ? undefined : giftCardInput;
		const insurance: number | null | undefined =
			insuranceInput === reservation.insurance ? undefined : insuranceInput;
		const tip_method: TipMethod | null | undefined =
			tipMethodInput === reservation.tip_method ? undefined : tipMethodInput;
		const tips: number | null | undefined =
			tipsInput === reservation.tips ? undefined : tipsInput;
		const trimmedMessage = messageInput ? messageInput.trim() : null;
		const message: string | null | undefined =
			trimmedMessage === reservation.message ? undefined : trimmedMessage;

		const trimmedPhoneNumber = customerPhoneNumberInput
			? customerPhoneNumberInput.trim()
			: null;
		const phone_number: string | null | undefined =
			trimmedPhoneNumber === (reservation.customer?.phone_number || null)
				? undefined
				: trimmedPhoneNumber;
		const trimmedVipSerial = customerVipSerialInput
			? customerVipSerialInput.trim()
			: null;
		const vip_serial: string | null | undefined =
			trimmedVipSerial === (reservation.customer?.vip_serial || null)
				? undefined
				: trimmedVipSerial;
		const trimmedCustomerName = customerNameInput
			? customerNameInput.trim()
			: null;
		const customer_name: string | null | undefined =
			trimmedCustomerName === (reservation.customer?.customer_name || null)
				? undefined
				: trimmedCustomerName;
		const trimmedNotes = customerNotesInput ? customerNotesInput.trim() : null;
		const notes: string | null | undefined =
			trimmedNotes === (reservation.customer?.notes || null)
				? undefined
				: trimmedNotes;

		const customer_id: number | null | undefined =
			customerIdInput === (reservation.customer?.customer_id || null) &&
			phone_number === undefined &&
			vip_serial === undefined &&
			customer_name === undefined &&
			notes === undefined
				? undefined
				: customerIdInput;

		const updateReservationRequest: UpdateReservationRequest = {
			...(reserved_date !== undefined && { reserved_date }),
			...(employee_id !== undefined && { employee_id }),
			...(service_id !== undefined && { service_id }),
			...(requested_gender !== undefined && { requested_gender }),
			...(requested_employee !== undefined && { requested_employee }),
			...(cash !== undefined && { cash }),
			...(machine !== undefined && { machine }),
			...(vip !== undefined && { vip }),
			...(gift_card !== undefined && { gift_card }),
			...(insurance !== undefined && { insurance }),
			...(tip_method !== undefined && { tip_method }),
			...(tips !== undefined && { tips }),
			...(message !== undefined && { message }),
			...(customer_id !== undefined && { customer_id }),
			...(phone_number !== undefined && { phone_number }),
			...(vip_serial !== undefined && { vip_serial }),
			...(customer_name !== undefined && { customer_name }),
			...(notes !== undefined && { notes }),
			updated_by: updatedBy,
		};

		onEditReservation(reservation.reservation_id, updateReservationRequest);
		setOpen(false);
	};

	const onAdd = async (addReservationRequest: AddReservationRequest) => {
		onAddReservation(addReservationRequest);
		setOpen(false);
	};

	const onDelete = async (reservationId: number) => {
		onDeleteReservation(reservationId);
		setOpen(false);
	};

	const remainingAmount = Number(
		(
			reservation.service.money -
			(cashInput ?? 0) -
			(machineInput ?? 0) -
			(vipInput ?? 0) -
			(giftCardInput ?? 0) -
			(insuranceInput ?? 0)
		).toFixed(2)
	);

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
							<FilledPermissionsButton
								btnTitle={t('Reservation Add On')}
								btnType={ButtonType.ADD}
								top={false}
								right={false}
								disabled={!reservationCreatable}
								missingPermissionMessage={ERRORS.reservation.permissions.add}
								onClick={() => {
									setOpenAddModal(true);
								}}
							/>

							<EditableDate
								originalDate={reservation.reserved_date}
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
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditableTime
								originalTime={reservation.reserved_date}
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
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditableDropDown
								originalOption={
									employeeDropDownItems[
										employeeDropDownItems.findIndex(
											(option) => option.id === reservation.employee_id
										) || 0
									]
								}
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
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditableDropDown
								originalOption={
									serviceDropDownItems[
										serviceDropDownItems.findIndex(
											(option) => option.id === reservation.service.service_id
										) || 0
									]
								}
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
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditableDropDown
								originalOption={
									genderDropDownItems[
										genderDropDownItems.findIndex(
											(option) => option.id === reservation.requested_gender
										) || 0
									]
								}
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
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditableToggleSwitch
								originalChecked={reservation.requested_employee}
								setChecked={setRequestedInput}
								checked={requestedInput}
								falseText={'Not Requested'}
								trueText={'Requested'}
								toggleColour={ToggleColor.BLUE}
								label={LABELS.reservation.requested_employee}
								name={NAMES.reservation.requested_employee}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditablePayRateAutomatic
								originalAmount={reservation.cash}
								amount={cashInput}
								remainingAmount={remainingAmount}
								roundToTheNearestDollar={true}
								setAmount={setCashInput}
								label={LABELS.reservation.cash}
								name={NAMES.reservation.cash}
								validationProp={{
									max: NUMBERS.reservation.cash,
									required: false,
									invalid: invalidCash,
									setInvalid: setInvalidCash,
									invalidMessage: ERRORS.reservation.cash.invalid,
								}}
								placeholder={PLACEHOLDERS.reservation.cash}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditablePayRateAutomatic
								originalAmount={reservation.machine}
								amount={machineInput}
								remainingAmount={remainingAmount}
								roundToTheNearestDollar={false}
								setAmount={setMachineInput}
								label={LABELS.reservation.machine}
								name={NAMES.reservation.machine}
								validationProp={{
									max: NUMBERS.reservation.machine,
									required: false,
									invalid: invalidMachine,
									setInvalid: setInvalidMachine,
									invalidMessage: ERRORS.reservation.machine.invalid,
								}}
								placeholder={PLACEHOLDERS.reservation.machine}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditablePayRateAutomatic
								originalAmount={reservation.vip}
								amount={vipInput}
								remainingAmount={remainingAmount}
								roundToTheNearestDollar={false}
								setAmount={setVipInput}
								label={LABELS.reservation.vip}
								name={NAMES.reservation.vip}
								validationProp={{
									max: NUMBERS.reservation.vip,
									required: false,
									invalid: invalidVip,
									setInvalid: setInvalidVip,
									invalidMessage: ERRORS.reservation.vip.invalid,
								}}
								placeholder={PLACEHOLDERS.reservation.vip}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditablePayRateAutomatic
								originalAmount={reservation.gift_card}
								amount={giftCardInput}
								remainingAmount={remainingAmount}
								roundToTheNearestDollar={false}
								setAmount={setGiftCardInput}
								label={LABELS.reservation.gift_card}
								name={NAMES.reservation.gift_card}
								validationProp={{
									max: NUMBERS.reservation.gift_card,
									required: false,
									invalid: invalidGiftCard,
									setInvalid: setInvalidGiftCard,
									invalidMessage: ERRORS.reservation.gift_card.invalid,
								}}
								placeholder={PLACEHOLDERS.reservation.gift_card}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							<EditablePayRateAutomatic
								originalAmount={reservation.insurance}
								amount={insuranceInput}
								remainingAmount={remainingAmount}
								roundToTheNearestDollar={false}
								setAmount={setInsuranceInput}
								label={LABELS.reservation.insurance}
								name={NAMES.reservation.insurance}
								validationProp={{
									max: NUMBERS.reservation.insurance,
									required: false,
									invalid: invalidInsurance,
									setInvalid: setInvalidInsurance,
									invalidMessage: ERRORS.reservation.insurance.invalid,
								}}
								placeholder={PLACEHOLDERS.reservation.insurance}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							{remainingAmount > 0 && (
								<p className="error-label mb-4">
									{`Total Amount Missing: \$${remainingAmount.toFixed(2)}`}
								</p>
							)}

							<EditableDropDown
								originalOption={
									tipMethodDropDownItems[
										tipMethodDropDownItems.findIndex(
											(tipMethodDropDownItem) =>
												tipMethodDropDownItem.id === reservation.tip_method
										) || 0
									]
								}
								option={
									tipMethodDropDownItems[
										tipMethodDropDownItems.findIndex(
											(tipMethodDropDownItem) =>
												tipMethodDropDownItem.id === tipMethodInput
										) || 0
									]
								}
								options={tipMethodDropDownItems}
								setOption={(option) => {
									setTipMethodInput(option.id as TipMethod | null);
									if (option.id === TipMethod.CASH || option.id === null) {
										setTipsInput(null);
									}
								}}
								label={LABELS.reservation.tip_method}
								validationProp={{
									required: false,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
							/>

							{(tipMethodInput === TipMethod.HALF ||
								tipMethodInput === TipMethod.MACHINE) && (
								<EditablePayRate
									originalAmount={reservation.tips}
									amount={tipsInput}
									setAmount={setTipsInput}
									label={LABELS.reservation.tips}
									name={NAMES.reservation.tips}
									validationProp={{
										max: NUMBERS.reservation.tips,
										required: false,
										invalid: invalidTips,
										setInvalid: setInvalidTips,
										invalidMessage: ERRORS.reservation.tips.invalid,
									}}
									placeholder={PLACEHOLDERS.reservation.tips}
									editable={editable}
									missingPermissionMessage={ERRORS.reservation.permissions.edit}
								/>
							)}

							<EditableTextArea
								originalText={reservation.message}
								text={messageInput}
								setText={setMessageInput}
								label={LABELS.reservation.message}
								name={NAMES.reservation.message}
								placeholder={PLACEHOLDERS.reservation.message}
								validationProp={{
									required: false,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.reservation.permissions.edit}
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

								<EditablePhoneNumber
									originalPhoneNumber={
										reservation.customer?.phone_number || null
									}
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
									editable={editable}
									missingPermissionMessage={ERRORS.reservation.permissions.edit}
								/>

								<EditableInput
									originalText={reservation.customer?.vip_serial || null}
									text={customerVipSerialInput}
									setText={setCustomerVipSerialInput}
									label={LABELS.customer.vip_serial}
									name={NAMES.customer.vip_serial}
									type="text"
									placeholder={PLACEHOLDERS.customer.vip_serial}
									validationProp={{
										maxLength: LENGTHS.customer.vip_serial,
										pattern: PATTERNS.customer.vip_serial,
										required: false,
										invalid: invalidCustomerVipSerial,
										setInvalid: setInvalidCustomerVipSerial,
										invalidMessage: ERRORS.customer.vip_serial.invalid,
									}}
									editable={editable}
									missingPermissionMessage={ERRORS.customer.permissions.edit}
								/>

								{((customerPhoneNumberInput?.length === 10 &&
									!invalidCustomerPhoneNumber) ||
									(customerVipSerialInput?.length === 6 &&
										!invalidCustomerVipSerial)) && (
									<>
										<EditableInput
											originalText={reservation.customer?.customer_name || null}
											text={customerNameInput}
											setText={setCustomerNameInput}
											label={LABELS.customer.customer_name}
											name={NAMES.customer.customer_name}
											type="text"
											placeholder={PLACEHOLDERS.customer.customer_name}
											validationProp={{
												maxLength: LENGTHS.customer.customer_name,
												required: false,
												invalid: invalidCustomerName,
												setInvalid: setInvalidCustomerName,
												invalidMessage: ERRORS.customer.customer_name.invalid,
											}}
											editable={editable}
											missingPermissionMessage={
												ERRORS.reservation.permissions.edit
											}
										/>

										<EditableTextArea
											originalText={reservation.customer?.notes || null}
											text={customerNotesInput}
											setText={setCustomerNotesInput}
											label={LABELS.customer.notes}
											name={NAMES.customer.notes}
											placeholder={PLACEHOLDERS.customer.notes}
											validationProp={{
												required: false,
											}}
											editable={editable}
											missingPermissionMessage={
												ERRORS.reservation.permissions.edit
											}
										/>
									</>
								)}
							</div>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={
					!editable ||
					!changesMade ||
					missingRequiredInput ||
					invalidInput ||
					conflict ||
					noBeds ||
					genderMismatch
				}
				editMissingPermissionMessage={
					!editable
						? ERRORS.reservation.permissions.edit
						: !changesMade
						? ERRORS.no_changes
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: conflict
						? ERRORS.warnings.conflicts.title
						: noBeds
						? ERRORS.warnings.no_beds.title
						: genderMismatch
						? ERRORS.warnings.gender_mismatch.title
						: ''
				}
				onEdit={onEdit}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.reservation.permissions.delete}
				onDelete={() => setOpenDeleteModal(true)}
			/>

			<ReservationAddOnModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				reservation={reservation}
				onAddReservation={onAdd}
			/>

			<DeleteReservationModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				reservationId={reservation.reservation_id}
				deletable={deletable}
				onDeleteReservation={onDelete}
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

export default EditReservation;
