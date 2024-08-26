import { FC, useEffect, useState } from 'react';

import DatesDisplay from '../../miscallaneous/DatesDisplay.Component';
import PermissionsButton, {
	ButtonType,
} from '../../miscallaneous/PermissionsButton.Component';

import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import EditableInput from '../../miscallaneous/editable/EditableInput.Component';
import EditableMultiSelect from '../../miscallaneous/editable/EditableMultiSelect.Component';
import EditablePayRate from '../../miscallaneous/editable/EditablePayRate.Component';

import DeleteEmployeeModal from '../../miscallaneous/modals/employee/DeleteEmployeeModal.Component';

import { useUpdateEmployeeMutation } from '../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../hooks/profile.hooks';

import {
	genderDropDownItems,
	roleDropDownItems,
} from '../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';
import LENGTHS from '../../../../../constants/lengths.constants';
import NAMES from '../../../../../constants/name.constants';
import NUMBERS from '../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import { permissionValues } from '../../../../../constants/role-permissions.constants';

import Employee from '../../../../../models/Employee.Model';
import { Role, Permissions, Gender } from '../../../../../models/enums';
import User from '../../../../../models/User.Model';

import { UpdateEmployeeRequest } from '../../../../../models/requests/Employee.Request.Model';

import { arraysHaveSameContent } from '../../../../../utils/array.utils';
import FilledPermissionsButton from '../../miscallaneous/FilledPermissionsButton.Component';
import ChangeEmployeePasswordModal from '../../miscallaneous/modals/employee/ChangeEmployeePasswordModal.Component';

interface EditEmployeeProp {
	employee: Employee;
}

