import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PlusCircleIcon } from '@heroicons/react/20/solid';

import AddBottom from '../AddBottom.Component';

import AddInput from '../../add/AddInput.Component';
import AddDropDown from '../../add/AddDropDown.Component';
import AddMultiSelect from '../../add/AddMultiSelect.Component';
import AddPassword from '../../add/AddPassword.Component';
import AddPayRate from '../../add/AddPayRate.Component';

import {
	genderDropDownItems,
	roleDropDownItems,
} from '../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';
import rolePermissions, {
	permissionValues,
} from '../../../../../../constants/role-permissions.constants';

import { Gender, Permissions, Role } from '../../../../../../models/enums';

import { AddEmployeeRequest } from '../../../../../../models/requests/Employee.Request.Model';

interface AddEmployeeProp {
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddEmployee(addEmployeeRequest: AddEmployeeRequest): Promise<void>;
}

const AddEmployee: FC<AddEmployeeProp> = ({
	setOpen,
	creatable,
	onAddEmployee,
}) => {
	const { t } = useTranslation();

	const [usernameInput, setUsernameInput] = useState<string | null>(null);
	const [passwordInput, setPasswordInput] = useState<string | null>(null);
	const [firstNameInput, setFirstNameInput] = useState<string | null>(null);
	const [lastNameInput, setLastNameInput] = useState<string | null>(null);
	const [genderInput, setGenderInput] = useState<Gender | null>(null);
	const [roleInput, setRoleInput] = useState<Role | null>(null);
	const [permissionsInput, setPermissionsInput] = useState<Permissions[]>([]);
	const [bodyRateInput, setBodyRateInput] = useState<number | null>(null);
	const [feetRateInput, setFeetRateInput] = useState<number | null>(null);
	const [acupunctureRateInput, setAcupunctureRateInput] = useState<
		number | null
	>(null);
	const [perHourInput, setPerHourInput] = useState<number | null>(null);

	const [invalidUsername, setInvalidUsername] = useState<boolean>(false);
	const [invalidPassword, setInvalidPassword] = useState<boolean>(false);
	const [matchingPassword, setMatchingPassword] = useState<boolean>(true);
	const [invalidFirstName, setInvalidFirstName] = useState<boolean>(false);
	const [invalidLastName, setInvalidLastName] = useState<boolean>(false);
	const [invalidBodyRate, setInvalidBodyRate] = useState<boolean>(false);
	const [invalidFeetRate, setInvalidFeetRate] = useState<boolean>(false);
	const [invalidAcupunctureRate, setInvalidAcupunctureRate] =
		useState<boolean>(false);
	const [invalidPerHour, setInvalidPerHour] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	useEffect(() => {
		const missingRequiredInput =
			usernameInput === null ||
			passwordInput === null ||
			firstNameInput === null ||
			lastNameInput === null ||
			genderInput === null ||
			roleInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		usernameInput,
		passwordInput,
		firstNameInput,
		lastNameInput,
		genderInput,
		roleInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidUsername ||
			invalidPassword ||
			!matchingPassword ||
			invalidFirstName ||
			invalidLastName ||
			invalidBodyRate ||
			invalidFeetRate ||
			invalidAcupunctureRate ||
			invalidPerHour;

		setInvalidInput(invalidInput);
	}, [
		invalidUsername,
		invalidPassword,
		matchingPassword,
		invalidFirstName,
		invalidLastName,
		invalidBodyRate,
		invalidFeetRate,
		invalidAcupunctureRate,
		invalidPerHour,
	]);

	useEffect(() => {
		if (roleInput) {
			const permissions = rolePermissions.get(roleInput);
			if (permissions) {
				setPermissionsInput(permissions);
			}
		} else {
			setPermissionsInput([]);
		}
	}, [roleInput]);

	const onAdd = async () => {
		const username = (usernameInput as string).trim();
		const password = (passwordInput as string).trim();
		const first_name = (firstNameInput as string).trim();
		const last_name = (lastNameInput as string).trim();
		const gender = genderInput as Gender;
		const role = roleInput as Role;
		const permissions = permissionsInput as Permissions[];
		const body_rate = bodyRateInput !== null ? bodyRateInput : undefined;
		const feet_rate = feetRateInput !== null ? feetRateInput : undefined;
		const acupuncture_rate =
			acupunctureRateInput !== null ? acupunctureRateInput : undefined;
		const per_hour = perHourInput !== null ? perHourInput : undefined;

		const addEmployeeRequest: AddEmployeeRequest = {
			username,
			password,
			first_name,
			last_name,
			gender,
			role,
			permissions,
			body_rate,
			feet_rate,
			acupuncture_rate,
			per_hour,
		};

		onAddEmployee(addEmployeeRequest);
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
							{t('Add Employee')}
						</Dialog.Title>

						<div className="mt-2">
							<AddInput
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
							/>

							<AddPassword
								password={passwordInput}
								setPassword={setPasswordInput}
								validationProp={{
									maxLength: LENGTHS.employee.password,
									required: true,
									requiredMessage: ERRORS.employee.password.required,
									invalid: invalidPassword,
									setInvalid: setInvalidPassword,
									invalidMessage: ERRORS.employee.password.invalid,
									matching: matchingPassword,
									setMatching: setMatchingPassword,
								}}
							/>

							<AddInput
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
							/>

							<AddInput
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
							/>

							<AddDropDown
								option={
									genderDropDownItems[
										genderDropDownItems.findIndex(
											(option) => option.id === genderInput
										) || 0
									]
								}
								options={genderDropDownItems}
								setOption={(option) => {
									setGenderInput(option.id as Gender | null);
								}}
								label={LABELS.employee.gender}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.employee.gender.required,
								}}
							/>

							<AddDropDown
								option={
									roleDropDownItems[
										roleDropDownItems.findIndex(
											(option) => option.id === roleInput
										) || 0
									]
								}
								options={roleDropDownItems}
								setOption={(option) => {
									setRoleInput(option.id as Role | null);
								}}
								label={LABELS.employee.role}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.employee.role.required,
								}}
							/>

							{roleInput && (
								<AddMultiSelect
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
								/>
							)}

							<AddPayRate
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
							/>

							<AddPayRate
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
							/>

							<AddPayRate
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
							/>

							<AddPayRate
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
						? ERRORS.employee.permissions.add
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

export default AddEmployee;
