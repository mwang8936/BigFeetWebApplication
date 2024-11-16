import { FC, useEffect, useState } from 'react';

import EditableBodyFeetAcupunctureService from './EditableBodyFeetAcupunctureService.Component.tsx';

import { useServiceDateContext } from '../Services.Component.tsx';

import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component.tsx';

import EditableMinute from '../../miscallaneous/editable/EditableMinute.Component.tsx';
import EditableNumber from '../../miscallaneous/editable/EditableNumber.Component.tsx';
import EditablePayRate from '../../miscallaneous/editable/EditablePayRate.Component.tsx';

import DeleteServiceRecordModal from '../../miscallaneous/modals/service/DeleteServiceRecordModal.Component.tsx';

import { useUserQuery } from '../../../../hooks/profile.hooks.ts';
import { useAddServiceRecordMutation } from '../../../../hooks/service.hooks.ts';

import ERRORS from '../../../../../constants/error.constants.ts';
import LABELS from '../../../../../constants/label.constants.ts';
import NAMES from '../../../../../constants/name.constants.ts';
import NUMBERS from '../../../../../constants/numbers.constants.ts';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants.ts';
import STORES from '../../../../../constants/store.constants.ts';

import { Permissions } from '../../../../../models/enums.ts';
import { ServiceRecord } from '../../../../../models/Service.Model.ts';
import User from '../../../../../models/User.Model.ts';

import { AddServiceRecordRequest } from '../../../../../models/requests/Service.Request.Model.ts';

import { sameDate } from '../../../../../utils/date.utils.ts';

interface EditServiceRecordProp {
	record: ServiceRecord;
}

const EditServiceRecord: FC<EditServiceRecordProp> = ({ record }) => {
	const { date } = useServiceDateContext();

	const isSameDate = sameDate(record.valid_from, date);

	const [timeInput, setTimeInput] = useState<number | null>(record.time);
	const [moneyInput, setMoneyInput] = useState<number | null>(record.money);
	const [bodyInput, setBodyInput] = useState<number | null>(record.body);
	const [feetInput, setFeetInput] = useState<number | null>(record.feet);
	const [acupunctureInput, setAcupunctureInput] = useState<number | null>(
		record.acupuncture
	);
	const [bedsRequiredInput, setBedsRequiredInput] = useState<number | null>(
		record.beds_required
	);

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

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SERVICE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	useEffect(() => {
		setTimeInput(record.time);
		setMoneyInput(record.money);
		setBodyInput(record.body);
		setFeetInput(record.feet);
		setAcupunctureInput(record.acupuncture);
		setBedsRequiredInput(record.beds_required);

		setChangesMade(false);

		setMissingRequiredInput(false);

		setInvalidTime(false);
		setInvalidMoney(false);
		setInvalidBody(false);
		setInvalidFeet(false);
		setInvalidAcupuncture(false);
		setInvalidBedsRequired(false);
		setInvalidInput(false);
	}, [record]);

	useEffect(() => {
		const time: number | null | undefined =
			timeInput === record.time ? undefined : timeInput;
		const money: number | null | undefined =
			moneyInput === record.money ? undefined : moneyInput;
		const body: number | null | undefined =
			bodyInput === record.body ? undefined : bodyInput;
		const feet: number | null | undefined =
			feetInput === record.feet ? undefined : feetInput;
		const acupuncture: number | null | undefined =
			acupunctureInput === record.acupuncture ? undefined : acupunctureInput;
		const beds_required: number | null | undefined =
			bedsRequiredInput === record.beds_required
				? undefined
				: bedsRequiredInput;

		const changesMade =
			time !== undefined ||
			money !== undefined ||
			body !== undefined ||
			feet !== undefined ||
			acupuncture !== undefined ||
			beds_required !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			time === null ||
			money === null ||
			body === null ||
			feet === null ||
			acupuncture === null ||
			beds_required === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		timeInput,
		moneyInput,
		bodyInput,
		feetInput,
		acupunctureInput,
		bedsRequiredInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidTime ||
			invalidMoney ||
			invalidBody ||
			invalidFeet ||
			invalidAcupuncture ||
			invalidBedsRequired;

		setInvalidInput(invalidInput);
	}, [
		invalidTime,
		invalidMoney,
		invalidBody,
		invalidFeet,
		invalidAcupuncture,
		invalidBedsRequired,
	]);

	const addServiceRecordMutation = useAddServiceRecordMutation({});
	const onSave = async () => {
		const time: number = timeInput as number;
		const money: number = moneyInput as number;
		const body: number = bodyInput as number;
		const feet: number = feetInput as number;
		const acupuncture: number = acupunctureInput as number;
		const beds_required: number = bedsRequiredInput as number;

		const serviceId = record.service_id;
		const request: AddServiceRecordRequest = {
			date,
			time,
			money,
			body,
			feet,
			acupuncture,
			beds_required,
		};

		addServiceRecordMutation.mutate({ serviceId, request });
	};

	return (
		<>
			<EditableMinute
				originalMinutes={record.time}
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
				originalAmount={record.money}
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
				originalBody={record.body}
				body={bodyInput}
				setBody={setBodyInput}
				bodyValidationProp={{
					required: true,
					requiredMessage: ERRORS.service.body.required,
					invalid: invalidBody,
					setInvalid: setInvalidBody,
					invalidMessage: ERRORS.service.body.invalid,
				}}
				originalFeet={record.feet}
				feet={feetInput}
				setFeet={setFeetInput}
				feetValidationProp={{
					required: true,
					requiredMessage: ERRORS.service.feet.required,
					invalid: invalidFeet,
					setInvalid: setInvalidFeet,
					invalidMessage: ERRORS.service.feet.invalid,
				}}
				originalAcupuncture={record.acupuncture}
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
				originalInput={record.beds_required}
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

			<div className="bottom-bar">
				<PermissionsButton
					btnTitle={'Save Changes'}
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

				{isSameDate && (
					<PermissionsButton
						btnTitle={'Delete'}
						btnType={ButtonType.DELETE}
						disabled={!deletable}
						missingPermissionMessage={ERRORS.service.permissions.edit}
						onClick={() => {
							setOpenDeleteModal(true);
						}}
					/>
				)}
			</div>

			<DeleteServiceRecordModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				record={record}
			/>
		</>
	);
};

export default EditServiceRecord;
