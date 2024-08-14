import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddInput from '../../add/AddInput.Component';
import AddPhoneNumber from '../../add/AddPhoneNumber.Component';
import AddTextArea from '../../add/AddTextArea.Component';

import { AddCustomerRequest } from '../../../../../../models/requests/Customer.Request.Model';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../constants/name.constants';
import PATTERNS from '../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

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
	const [vipSerialInput, setVipSerialInput] = useState<string | null>(null);
	const [nameInput, setNameInput] = useState<string | null>(null);
	const [notesInput, setNotesInput] = useState<string | null>(null);

	const [invalidPhoneNumber, setInvalidPhoneNumber] = useState<boolean>(false);
	const [invalidVipSerial, setInvalidVipSerial] = useState<boolean>(false);
	const [invalidName, setInvalidName] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	useEffect(() => {
		const missingRequiredInput =
			phoneNumberInput === null && vipSerialInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [phoneNumberInput, vipSerialInput]);

	useEffect(() => {
		const invalidInput = invalidPhoneNumber || invalidVipSerial || invalidName;

		setInvalidInput(invalidInput);
	}, [invalidPhoneNumber, invalidVipSerial, invalidName]);

	const onAdd = async () => {
		const phone_number = phoneNumberInput?.trim();
		const vip_serial = vipSerialInput?.trim();
		const customer_name = nameInput?.trim();
		const notes = notesInput?.trim();

		const addCustomerRequest: AddCustomerRequest = {
			phone_number,
			vip_serial,
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
									required: vipSerialInput === null,
									requiredMessage: ERRORS.customer.phone_number.required,
									invalid: invalidPhoneNumber,
									setInvalid: setInvalidPhoneNumber,
									invalidMessage: ERRORS.customer.phone_number.invalid,
								}}
							/>

							<AddInput
								text={vipSerialInput}
								setText={setVipSerialInput}
								label={LABELS.customer.vip_serial}
								name={NAMES.customer.vip_serial}
								type="text"
								validationProp={{
									maxLength: LENGTHS.customer.vip_serial,
									pattern: PATTERNS.customer.vip_serial,
									required: phoneNumberInput === null,
									requiredMessage: ERRORS.customer.vip_serial.required,
									invalid: invalidVipSerial,
									setInvalid: setInvalidVipSerial,
									invalidMessage: ERRORS.customer.vip_serial.invalid,
								}}
								placeholder={PLACEHOLDERS.customer.vip_serial}
							/>

							<AddInput
								text={nameInput}
								setText={setNameInput}
								label={LABELS.customer.customer_name}
								name={NAMES.customer.customer_name}
								type="text"
								validationProp={{
									maxLength: LENGTHS.customer.customer_name,
									required: false,
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
