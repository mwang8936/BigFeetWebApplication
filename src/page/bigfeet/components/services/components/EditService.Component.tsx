import { FC, useEffect, useState } from 'react';
import LENGTHS from '../../../../../constants/lengths.constants.ts';
import PATTERNS from '../../../../../constants/patterns.constants.ts';
import Service from '../../../../../models/Service.Model.ts';
import { ServiceColor } from '../../../../../models/enums.ts';
import EditableMinute from '../../miscallaneous/editable/EditableMinute.Component.tsx';
import EditablePayRate from '../../miscallaneous/editable/EditablePayRate.Component.tsx';
import { useServicesContext } from '../../../BigFeet.Page.tsx';
import {
	deleteService,
	updateService,
} from '../../../../../service/service.service.ts';
import { useNavigate } from 'react-router-dom';
import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component.tsx';
import { colorDropDownItems } from '../../../../../constants/drop-down.constants.ts';
import EditableInput from '../../miscallaneous/editable/EditableInput.Component.tsx';
import LABELS from '../../../../../constants/label.constants.ts';
import NAMES from '../../../../../constants/name.constants.ts';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants.ts';
import ERRORS from '../../../../../constants/error.constants.ts';
import EditableBodyFeetAccupunctureService from './EditableBodyFeetAccupunctureService.Component.tsx';
import { UpdateServiceRequest } from '../../../../../models/requests/Service.Request.Model.ts';
import { ToastContainer, toast } from 'react-toastify';
import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component.tsx';
import DeleteServiceModal from '../../miscallaneous/modals/service/DeleteServiceModal.Component.tsx';
import NUMBERS from '../../../../../constants/numbers.constants.ts';
import { useTranslation } from 'react-i18next';

interface EditServiceProp {
	editable: boolean;
	deletable: boolean;
	service: Service;
}