const EditEmployee: FC<EditEmployeeProp> = ({ employee }) => {
	const [usernameInput, setUsernameInput] = useState<string | null>(
		employee.username
	);
	const [firstNameInput, setFirstNameInput] = useState<string | null>(
		employee.first_name
	);
	const [lastNameInput, setLastNameInput] = useState<string | null>(
		employee.last_name
	);
	const [genderInput, setGenderInput] = useState<Gender | null>(
		employee.gender
	);
	const [roleInput, setRoleInput] = useState<Role | null>(employee.role);
	const [permissionsInput, setPermissionsInput] = useState<Permissions[]>(
		employee.permissions
	);
	const [bodyRateInput, setBodyRateInput] = useState<number | null>(
		employee.body_rate
	);
	const [feetRateInput, setFeetRateInput] = useState<number | null>(
		employee.feet_rate
	);
	const [acupunctureRateInput, setAcupunctureRateInput] = useState<
		number | null
	>(employee.acupuncture_rate);
	const [perHourInput, setPerHourInput] = useState<number | null>(
		employee.per_hour
	);

	const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
	const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false);
	const [invalidLastName, setInvalidLastName] = useState<boolean>(false);
	const [invalidBodyRate, setInvalidBodyRate] = useState<boolean>(false);
	const [invalidFeetRate, setInvalidFeetRate] = useState<boolean>(false);
	const [invalidAcupunctureRate, setInvalidAcupunctureRate] =
		useState<boolean>(false);
	const [invalidPerHour, setInvalidPerHour] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const [openChangePasswordModal, setOpenChangePasswordModal] = useState(false);
	const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

	useEffect(() => {
		setUsernameInput(employee.username);
		setFirstNameInput(employee.first_name);
		setLastNameInput(employee.last_name);
		setGenderInput(employee.gender);
		setRoleInput(employee.role);
		setPermissionsInput(employee.permissions);
		setBodyRateInput(employee.body_rate);
		setFeetRateInput(employee.feet_rate);
		setAcupunctureRateInput(employee.acupuncture_rate);
		setPerHourInput(employee.per_hour);

		setChangesMade(false);

		setMissingRequiredInput(false);

		setInvalidUsername(false);
		setInvalidFirstName(false);
		setInvalidLastName(false);
		setInvalidBodyRate(false);
		setInvalidFeetRate(false);
		setInvalidAcupunctureRate(false);
		setInvalidPerHour(false);
		setInvalidInput(false);
	}, [employee]);

	useEffect(() => {
		const trimmedUsername = usernameInput ? usernameInput.trim() : null;
		const username: string | null | undefined =
			trimmedUsername === employee.username ? undefined : trimmedUsername;
		const trimmedFirstName = firstNameInput ? firstNameInput.trim() : null;
		const first_name: string | null | undefined =
			trimmedFirstName === employee.first_name ? undefined : trimmedFirstName;
		const trimmedLastName = lastNameInput ? lastNameInput.trim() : null;
		const last_name: string | null | undefined =
			trimmedLastName === employee.last_name ? undefined : trimmedLastName;
		const gender: Gender | null | undefined =
			genderInput === employee.gender ? undefined : genderInput;
		const role: Role | null | undefined =
			roleInput === employee.role ? undefined : roleInput;
		const permissions: Permissions[] | undefined = arraysHaveSameContent(
			permissionsInput,
			employee.permissions
		)
			? undefined
			: permissionsInput;
		const body_rate: number | null | undefined =
			bodyRateInput === employee.body_rate ? undefined : bodyRateInput;
		const feet_rate: number | null | undefined =
			feetRateInput === employee.feet_rate ? undefined : feetRateInput;
		const acupuncture_rate: number | null | undefined =
			acupunctureRateInput === employee.acupuncture_rate
				? undefined
				: acupunctureRateInput;
		const per_hour: number | null | undefined =
			perHourInput === employee.per_hour ? undefined : perHourInput;

		const changesMade =
			username !== undefined ||
			first_name !== undefined ||
			last_name !== undefined ||
			gender !== undefined ||
			role !== undefined ||
			permissions !== undefined ||
			body_rate !== undefined ||
			feet_rate !== undefined ||
			acupuncture_rate !== undefined ||
			per_hour !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			username === null ||
			first_name === null ||
			last_name === null ||
			gender === null ||
			role === null ||
			permissions === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		usernameInput,
		firstNameInput,
		lastNameInput,
		genderInput,
		roleInput,
		permissionsInput,
		bodyRateInput,
		feetRateInput,
		acupunctureRateInput,
		perHourInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidUsername ||
			invalidFirstName ||
			invalidLastName ||
			invalidBodyRate ||
			invalidFeetRate ||
			invalidAcupunctureRate ||
			invalidPerHour;

		setInvalidInput(invalidInput);
	}, [
		invalidUsername,
		invalidFirstName,
		invalidLastName,
		invalidBodyRate,
		invalidFeetRate,
		invalidAcupunctureRate,
		invalidPerHour,
	]);

	const updateEmployeeMutation = useUpdateEmployeeMutation({});
	const onSave = async () => {
		const username: string | undefined =
			(usernameInput as string).trim() === employee.username
				? undefined
				: (usernameInput as string).trim();
		const first_name: string | undefined =
			(firstNameInput as string).trim() === employee.first_name
				? undefined
				: (firstNameInput as string).trim();
		const last_name: string | undefined =
			(lastNameInput as string).trim() === employee.last_name
				? undefined
				: (lastNameInput as string).trim();
		const gender: Gender | undefined =
			genderInput === employee.gender ? undefined : (genderInput as Gender);
		const role: Role | undefined =
			roleInput === employee.role ? undefined : (roleInput as Role);
		const permissions: Permissions[] | undefined = arraysHaveSameContent(
			permissionsInput,
			employee.permissions
		)
			? undefined
			: permissionsInput;
		const body_rate: number | null | undefined =
			bodyRateInput === employee.body_rate ? undefined : bodyRateInput;
		const feet_rate: number | null | undefined =
			feetRateInput === employee.feet_rate ? undefined : feetRateInput;
		const acupuncture_rate: number | null | undefined =
			acupunctureRateInput === employee.acupuncture_rate
				? undefined
				: acupunctureRateInput;
		const per_hour: number | null | undefined =
			perHourInput === employee.per_hour ? undefined : perHourInput;

		const employeeId = employee.employee_id;
		const request: UpdateEmployeeRequest = {
			...(username !== undefined && { username }),
			...(first_name !== undefined && { first_name }),
			...(last_name !== undefined && { last_name }),
			...(gender !== undefined && { gender }),
			...(role !== undefined && { role }),
			...(permissions !== undefined && { permissions }),
			...(body_rate !== undefined && { body_rate }),
			...(feet_rate !== undefined && { feet_rate }),
			...(acupuncture_rate !== undefined && { acupuncture_rate }),
			...(per_hour !== undefined && { per_hour }),
		};
		const userId = user.employee_id;

		updateEmployeeMutation.mutate({ employeeId, request, userId });
	};

	return (
		<>
			<EditableInput
				originalText={employee.username}
				text={usernameInput}
				setText={setUsernameInput}
				label={LABELS.employee.username}
				name={NAMES.employee.username}
				type="text"
				validationProp={{
					maxLength: LENGTHS.employee.username,
					pattern: PATTERNS.employee.username,
					required: true,
					requiredMessage: ERRORS.employee.username.required,
					invalid: invalidUsername,
					setInvalid: setInvalidUsername,
					invalidMessage: ERRORS.employee.username.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.username}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditableInput
				originalText={employee.first_name}
				text={firstNameInput}
				setText={setFirstNameInput}
				label={LABELS.employee.first_name}
				name={NAMES.employee.first_name}
				type="text"
				validationProp={{
					maxLength: LENGTHS.employee.first_name,
					pattern: PATTERNS.employee.first_name,
					required: true,
					requiredMessage: ERRORS.employee.first_name.required,
					invalid: invalidFirstName,
					setInvalid: setInvalidFirstName,
					invalidMessage: ERRORS.employee.first_name.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.first_name}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditableInput
				originalText={employee.last_name}
				text={lastNameInput}
				setText={setLastNameInput}
				label={LABELS.employee.last_name}
				name={NAMES.employee.last_name}
				type="text"
				validationProp={{
					maxLength: LENGTHS.employee.last_name,
					pattern: PATTERNS.employee.last_name,
					required: true,
					requiredMessage: ERRORS.employee.last_name.required,
					invalid: invalidLastName,
					setInvalid: setInvalidLastName,
					invalidMessage: ERRORS.employee.last_name.invalid,
				}}
				placeholder={PLACEHOLDERS.employee.last_name}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditableDropDown
				originalOption={
					genderDropDownItems[
						genderDropDownItems.findIndex(
							(option) => option.id === employee.gender
						) || 0
					]
				}
				options={genderDropDownItems}
				option={
					genderDropDownItems[
						genderDropDownItems.findIndex(
							(option) => option.id === genderInput
						) || 0
					]
				}
				setOption={(option) => setGenderInput(option.id as Gender | null)}
				label={LABELS.employee.gender}
				validationProp={{
					required: true,
					requiredMessage: ERRORS.employee.gender.required,
				}}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditableDropDown
				originalOption={
					roleDropDownItems[
						roleDropDownItems.findIndex(
							(option) => option.id === employee.role
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

			<EditableMultiSelect
				originalValues={employee.permissions.map((value) => ({
					value: value,
					label: value,
				}))}
				options={permissionValues.map((value) => ({
					value: value,
					label: value,
				}))}
				values={permissionsInput.map((value) => ({
					value: value,
					label: value,
				}))}
				setValues={(selectedValues) =>
					setPermissionsInput(
						selectedValues.map((item) => item.value as Permissions)
					)
				}
				label={LABELS.employee.permissions}
				name={NAMES.employee.permissions}
				placeholder={PLACEHOLDERS.employee.permissions}
				editable={editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
			/>

			<EditablePayRate
				originalAmount={employee.body_rate}
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
				originalAmount={employee.feet_rate}
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
				originalAmount={employee.acupuncture_rate}
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
				originalAmount={employee.per_hour}
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

			<FilledPermissionsButton
				btnTitle={'Change Password'}
				top={false}
				right={false}
				disabled={!editable}
				missingPermissionMessage={ERRORS.employee.permissions.edit}
				onClick={() => setOpenChangePasswordModal(true)}
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

				<PermissionsButton
					btnTitle={'Delete'}
					btnType={ButtonType.DELETE}
					disabled={!deletable}
					missingPermissionMessage={ERRORS.employee.permissions.delete}
					onClick={() => setOpenDeleteModal(true)}
				/>
			</div>

			<DatesDisplay
				updatedAt={employee.updated_at}
				createdAt={employee.created_at}
			/>

			<ChangeEmployeePasswordModal
				open={openChangePasswordModal}
				setOpen={setOpenChangePasswordModal}
				employee={employee}
			/>

			<DeleteEmployeeModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				employee={employee}
			/>
		</>
	);
};

export default EditEmployee;
