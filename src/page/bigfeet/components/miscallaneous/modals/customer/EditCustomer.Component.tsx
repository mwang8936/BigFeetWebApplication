import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DeleteCustomerModal from './DeleteCustomerModal.Component';

import EditBottom from '../EditBottom.Component';

import EditableInput from '../../editable/EditableInput.Component';
import EditableTextArea from '../../editable/EditableTextArea.Component';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../constants/name.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import Customer from '../../../../../../models/Customer.Model';

import { UpdateCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';

import { formatPhoneNumber } from '../../../../../../utils/string.utils';

interface EditCustomerProp {
	setOpen(open: boolean): void;
	customer: Customer;
	editable: boolean;
	onEditCustomer(
		phoneNumber: string,
		request: UpdateCustomerRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteCustomer(phoneNumber: string): Promise<void>;
}

const EditCustomer: FC<EditCustomerProp> = ({
	setOpen,
	customer,
	editable,
	onEditCustomer,
	deletable,
	onDeleteCustomer,
}) => {
	const { t } = useTranslation();

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [nameInput, setNameInput] = useState<string | null>(
		customer.customer_name
	);
	const [notesInput, setNotesInput] = useState<string | null>(customer.notes);

	const [invalidName, setInvalidName] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	useEffect(() => {
		const trimmedCustomerName = nameInput ? nameInput.trim() : null;
		const customer_name: string | null | undefined =
			trimmedCustomerName === customer.customer_name
				? undefined
				: trimmedCustomerName;
		const trimmedNotes = notesInput ? notesInput.trim() : null;
		const notes: string | null | undefined =
			trimmedNotes === customer.notes ? undefined : trimmedNotes;

		const changesMade = customer_name !== undefined || notes !== undefined;

		setChangesMade(changesMade);
	}, [nameInput, notesInput]);

	useEffect(() => {
		setInvalidInput(invalidName);
	}, [invalidName]);

	const onEdit = () => {
		const trimmedName = nameInput ? nameInput.trim() : null;
		const customer_name: string | null | undefined =
			trimmedName === customer.customer_name ? undefined : trimmedName;
		const trimmedNotes = notesInput ? notesInput.trim() : null;
		const notes: string | null | undefined =
			trimmedNotes === customer.notes ? undefined : trimmedNotes;

		const updateCustomerRequest: UpdateCustomerRequest = {
			...(customer_name !== undefined && { customer_name }),
			...(notes !== undefined && { notes }),
		};

		onEditCustomer(customer.phone_number, updateCustomerRequest);
		setOpen(false);
	};

	const onDelete = async (phoneNumber: string) => {
		onDeleteCustomer(phoneNumber);
		setOpen(false);
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
								phone_number: formatPhoneNumber(customer.phone_number),
							})}
						</Dialog.Title>

						<div className="mt-2">
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
				disabledEdit={!editable || !changesMade || invalidInput}
				editMissingPermissionMessage={
					!editable
						? ERRORS.customer.permissions.edit
						: !changesMade
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
				phoneNumber={customer.phone_number}
				deletable={deletable}
				onDeleteCustomer={onDelete}
			/>
		</>
	);
};

export default EditCustomer;