const EditService: FC<EditServiceProp> = ({ editable, deletable, service }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [serviceNameInput, setServiceNameInput] = useState<string | null>(
		service.service_name
	);
	const [shorthandInput, setShorthandInput] = useState<string | null>(
		service.shorthand
	);
	const [timeInput, setTimeInput] = useState<number | null>(service.time);
	const [moneyInput, setMoneyInput] = useState<number | null>(service.money);
	const [bodyInput, setBodyInput] = useState<number | null>(service.body);
	const [feetInput, setFeetInput] = useState<number | null>(service.feet);
	const [accupunctureInput, setAccupunctureInput] = useState<number | null>(
		service.accupuncture
	);
	const [colorInput, setColorInput] = useState<ServiceColor | null>(
		service.color
	);

	const [invalidServiceName, setInvalidServiceName] = useState<boolean>(false);
	const [invalidShorthand, setInvalidShorthand] = useState<boolean>(false);
	const [invalidTime, setInvalidTime] = useState<boolean>(false);
	const [invalidMoney, setInvalidMoney] = useState<boolean>(false);
	const [invalidBody, setInvalidBody] = useState<boolean>(false);
	const [invalidFeet, setInvalidFeet] = useState<boolean>(false);
	const [invalidAccupuncture, setInvalidAccupuncture] =
		useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

	useEffect(() => {
		setServiceNameInput(service.service_name);
		setShorthandInput(service.shorthand);
		setTimeInput(service.time);
		setMoneyInput(service.money);
		setBodyInput(service.body);
		setFeetInput(service.feet);
		setAccupunctureInput(service.accupuncture);
		setColorInput(service.color);

		setChangesMade(false);
		setMissingRequiredInput(false);
		setInvalidServiceName(false);
		setInvalidTime(false);
		setInvalidMoney(false);
		setInvalidBody(false);
		setInvalidFeet(false);
		setInvalidAccupuncture(false);
		setInvalidInput(false);
	}, [service]);

	useEffect(() => {
		const trimmedServiceName = serviceNameInput
			? serviceNameInput.trim()
			: null;
		const service_name: string | null | undefined =
			trimmedServiceName === service.service_name
				? undefined
				: trimmedServiceName;
		const trimmedShorthand = shorthandInput ? shorthandInput.trim() : null;
		const shorthand: string | null | undefined =
			trimmedShorthand === service.shorthand ? undefined : trimmedShorthand;
		const time: number | null | undefined =
			timeInput === service.time ? undefined : timeInput;
		const money: number | null | undefined =
			moneyInput === service.money ? undefined : moneyInput;
		const body: number | null | undefined =
			bodyInput === service.body ? undefined : bodyInput;
		const feet: number | null | undefined =
			feetInput === service.feet ? undefined : feetInput;
		const accupuncture: number | null | undefined =
			accupunctureInput === service.accupuncture
				? undefined
				: accupunctureInput;
		const color: ServiceColor | null | undefined =
			colorInput === service.color ? undefined : colorInput;

		const changesMade =
			service_name !== undefined ||
			shorthand !== undefined ||
			time !== undefined ||
			money !== undefined ||
			body !== undefined ||
			feet !== undefined ||
			accupuncture !== undefined ||
			color !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			service_name === null ||
			shorthand === null ||
			time === null ||
			money === null ||
			body === null ||
			feet === null ||
			accupuncture === null ||
			color === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		serviceNameInput,
		shorthandInput,
		timeInput,
		moneyInput,
		bodyInput,
		feetInput,
		accupunctureInput,
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
			invalidAccupuncture;

		setInvalidInput(invalidInput);
	}, [
		invalidServiceName,
		invalidShorthand,
		invalidTime,
		invalidMoney,
		invalidBody,
		invalidFeet,
		invalidAccupuncture,
	]);

	const { services, setServices } = useServicesContext();

	const onSave = async () => {
		const service_name: string | undefined =
			(serviceNameInput as string).trim() === service.service_name
				? undefined
				: (serviceNameInput as string).trim();
		const shorthand: string | undefined =
			(shorthandInput as string).trim() === service.shorthand
				? undefined
				: (shorthandInput as string).trim();
		const time: number | undefined =
			timeInput === service.time ? undefined : (timeInput as number);
		const money: number | undefined =
			moneyInput === service.money ? undefined : (moneyInput as number);
		const body: number | undefined =
			bodyInput === service.body ? undefined : (bodyInput as number);
		const feet: number | undefined =
			feetInput === service.feet ? undefined : (feetInput as number);
		const accupuncture: number | undefined =
			accupunctureInput === service.accupuncture
				? undefined
				: (accupunctureInput as number);
		const color: ServiceColor | undefined =
			colorInput === service.color ? undefined : (colorInput as ServiceColor);

		const updateServiceRequest: UpdateServiceRequest = {
			...(service_name && { service_name }),
			...(shorthand && { shorthand }),
			...(time && { time }),
			...(money && { money }),
			...(body && { body }),
			...(feet && { feet }),
			...(feet && { accupuncture }),
			...(color && { color }),
		};

		const toastId = toast.loading(t('Updating Service...'));

		updateService(navigate, service.service_id, updateServiceRequest)
			.then(() => {
				const updatedService = {
					...service,
					...updateServiceRequest,
				};
				setServices(
					services.map((serviceItem) =>
						serviceItem.service_id === service.service_id
							? updatedService
							: serviceItem
					)
				);
				toast.update(toastId, {
					render: t('Service Updated Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Update Service')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			});
	};

	const onDelete = async (serviceId: number) => {
		const toastId = toast.loading(t('Deleting Service...'));

		deleteService(navigate, serviceId)
			.then(() => {
				setServices(
					services.filter((service) => serviceId !== service.service_id)
				);
				toast.update(toastId, {
					render: t('Service Deleted Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Delete Service')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			});
	};

	return (
		<>
			<EditableInput
				originalText={service.service_name}
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
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableInput
				originalText={service.shorthand}
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
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableMinute
				originalMinutes={service.time}
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
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditablePayRate
				originalAmount={service.money}
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
				placeholder={PLACEHOLDERS.service.body}
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableBodyFeetAccupunctureService
				originalBody={service.body}
				body={bodyInput}
				setBody={setBodyInput}
				bodyValidationProp={{
					required: true,
					requiredMessage: ERRORS.service.body.required,
					invalid: invalidBody,
					setInvalid: setInvalidBody,
					invalidMessage: ERRORS.service.body.invalid,
				}}
				originalFeet={service.feet}
				feet={feetInput}
				setFeet={setFeetInput}
				feetValidationProp={{
					required: true,
					requiredMessage: ERRORS.service.feet.required,
					invalid: invalidFeet,
					setInvalid: setInvalidFeet,
					invalidMessage: ERRORS.service.feet.invalid,
				}}
				originalAccupuncture={service.accupuncture}
				accupuncture={accupunctureInput}
				setAccupuncture={setAccupunctureInput}
				accupunctureValidationProp={{
					required: true,
					requiredMessage: ERRORS.service.accupuncture.required,
					invalid: invalidAccupuncture,
					setInvalid: setInvalidAccupuncture,
					invalidMessage: ERRORS.service.accupuncture.invalid,
				}}
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableDropDown
				originalOption={
					colorDropDownItems[
						colorDropDownItems.findIndex(
							(option) => option.id === service.color
						) || 0
					]
				}
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
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<div className="flex border-t-2 border-gray-400 py-4 justify-between">
				<PermissionsButton
					btnTitle={t('Save Changes')}
					right={false}
					disabled={
						!editable || !changesMade || missingRequiredInput || invalidInput
					}
					missingPermissionMessage={
						!editable
							? ERRORS.service.permissions.edit
							: !changesMade
							? ERRORS.no_changes
							: missingRequiredInput
							? ERRORS.required
							: invalidInput
							? ERRORS.invalid
							: ''
					}
					onClick={onSave}
				/>

				<PermissionsButton
					btnTitle={t('Delete')}
					btnType={ButtonType.DELETE}
					disabled={!deletable}
					missingPermissionMessage={ERRORS.service.permissions.delete}
					onClick={() => {
						setOpenDeleteModal(true);
					}}
				/>

				<DeleteServiceModal
					open={openDeleteModal}
					setOpen={setOpenDeleteModal}
					serviceId={service.service_id}
					serviceName={service.service_name}
					deletable={deletable}
					onDeleteService={onDelete}
				/>
			</div>
			<ToastContainer limit={5} />
		</>
	);
};

export default EditService;
