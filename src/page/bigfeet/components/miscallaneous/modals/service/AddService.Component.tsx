import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddDropDown from '../../add/AddDropDown.Component';
import AddInput from '../../add/AddInput.Component';
import AddMinute from '../../add/AddMinute.Component';
import AddNumber from '../../add/AddNumber.Component';
import AddPayRate from '../../add/AddPayRate.Component';

import AddBodyFeetAcupunctureService from '../../../services/components/AddBodyFeetAcupunctureService.Component';

import { useUserQuery } from '../../../../../hooks/profile.hooks';
import { useAddServiceMutation } from '../../../../../hooks/service.hooks';

import { colorDropDownItems } from '../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';
import STORES from '../../../../../../constants/store.constants';

import { Permissions, ServiceColor } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { AddServiceRequest } from '../../../../../../models/requests/Service.Request.Model';

interface AddServiceProp {
	setOpen(open: boolean): void;
}

const AddService: FC<AddServiceProp> = ({ setOpen }) => {
	const { t } = useTranslation();

	const [serviceNameInput, setServiceNameInput] = useState<string | null>(null);
	const [shorthandInput, setShorthandInput] = useState<string | null>(null);
	const [timeInput, setTimeInput] = useState<number | null>(null);
	const [moneyInput, setMoneyInput] = useState<number | null>(null);
	const [bodyInput, setBodyInput] = useState<number | null>(0);
	const [feetInput, setFeetInput] = useState<number | null>(0);
	const [acupunctureInput, setAcupunctureInput] = useState<number | null>(0);
	const [bedsRequiredInput, setBedsRequiredInput] = useState<number | null>(0);
	const [colorInput, setColorInput] = useState<ServiceColor | null>(null);

	const [invalidServiceName, setInvalidServiceName] = useState<boolean>(false);
	const [invalidShorthand, setInvalidShorthand] = useState<boolean>(false);
	const [invalidTime, setInvalidTime] = useState<boolean>(false);
	const [invalidMoney, setInvalidMoney] = useState<boolean>(false);
	const [invalidBody, setInvalidBody] = useState<boolean>(false);
	const [invalidFeet, setInvalidFeet] = useState<boolean>(false);
	const [invalidAcupuncture, setInvalidAcupuncture] = useState<boolean>(false);
	const [invalidBedsRequired, setInvalidBedsRequired] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_SERVICE
	);

	useEffect(() => {
		const missingRequiredInput =
			serviceNameInput === null ||
			serviceNameInput.trim() === '' ||
			shorthandInput === null ||
			shorthandInput.trim() === '' ||
			timeInput === null ||
			moneyInput === null ||
			bodyInput === null ||
			feetInput === null ||
			acupunctureInput === null ||
			bedsRequiredInput === null ||
			colorInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		serviceNameInput,
		shorthandInput,
		timeInput,
		moneyInput,
		bodyInput,
		feetInput,
		acupunctureInput,
		bedsRequiredInput,
		colorInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidServiceName ||
			invalidShorthand ||
			invalidTime ||
			invalidMoney ||
			invalidBody ||
			invalidFeet ||
			invalidAcupuncture ||
			invalidBedsRequired;

		setInvalidInput(invalidInput);
	}, [
		invalidServiceName,
		invalidShorthand,
		invalidTime,
		invalidMoney,
		invalidBody,
		invalidFeet,
		invalidAcupuncture,
		invalidBedsRequired,
	]);

	const addServiceMutation = useAddServiceMutation({
		onSuccess: () => setOpen(false),
	});
	const onAddService = async (request: AddServiceRequest) => {
		addServiceMutation.mutate({ request });
	};

	const onAdd = async () => {
		const service_name: string = (serviceNameInput as string).trim();
		const shorthand: string = (shorthandInput as string).trim();
		const time: number = timeInput as number;
		const money: number = moneyInput as number;
		const body: number = bodyInput as number;
		const feet: number = feetInput as number;
		const acupuncture: number = acupunctureInput as number;
		const beds_required: number = bedsRequiredInput as number;
		const color: ServiceColor = colorInput as ServiceColor;

		const addServiceRequest: AddServiceRequest = {
			service_name,
			shorthand,
			time,
			money,
			body,
			feet,
			acupuncture,
			beds_required,
			color,
		};
		onAddService(addServiceRequest);
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
							{t('Add Service')}
						</Dialog.Title>

						<div className="mt-2">
							<AddInput
								text={serviceNameInput}
								setText={setServiceNameInput}
								label={LABELS.service.service_name}
								name={NAMES.service.service_name}
								type="text"
								validationProp={{
									maxLength: LENGTHS.service.service_name,
									pattern: PATTERNS.service.service_name,
									required: true,
									requiredMessage: ERRORS.service.service_name.required,
									invalid: invalidServiceName,
									setInvalid: setInvalidServiceName,
									invalidMessage: ERRORS.service.service_name.invalid,
								}}
								placeholder={PLACEHOLDERS.service.service_name}
							/>

							<AddInput
								text={shorthandInput}
								setText={setShorthandInput}
								label={LABELS.service.shorthand}
								name={NAMES.service.shorthand}
								type="text"
								validationProp={{
									pattern: PATTERNS.service.shorthand,
									maxLength: LENGTHS.service.shorthand,
									required: true,
									invalid: invalidShorthand,
									setInvalid: setInvalidShorthand,
									invalidMessage: ERRORS.service.shorthand.invalid,
									requiredMessage: ERRORS.service.shorthand.required,
								}}
								placeholder={PLACEHOLDERS.service.shorthand}
							/>

							<AddMinute
								minutes={timeInput}
								setMinutes={setTimeInput}
								label={LABELS.service.time}
								name={NAMES.service.time}
								validationProp={{
									max: NUMBERS.service.time,
									required: true,
									requiredMessage: ERRORS.service.time.required,
									invalid: invalidTime,
									setInvalid: setInvalidTime,
									invalidMessage: ERRORS.service.time.invalid,
								}}
							/>

							<AddPayRate
								amount={moneyInput}
								setAmount={setMoneyInput}
								label={LABELS.service.money}
								name={NAMES.service.money}
								validationProp={{
									max: NUMBERS.service.money,
									required: true,
									requiredMessage: ERRORS.service.money.required,
									invalid: invalidMoney,
									setInvalid: setInvalidMoney,
									invalidMessage: ERRORS.service.money.invalid,
								}}
								placeholder={PLACEHOLDERS.service.money}
							/>

							<AddBodyFeetAcupunctureService
								body={bodyInput}
								setBody={setBodyInput}
								bodyValidationProp={{
									required: true,
									requiredMessage: ERRORS.service.body.required,
									invalid: invalidBody,
									setInvalid: setInvalidBody,
									invalidMessage: ERRORS.service.body.invalid,
								}}
								feet={feetInput}
								setFeet={setFeetInput}
								feetValidationProp={{
									required: true,
									requiredMessage: ERRORS.service.feet.required,
									invalid: invalidFeet,
									setInvalid: setInvalidFeet,
									invalidMessage: ERRORS.service.feet.invalid,
								}}
								acupuncture={acupunctureInput}
								setAcupuncture={setAcupunctureInput}
								acupunctureValidationProp={{
									required: true,
									requiredMessage: ERRORS.service.acupuncture.required,
									invalid: invalidAcupuncture,
									setInvalid: setInvalidAcupuncture,
									invalidMessage: ERRORS.service.acupuncture.invalid,
								}}
							/>

							<AddNumber
								input={bedsRequiredInput}
								setInput={setBedsRequiredInput}
								label={LABELS.service.beds_required}
								name={NAMES.service.beds_required}
								validationProp={{
									max: STORES.beds,
									required: true,
									invalid: invalidBedsRequired,
									setInvalid: setInvalidBedsRequired,
									invalidMessage: ERRORS.service.beds_required.invalid,
									requiredMessage: ERRORS.service.beds_required.required,
								}}
								placeholder={PLACEHOLDERS.service.beds_required}
							/>

							<AddDropDown
								options={colorDropDownItems}
								option={
									colorDropDownItems[
										colorDropDownItems.findIndex(
											(option) => option.id === colorInput
										) || 0
									]
								}
								setOption={(option) => {
									setColorInput(option.id as ServiceColor | null);
								}}
								label={LABELS.service.color}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.service.color.required,
								}}
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
						? ERRORS.service.permissions.add
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

export default AddService;
