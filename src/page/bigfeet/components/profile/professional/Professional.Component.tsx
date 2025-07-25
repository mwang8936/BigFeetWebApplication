import { FC, useEffect, useState } from 'react';

import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';

import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import EditablePayRate from '../../miscallaneous/editable/EditablePayRate.Component';

import {
	useUpdateProfileMutation,
	useUserQuery,
} from '../../../../hooks/profile.hooks';

import { roleDropDownItems } from '../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import NUMBERS from '../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';

import { Permissions, Role } from '../../../../../models/enums';
import User from '../../../../../models/User.Model';

import { UpdateEmployeeRequest } from '../../../../../models/requests/Employee.Request.Model';

interface ProfessionalProp {
	originalRole: Role;
	originalFeetRate: number | null;
	originalBodyRate: number | null;
	originalAcupunctureRate: number | null;
	originalPerHour: number | null;
}

const Professional: FC<ProfessionalProp> = ({
	originalRole,
	originalFeetRate,
	originalBodyRate,
	originalAcupunctureRate,
	originalPerHour,
}) => {
	const [roleInput, setRoleInput] = useState<Role | null>(originalRole);
	const [bodyRateInput, setBodyRateInput] = useState<number | null>(
		originalBodyRate
	);
	const [feetRateInput, setFeetRateInput] = useState<number | null>(
		originalFeetRate
	);
	const [acupunctureRateInput, setAcupunctureRateInput] = useState<
		number | null
	>(originalAcupunctureRate);
	const [perHourInput, setPerHourInput] = useState<number | null>(
		originalPerHour
	);

	const [invalidBodyRate, setInvalidBodyRate] = useState<boolean>(false);
	const [invalidFeetRate, setInvalidFeetRate] = useState<boolean>(false);
	const [invalidAcupunctureRate, setInvalidAcupunctureRate] =
		useState<boolean>(false);
	const [invalidPerHour, setInvalidPerHour] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);

	useEffect(() => {
		setRoleInput(originalRole);
		setBodyRateInput(originalBodyRate);
		setFeetRateInput(originalFeetRate);
		setAcupunctureRateInput(originalAcupunctureRate);
		setPerHourInput(originalPerHour);

		setChangesMade(false);

		setMissingRequiredInput(false);

		setInvalidBodyRate(false);
		setInvalidFeetRate(false);
		setInvalidAcupunctureRate(false);
		setInvalidPerHour(false);
		setInvalidInput(false);
	}, [
		originalRole,
		originalBodyRate,
		originalFeetRate,
		originalAcupunctureRate,
		originalPerHour,
	]);

	useEffect(() => {
		const role: Role | null | undefined =
			roleInput === originalRole ? undefined : roleInput;
		const body_rate: number | null | undefined =
			bodyRateInput === originalBodyRate ? undefined : bodyRateInput;
		const feet_rate: number | null | undefined =
			feetRateInput === originalFeetRate ? undefined : feetRateInput;
		const acupuncture_rate: number | null | undefined =
			acupunctureRateInput === originalAcupunctureRate
				? undefined
				: acupunctureRateInput;
		const per_hour: number | null | undefined =
			perHourInput === originalPerHour ? undefined : perHourInput;

		const changesMade =
			role !== undefined ||
			body_rate !== undefined ||
			feet_rate !== undefined ||
			acupuncture_rate !== undefined ||
			per_hour !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput = role === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		roleInput,
		bodyRateInput,
		feetRateInput,
		acupunctureRateInput,
		perHourInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidBodyRate ||
			invalidFeetRate ||
			invalidAcupunctureRate ||
			invalidPerHour;

		setInvalidInput(invalidInput);
	}, [
		invalidBodyRate,
		invalidFeetRate,
		invalidAcupunctureRate,
		invalidPerHour,
	]);

	const updateProfileMutation = useUpdateProfileMutation({});
	const onSave = async () => {
		const role: Role | undefined =
			roleInput === originalRole ? undefined : (roleInput as Role);
		const body_rate: number | null | undefined =
			bodyRateInput === originalBodyRate ? undefined : bodyRateInput;
		const feet_rate: number | null | undefined =
			feetRateInput === originalFeetRate ? undefined : feetRateInput;
		const acupuncture_rate: number | null | undefined =
			acupunctureRateInput === originalAcupunctureRate
				? undefined
				: acupunctureRateInput;
		const per_hour: number | null | undefined =
			perHourInput === originalPerHour ? undefined : perHourInput;

		const employeeId = user.employee_id;
		const request: UpdateEmployeeRequest = {
			...(role !== undefined && { role }),
			...(body_rate !== undefined && { body_rate }),
			...(feet_rate !== undefined && { feet_rate }),
			...(acupuncture_rate !== undefined && { acupuncture_rate }),
			...(per_hour !== undefined && { per_hour }),
		};

		updateProfileMutation.mutate({ employeeId, request });
	};

	return (
		<>
			<EditableDropDown
				originalOption={
					roleDropDownItems[
						roleDropDownItems.findIndex(
							(option) => option.id === originalRole
						) || 0
					]
				}
				options={roleDropDownItems}
				option={
					roleDropDownItems[
						roleDropDownItems.findIndex((option) => option.id === roleInput) ||
							0
					]
				}
				setOption={(option) => setRoleInput(option.id as Role | null)}
				label={LABELS.employee.role}
				validationProp={{
					required: true,
					requiredMessage: ERRORS.employee.role.required,
				}}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditablePayRate
				originalAmount={originalBodyRate}
				amount={bodyRateInput}
				setAmount={setBodyRateInput}
				label={LABELS.employee.body_rate}
				name={NAMES.employee.body_rate}
				validationProp={{
					max: NUMBERS.employee.body_rate,
					required: false,
					invalid: invalidBodyRate,
					setInvalid: setInvalidBodyRate,
					invalidMessage: ERRORS.employee.body_rate.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.body_rate}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditablePayRate
				originalAmount={originalFeetRate}
				amount={feetRateInput}
				setAmount={setFeetRateInput}
				label={LABELS.employee.feet_rate}
				name={NAMES.employee.feet_rate}
				validationProp={{
					max: NUMBERS.employee.feet_rate,
					required: false,
					invalid: invalidFeetRate,
					setInvalid: setInvalidFeetRate,
					invalidMessage: ERRORS.employee.feet_rate.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.feet_rate}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditablePayRate
				originalAmount={originalAcupunctureRate}
				amount={acupunctureRateInput}
				setAmount={setAcupunctureRateInput}
				label={LABELS.employee.acupuncture_rate}
				name={NAMES.employee.acupuncture_rate}
				validationProp={{
					max: NUMBERS.employee.acupuncture_rate,
					required: false,
					invalid: invalidAcupunctureRate,
					setInvalid: setInvalidAcupunctureRate,
					invalidMessage: ERRORS.employee.acupuncture_rate.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.acupuncture_rate}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditablePayRate
				originalAmount={originalPerHour}
				amount={perHourInput}
				setAmount={setPerHourInput}
				label={LABELS.employee.per_hour}
				name={NAMES.employee.per_hour}
				validationProp={{
					max: NUMBERS.employee.per_hour,
					required: false,
					invalid: invalidPerHour,
					setInvalid: setInvalidPerHour,
					invalidMessage: ERRORS.employee.per_hour.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.per_hour}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
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
							? ERRORS.employee.permissions.edit
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
			</div>
		</>
	);
};

export default Professional;
