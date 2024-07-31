import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import EditableBodyFeetAcupunctureService from './EditableBodyFeetAcupunctureService.Component.tsx';

import DatesDisplay from '../../miscallaneous/DatesDisplay.Component.tsx';
import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component.tsx';

import { ToggleColor } from '../../miscallaneous/add/AddToggleSwitch.Component.tsx';

import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component.tsx';
import EditableInput from '../../miscallaneous/editable/EditableInput.Component.tsx';
import EditableMinute from '../../miscallaneous/editable/EditableMinute.Component.tsx';
import EditableNumber from '../../miscallaneous/editable/EditableNumber.Component.tsx';
import EditablePayRate from '../../miscallaneous/editable/EditablePayRate.Component.tsx';
import EditableToggleSwitch from '../../miscallaneous/editable/EditableToggleSwitch.Component.tsx';

import DeleteServiceModal from '../../miscallaneous/modals/service/DeleteServiceModal.Component.tsx';

import { colorDropDownItems } from '../../../../../constants/drop-down.constants.ts';
import ERRORS from '../../../../../constants/error.constants.ts';
import LABELS from '../../../../../constants/label.constants.ts';
import LENGTHS from '../../../../../constants/lengths.constants.ts';
import NAMES from '../../../../../constants/name.constants.ts';
import NUMBERS from '../../../../../constants/numbers.constants.ts';
import PATTERNS from '../../../../../constants/patterns.constants.ts';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants.ts';
import STORES from '../../../../../constants/store.constants.ts';

import { ServiceColor } from '../../../../../models/enums.ts';
import Service from '../../../../../models/Service.Model.ts';

import { UpdateServiceRequest } from '../../../../../models/requests/Service.Request.Model.ts';

import {
	deleteService,
	updateService,
} from '../../../../../service/service.service.ts';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../../utils/toast.utils';

interface EditServiceProp {
	editable: boolean;
	deletable: boolean;
	service: Service;
}

const EditService: FC<EditServiceProp> = ({ editable, deletable, service }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

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
	const [acupunctureInput, setAcupunctureInput] = useState<number | null>(
		service.acupuncture
	);
	const [bedsRequiredInput, setBedsRequiredInput] = useState<number | null>(
		service.beds_required
	);
	const [canOverlapInput, setCanOverlapInput] = useState<boolean>(
		service.can_overlap
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
	const [invalidAcupuncture, setInvalidAcupuncture] = useState<boolean>(false);
	const [invalidBedsRequired, setInvalidBedsRequired] =
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
		setAcupunctureInput(service.acupuncture);
		setBedsRequiredInput(service.beds_required);
		setCanOverlapInput(service.can_overlap);
		setColorInput(service.color);

		setChangesMade(false);

		setMissingRequiredInput(false);

		setInvalidServiceName(false);
		setInvalidTime(false);
		setInvalidMoney(false);
		setInvalidBody(false);
		setInvalidFeet(false);
		setInvalidAcupuncture(false);
		setInvalidBedsRequired(false);
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
		const acupuncture: number | null | undefined =
			acupunctureInput === service.acupuncture ? undefined : acupunctureInput;
		const beds_required: number | null | undefined =
			bedsRequiredInput === service.beds_required
				? undefined
				: bedsRequiredInput;
		const can_overlap: boolean | undefined =
			canOverlapInput === service.can_overlap ? undefined : canOverlapInput;
		const color: ServiceColor | null | undefined =
			colorInput === service.color ? undefined : colorInput;

		const changesMade =
			service_name !== undefined ||
			shorthand !== undefined ||
			time !== undefined ||
			money !== undefined ||
			body !== undefined ||
			feet !== undefined ||
			acupuncture !== undefined ||
			beds_required !== undefined ||
			can_overlap !== undefined ||
			color !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			service_name === null ||
			shorthand === null ||
			time === null ||
			money === null ||
			body === null ||
			feet === null ||
			acupuncture === null ||
			beds_required === null ||
			color === null;

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
		canOverlapInput,
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

	const editServiceMutation = useMutation({
		mutationFn: (data: { serviceId: number; request: UpdateServiceRequest }) =>
			updateService(navigate, data.serviceId, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
			successToast(context.toastId, t('Service Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Service'),
					error.message
				);
		},
	});

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
		const acupuncture: number | undefined =
			acupunctureInput === service.acupuncture
				? undefined
				: (acupunctureInput as number);
		const beds_required: number | undefined =
			bedsRequiredInput === service.beds_required
				? undefined
				: (bedsRequiredInput as number);
		const can_overlap: boolean | undefined =
			canOverlapInput === service.can_overlap ? undefined : canOverlapInput;
		const color: ServiceColor | undefined =
			colorInput === service.color ? undefined : (colorInput as ServiceColor);

		const serviceId = service.service_id;
		const request: UpdateServiceRequest = {
			...(service_name !== undefined && { service_name }),
			...(shorthand !== undefined && { shorthand }),
			...(time !== undefined && { time }),
			...(money !== undefined && { money }),
			...(body !== undefined && { body }),
			...(feet !== undefined && { feet }),
			...(acupuncture !== undefined && { acupuncture }),
			...(beds_required !== undefined && { beds_required }),
			...(can_overlap !== undefined && { can_overlap }),
			...(color !== undefined && { color }),
		};

		editServiceMutation.mutate({ serviceId, request });
	};

	const deleteServiceMutation = useMutation({
		mutationFn: (data: { serviceId: number }) =>
			deleteService(navigate, data.serviceId),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Deleting Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
			successToast(context.toastId, t('Service Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Service'),
					error.message
				);
		},
	});

	const onDelete = async (serviceId: number) => {
		deleteServiceMutation.mutate({ serviceId });
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

			<EditableBodyFeetAcupunctureService
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
				originalAcupuncture={service.acupuncture}
				acupuncture={acupunctureInput}
				setAcupuncture={setAcupunctureInput}
				acupunctureValidationProp={{
					required: true,
					requiredMessage: ERRORS.service.acupuncture.required,
					invalid: invalidAcupuncture,
					setInvalid: setInvalidAcupuncture,
					invalidMessage: ERRORS.service.acupuncture.invalid,
				}}
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableNumber
				originalInput={service.beds_required}
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
				editable={editable}
				missingPermissionMessage={ERRORS.service.permissions.edit}
			/>

			<EditableToggleSwitch
				originalChecked={service.can_overlap}
				setChecked={setCanOverlapInput}
				checked={canOverlapInput}
				falseText={t('Cannot Overlap')}
				trueText={t('Can Overlap')}
				toggleColour={ToggleColor.BLUE}
				label={LABELS.service.can_overlap}
				name={NAMES.service.can_overlap}
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

			<div className="bottom-bar">
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
			</div>

			<DatesDisplay
				updatedAt={service.updated_at}
				createdAt={service.created_at}
			/>

			<DeleteServiceModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				serviceId={service.service_id}
				serviceName={service.service_name}
				deletable={deletable}
				onDeleteService={onDelete}
			/>
		</>
	);
};

export default EditService;
