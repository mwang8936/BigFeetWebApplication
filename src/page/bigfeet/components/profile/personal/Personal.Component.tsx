import PATTERNS from '../../../../../constants/patterns.constants';
import LENGTHS from '../../../../../constants/lengths.constants';
import { FC, useEffect, useState } from 'react';
import { updateEmployee } from '../../../../../service/employee.service';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../BigFeet.Page';
import { Gender, Permissions } from '../../../../../models/enums';
import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import { genderDropDownItems } from '../../../../../constants/drop-down.constants';
import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';
import ERRORS from '../../../../../constants/error.constants';
import EditableInput from '../../miscallaneous/editable/EditableInput.Component';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import { UpdateEmployeeRequest } from '../../../../../models/requests/Employee.Request.Model';
import { useTranslation } from 'react-i18next';
import { userKey } from '../../../../../constants/api.constants';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../../utils/toast.utils';
import { useMutation, useQueryClient } from '@tanstack/react-query';

interface PersonalProp {
	editable: boolean;
	originalUsername: string;
	originalFirstName: string;
	originalLastName: string;
	originalGender: Gender;
}

const Personal: FC<PersonalProp> = ({
	editable,
	originalUsername,
	originalFirstName,
	originalLastName,
	originalGender,
}) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [usernameInput, setUsernameInput] = useState<string | null>(
		originalUsername
	);
	const [firstNameInput, setFirstNameInput] = useState<string | null>(
		originalFirstName
	);
	const [lastNameInput, setLastNameInput] = useState<string | null>(
		originalLastName
	);
	const [genderInput, setGenderInput] = useState<Gender | null>(originalGender);

	const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
	const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false);
	const [invalidLastName, setInvalidLastName] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	useEffect(() => {
		setUsernameInput(originalUsername);
		setFirstNameInput(originalFirstName);
		setLastNameInput(originalLastName);
		setGenderInput(originalGender);

		setChangesMade(false);
		setMissingRequiredInput(false);
		setInvalidUsername(false);
		setInvalidFirstName(false);
		setInvalidLastName(false);
		setInvalidInput(false);
	}, [originalUsername, originalFirstName, originalLastName, originalGender]);

	useEffect(() => {
		const trimmedUsername = usernameInput ? usernameInput.trim() : null;
		const username: string | null | undefined =
			trimmedUsername === originalUsername ? undefined : trimmedUsername;
		const trimmedFirstName = firstNameInput ? firstNameInput.trim() : null;
		const first_name: string | null | undefined =
			trimmedFirstName === originalFirstName ? undefined : trimmedFirstName;
		const trimmedLastName = lastNameInput ? lastNameInput.trim() : null;
		const last_name: string | null | undefined =
			trimmedLastName === originalLastName ? undefined : trimmedLastName;
		const gender: Gender | null | undefined =
			genderInput === originalGender ? undefined : genderInput;

		const changesMade =
			username !== undefined ||
			first_name !== undefined ||
			last_name !== undefined ||
			gender !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			username === null ||
			first_name === null ||
			last_name === null ||
			gender === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [usernameInput, firstNameInput, lastNameInput, genderInput]);

	useEffect(() => {
		const invalidInput = invalidUsername || invalidFirstName || invalidLastName;

		setInvalidInput(invalidInput);
	}, [invalidUsername, invalidFirstName, invalidLastName]);

	const { user, setUser } = useUserContext();

	const editProfileMutation = useMutation({
		mutationFn: (data: {
			employeeId: number;
			request: UpdateEmployeeRequest;
		}) => updateEmployee(navigate, data.employeeId, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Profile...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			const updatedUser = {
				...user,
				...variables.request,
			};
			sessionStorage.setItem(userKey, JSON.stringify(updatedUser));
			setUser(updatedUser);
			successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Profile'),
					error.message
				);
		},
	});

	const onSave = async () => {
		const username: string | undefined =
			(usernameInput as string).trim() === originalUsername
				? undefined
				: (usernameInput as string).trim();
		const first_name: string | undefined =
			(firstNameInput as string).trim() === originalFirstName
				? undefined
				: (firstNameInput as string).trim();
		const last_name: string | undefined =
			(lastNameInput as string).trim() === originalLastName
				? undefined
				: (lastNameInput as string).trim();
		const gender: Gender | undefined =
			genderInput === originalGender ? undefined : (genderInput as Gender);

		const employeeId = user.employee_id;
		const request: UpdateEmployeeRequest = {
			...(username && { username }),
			...(first_name && { first_name }),
			...(last_name && { last_name }),
			...(gender && { gender }),
		};

		editProfileMutation.mutate({ employeeId, request });
	};
	return (
		<>
			<EditableInput
				originalText={originalUsername}
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
				originalText={originalFirstName}
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
				originalText={originalLastName}
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
							(option) => option.id === originalGender
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

			<div className="flex border-t-2 border-gray-400 py-4">
				<PermissionsButton
					btnTitle={t('Save Changes')}
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

export default Personal;
