import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DeleteCustomerModal from './DeleteCustomerModal.Component';

import EditBottom from '../EditBottom.Component';

import EditableInput from '../../editable/EditableInput.Component';
import EditablePhoneNumber from '../../editable/EditablePhoneNumber.Component';
import EditableTextArea from '../../editable/EditableTextArea.Component';

import { useUpdateCustomerMutation } from '../../../../../hooks/customer.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../constants/name.constants';
import PATTERNS from '../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import Customer from '../../../../../../models/Customer.Model';
import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { UpdateCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';

import { formatPhoneNumber } from '../../../../../../utils/string.utils';

interface EditCustomerProp {
	setOpen(open: boolean): void;
	customer: Customer;
}

const EditCustomer: FC<EditCustomerProp> = ({ setOpen, customer }) => {
	const { t } = useTranslation();

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [phoneNumberInput, setPhoneNumberInput] = useState<string | null>(
		customer.phone_number
	);
	const [vipSerialInput, setVipSerialInput] = useState<string | null>(
		customer.vip_serial
	);
	const [nameInput, setNameInput] = useState<string | null>(
		customer.customer_name
	);
	const [notesInput, setNotesInput] = useState<string | null>(customer.notes);

	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState<boolean>(false);
	const [invalidVipSerial, setInvalidVipSerial] = useState<boolean>(false);
	const [invalidName, setInvalidName] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_CUSTOMER
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_CUSTOMER
	);

	useEffect(() => {
		const trimmedPhoneNumber = phoneNumberInput
			? phoneNumberInput.trim()
			: null;
		const phone_number: string | null | undefined =
			trimmedPhoneNumber === customer.phone_number
				? undefined
				: trimmedPhoneNumber;
		const trimmedVipSerial: string | null | undefined = vipSerialInput
			? vipSerialInput.trim()
			: null;
		const vip_serial: string | null | undefined =
			trimmedVipSerial === customer.vip_serial ? undefined : trimmedVipSerial;
		const trimmedCustomerName = nameInput ? nameInput.trim() : null;
		const customer_name: string | null | undefined =
			trimmedCustomerName === customer.customer_name
				? undefined
				: trimmedCustomerName;
		const trimmedNotes = notesInput ? notesInput.trim() : null;
		const notes: string | null | undefined =
			trimmedNotes === customer.notes ? undefined : trimmedNotes;

		const changesMade =
			phone_number !== undefined ||
			vip_serial !== undefined ||
			customer_name !== undefined ||
			notes !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			phoneNumberInput === null && vipSerialInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [phoneNumberInput, vipSerialInput, nameInput, notesInput]);

	useEffect(() => {
		const invalidInput = invalidPhoneNumber || invalidVipSerial || invalidName;

		setInvalidInput(invalidInput);
	}, [invalidPhoneNumber, invalidVipSerial, invalidName]);

	const updateCustomerMutation = useUpdateCustomerMutation({
		onSuccess: () => setOpen(false),
	});
	const onEditCustomer = async (
		customerId: number,
		request: UpdateCustomerRequest
	) => {
		updateCustomerMutation.mutate({ customerId, request });
	};

	const onEdit = () => {
		const trimmedPhoneNumber = phoneNumberInput
			? phoneNumberInput.trim()
			: null;
		const phone_number: string | null | undefined =
			trimmedPhoneNumber === customer.phone_number
				? undefined
				: trimmedPhoneNumber;
		const trimmedVipSerial: string | null | undefined = vipSerialInput
			? vipSerialInput.trim()
			: null;
		const vip_serial: string | null | undefined =
			trimmedVipSerial === customer.vip_serial ? undefined : trimmedVipSerial;
		const trimmedName = nameInput ? nameInput.trim() : null;
		const customer_name: string | null | undefined =
			trimmedName === customer.customer_name ? undefined : trimmedName;
		const trimmedNotes = notesInput ? notesInput.trim() : null;
		const notes: string | null | undefined =
			trimmedNotes === customer.notes ? undefined : trimmedNotes;

		const updateCustomerRequest: UpdateCustomerRequest = {
			...(phone_number !== undefined && { phone_number }),
			...(vip_serial !== undefined && { vip_serial }),
			...(customer_name !== undefined && { customer_name }),
			...(notes !== undefined && { notes }),
		};

		onEditCustomer(customer.customer_id, updateCustomerRequest);
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
							{t('Edit Customer', {
								id: customer.phone_number
									? formatPhoneNumber(customer.phone_number)
									: customer.vip_serial ?? '',
							})}
						</Dialog.Title>

						<div className="mt-2">
							<EditablePhoneNumber
								originalPhoneNumber={customer.phone_number}
								phoneNumber={phoneNumberInput}
								setPhoneNumber={setPhoneNumberInput}
								label={LABELS.customer.phone_number}
								name={NAMES.customer.phone_number}
								validationProp={{
									required: vipSerialInput === null,
									requiredMessage: ERRORS.customer.phone_number.required,
									invalid: invalidPhoneNumber,
									setInvalid: setInvalidPhoneNumber,
									invalidMessage: ERRORS.customer.phone_number.invalid,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.customer.permissions.edit}
							/>

							<EditableInput
								originalText={customer.vip_serial}
								text={vipSerialInput}
								setText={setVipSerialInput}
								label={LABELS.customer.vip_serial}
								name={NAMES.customer.vip_serial}
								type="text"
								placeholder={PLACEHOLDERS.customer.vip_serial}
								validationProp={{
									maxLength: LENGTHS.customer.vip_serial,
									pattern: PATTERNS.customer.vip_serial,
									required: phoneNumberInput === null,
									requiredMessage: ERRORS.vip_package.serial.required,
									invalid: invalidVipSerial,
									setInvalid: setInvalidVipSerial,
									invalidMessage: ERRORS.customer.vip_serial.invalid,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.customer.permissions.edit}
							/>

							<EditableInput
								originalText={customer.customer_name}
								text={nameInput}
								setText={setNameInput}
								label={LABELS.customer.customer_name}
								name={NAMES.customer.customer_name}
								type="text"
								placeholder={PLACEHOLDERS.customer.customer_name}
								validationProp={{
									maxLength: LENGTHS.customer.customer_name,
									required: false,
									invalid: invalidName,
									setInvalid: setInvalidName,
									invalidMessage: ERRORS.customer.customer_name.invalid,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.customer.permissions.edit}
							/>

							<EditableTextArea
								originalText={customer.notes}
								text={notesInput}
								setText={setNotesInput}
								label={LABELS.customer.notes}
								name={NAMES.customer.notes}
								placeholder={PLACEHOLDERS.customer.notes}
								validationProp={{
									required: false,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.customer.permissions.edit}
							/>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={
					!editable || !changesMade || missingRequiredInput || invalidInput
				}
				editMissingPermissionMessage={
					!editable
						? ERRORS.customer.permissions.edit
						: !changesMade
						? ERRORS.no_changes
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onEdit}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.customer.permissions.delete}
				onDelete={() => setOpenDeleteModal(true)}
			/>

			<DeleteCustomerModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				customer={customer}
			/>
		</>
	);
};

export default EditCustomer;
