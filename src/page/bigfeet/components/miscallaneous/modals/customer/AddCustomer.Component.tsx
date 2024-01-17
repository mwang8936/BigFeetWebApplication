import { FC, useEffect, useState } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { AddCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';
import AddInput from '../../add/AddInput.Component';
import AddTextArea from '../../add/AddTextArea.Component';
import AddPhoneNumber from '../../add/AddPhoneNumber.Component';
import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';
import AddBottom from '../AddBottom.Component';
import { useTranslation } from 'react-i18next';

interface AddCustomerProp {
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddCustomer(addCustomerRequest: AddCustomerRequest): Promise<void>;
}

const AddCustomer: FC<AddCustomerProp> = ({
	setOpen,
	creatable,
	onAddCustomer,
}) => {
	const { t } = useTranslation();

	const [phoneNumberInput, setPhoneNumberInput] = useState<string | null>(null);
	const [nameInput, setNameInput] = useState<string | null>(null);
	const [notesInput, setNotesInput] = useState<string | null>(null);

	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState<boolean>(false);
	const [invalidName, setInvalidName] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	useEffect(() => {
		const missingRequiredInput =
			phoneNumberInput === null || nameInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [phoneNumberInput, nameInput, notesInput]);

	useEffect(() => {
		const invalidInput = invalidPhoneNumber || invalidName;

		setInvalidInput(invalidInput);
	}, [invalidPhoneNumber, invalidName]);

	const onAdd = async () => {
		const phone_number = (phoneNumberInput as string).trim();
		const customer_name = (nameInput as string).trim();
		const notes = notesInput?.trim();

		const addCustomerRequest: AddCustomerRequest = {
			phone_number,
			customer_name,
			notes,
		};
		onAddCustomer(addCustomerRequest);
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
							{t('Add Customer')}
						</Dialog.Title>
						<div className="mt-2">
							<AddPhoneNumber
								phoneNumber={phoneNumberInput}
								setPhoneNumber={setPhoneNumberInput}
								label={LABELS.customer.phone_number}
								name={NAMES.customer.phone_number}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.customer.phone_number.required,
									invalid: invalidPhoneNumber,
									setInvalid: setInvalidPhoneNumber,
									invalidMessage: ERRORS.customer.phone_number.invalid,
								}}
							/>

							<AddInput
								text={nameInput}
								setText={setNameInput}
								label={LABELS.customer.customer_name}
								name={NAMES.customer.customer_name}
								type="text"
								validationProp={{
									maxLength: LENGTHS.customer.customer_name,
									required: true,
									requiredMessage: ERRORS.customer.customer_name.required,
									invalid: invalidName,
									setInvalid: setInvalidName,
									invalidMessage: ERRORS.customer.customer_name.invalid,
								}}
								placeholder={PLACEHOLDERS.customer.customer_name}
							/>

							<AddTextArea
								text={notesInput}
								setText={setNotesInput}
								label={LABELS.customer.notes}
								name={NAMES.customer.notes}
								validationProp={{
									required: false,
								}}
								placeholder={PLACEHOLDERS.customer.notes}
							/>
						</div>
					</div>
				</div>
			</div>
			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || invalidInput}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.customer.permissions.add
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onAdd={onAdd}
			/>
		</>
	);
};

export default AddCustomer;
