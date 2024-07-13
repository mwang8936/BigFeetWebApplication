import { FC, useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { Gender } from '../../../../../../../models/enums';
import {
	useCustomersContext,
	useEmployeesContext,
	useSchedulesContext,
	useServicesContext,
	useUserContext,
} from '../../../../../BigFeet.Page';
import Employee from '../../../../../../../models/Employee.Model';
import Service from '../../../../../../../models/Service.Model';
import {
	genderDropDownItems,
	getEmployeeDropDownItems,
	getServiceDropDownItems,
} from '../../../../../../../constants/drop-down.constants';
import AddToggleSwitch, {
	ToggleColor,
} from '../../../add/AddToggleSwitch.Component';
import AddTime from '../../../add/AddTime.Component';
import AddDate from '../../../add/AddDate.Component';
import { AddReservationRequest } from '../../../../../../../models/requests/Reservation.Request.Model';
import AddTextArea from '../../../add/AddTextArea.Component';
import AddInput from '../../../add/AddInput.Component';
import AddPhoneNumber from '../../../add/AddPhoneNumber.Component';
import Customer from '../../../../../../../models/Customer.Model';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import AddDropDown from '../../../add/AddDropDown.Component';
import NAMES from '../../../../../../../constants/name.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';
import STORES from '../../../../../../../constants/store.constants';
import AddBottom from '../../AddBottom.Component';
import { doesDateOverlap } from '../../../../../../../utils/date.utils';
import WarningModal from './WarningModal.Component';
import { useTranslation } from 'react-i18next';

interface AddReservationProp {
	setOpen(open: boolean): void;
	createdBy: string;
	defaultDate?: Date;
	defaultEmployeeId?: number;
	creatable: boolean;
	onAddReservation(request: AddReservationRequest): Promise<void>;
}

const AddReservation: FC<AddReservationProp> = ({
	setOpen,
	createdBy,
	defaultDate,
	defaultEmployeeId,
	creatable,
	onAddReservation,
}) => {
	const { t } = useTranslation();

	const [openBedWarningModal, setOpenBedWarningModal] =
		useState<boolean>(false);
	const [openConflictWarningModal, setOpenConflictWarningModal] =
		useState<boolean>(false);

	const [dateInput, setDateInput] = useState<Date | null>(
		defaultDate || new Date()
	);
	const [employeeIdInput, setEmployeeIdInput] = useState<number | null>(
		defaultEmployeeId || null
	);
	const [serviceIdInput, setServiceIdInput] = useState<number | null>(null);
	const [genderInput, setGenderInput] = useState<Gender | null>(null);
	const [requestedInput, setRequestedInput] = useState<boolean>(false);
	const [messageInput, setMessageInput] = useState<string | null>(null);
	const [customerPhoneNumberInput, setCustomerPhoneNumberInput] = useState<
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
	const [invalidCustomerPhoneNumber, setInvalidCustomerPhoneNumber] =
		useState<boolean>(false);
	const [invalidCustomerName, setInvalidCustomerName] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);
	const [noBeds, setNoBeds] = useState<boolean>(false);
	const [conflict, setConflict] = useState<boolean>(false);

	const { schedules } = useSchedulesContext();
	const { customers } = useCustomersContext();
	const { employees } = useEmployeesContext();
	const { services } = useServicesContext();

	const employeeDropDownItems = getEmployeeDropDownItems(employees);
	const serviceDropDownItems = getServiceDropDownItems(services);

	useEffect(() => {
		const missingCustomerInput =
			customerPhoneNumberInput !== null &&
			customerPhoneNumberInput.length === 10
				? customerNameInput === null
				: false;
		const missingRequiredInput =
			dateInput === null ||
			employeeIdInput === null ||
			serviceIdInput === null ||
			missingCustomerInput;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		dateInput,
		employeeIdInput,
		serviceIdInput,
		genderInput,
		customerPhoneNumberInput,
		customerNameInput,
	]);

	useEffect(() => {
		const invalidCustomer =
			customerPhoneNumberInput !== null
				? invalidCustomerPhoneNumber || invalidCustomerName
				: false;
		const invalidInput = invalidDate || invalidTime || invalidCustomer;

		setInvalidInput(invalidInput);
	}, [
		invalidDate,
		invalidTime,
		invalidCustomerPhoneNumber,
		invalidCustomerName,
		customerPhoneNumberInput,
	]);

	useEffect(() => {
		if (customerPhoneNumberInput?.length === 10) {
			const customer = customers.find(
				(customer) => customer.phone_number === customerPhoneNumberInput
			);
			if (customer) {
				setCustomerNameInput(customer.customer_name);
				setCustomerNotesInput(customer.notes);

				setInvalidCustomerName(false);
			}
		} else {
			setCustomerNameInput(null);
			setCustomerNotesInput(null);

			setInvalidCustomerName(false);
		}
	}, [customerPhoneNumberInput]);

	useEffect(() => {
		if (dateInput && serviceIdInput) {
			const service = services.find(
				(service) => service.service_id === serviceIdInput
			);
			if (service) {
				const startDate = new Date(dateInput);
				const endDate = new Date(startDate.getTime() + service.time * 60000);

				const reservationsAtSameTime = schedules
					.flatMap((schedule) => schedule.reservations)
					.filter((reservation) =>
						doesDateOverlap(
							reservation.reserved_date,
							startDate,
							endDate,
							reservation.service.time
						)
					);

				const bodyReservationsAtSameTime = reservationsAtSameTime.filter(
					(reservation) => reservation.service.bed_required
				);
				if (
					bodyReservationsAtSameTime.length >= STORES.beds &&
					service.bed_required
				) {
					setNoBeds(true);
					setOpenBedWarningModal(true);
				} else {
					setNoBeds(false);
				}

				if (employeeIdInput) {
					const conflictingReservations = reservationsAtSameTime.filter(
						(reservation) => reservation.employee_id === employeeIdInput
					);
					if (conflictingReservations.length > 0) {
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

	const onAdd = () => {
		const reserved_date = dateInput as Date;
		const employee_id = employeeIdInput as number;
		const service_id = serviceIdInput as number;
		const requested_gender = genderInput || undefined;
		const requested_employee = requestedInput;
		const message = messageInput?.trim();
		const phone_number = customerPhoneNumberInput?.trim();
		const customer_name = customerNameInput?.trim();
		const notes = customerNotesInput?.trim();
		const addReservationRequest: AddReservationRequest = {
			reserved_date,
			employee_id,
			service_id,
			requested_gender,
			requested_employee,
			message,
			phone_number,
			customer_name,
			notes,
			created_by: createdBy,
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

							<div className="flex flex-col border-t-2 border-black p-2">
								<span className="font-bold mb-2">
									{t('Customer (Optional)')}:
								</span>
								<AddPhoneNumber
									phoneNumber={customerPhoneNumberInput}
									setPhoneNumber={setCustomerPhoneNumberInput}
									label={LABELS.customer.phone_number}
									name={NAMES.customer.phone_number}
									validationProp={{
										required: customerPhoneNumberInput !== null,
										requiredMessage: ERRORS.customer.phone_number.required,
										invalid: invalidCustomerPhoneNumber,
										setInvalid: setInvalidCustomerPhoneNumber,
										invalidMessage: ERRORS.customer.phone_number.invalid,
									}}
								/>

								{customerPhoneNumberInput !== null &&
									customerPhoneNumberInput.length === 10 &&
									!invalidCustomerPhoneNumber && (
										<>
											<AddInput
												text={customerNameInput}
												setText={setCustomerNameInput}
												label={LABELS.customer.customer_name}
												name={NAMES.customer.customer_name}
												type="text"
												validationProp={{
													maxLength: LENGTHS.customer.customer_name,
													required: customerPhoneNumberInput.length === 10,
													requiredMessage:
														ERRORS.customer.customer_name.required,
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
					conflict
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
						: conflict
						? ERRORS.warnings.conflicts.title
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

export default AddReservation;
