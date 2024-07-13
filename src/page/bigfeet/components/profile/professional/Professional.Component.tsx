import { Permissions, Role } from '../../../../../models/enums';
import EditablePayRate from '../../miscallaneous/editable/EditablePayRate.Component';
import { useNavigate } from 'react-router-dom';
import { FC, useEffect, useState } from 'react';
import { useEmployeesContext, useUserContext } from '../../../BigFeet.Page';
import { updateEmployee } from '../../../../../service/employee.service';
import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import { roleDropDownItems } from '../../../../../constants/drop-down.constants';
import { ToastContainer, toast } from 'react-toastify';
import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';
import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import NUMBERS from '../../../../../constants/numbers.constants';
import { UpdateEmployeeRequest } from '../../../../../models/requests/Employee.Request.Model';
import Employee from '../../../../../models/Employee.Model';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import { useTranslation } from 'react-i18next';
import { userKey } from '../../../../../constants/api.constants';

interface ProfessionalProp {
	editable: boolean;
	originalRole: Role;
	originalFeetRate: number | null;
	originalBodyRate: number | null;
	originalAcupunctureRate: number | null;
	originalPerHour: number | null;
}

const Professional: FC<ProfessionalProp> = ({
	editable,
	originalRole,
	originalFeetRate,
	originalBodyRate,
	originalAcupunctureRate,
	originalPerHour,
}) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

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

	const { user, setUser } = useUserContext();
	const { employees, setEmployees } = useEmployeesContext();

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

		const updateEmployeeRequest: UpdateEmployeeRequest = {
			...(role && { role }),
			...(body_rate && { body_rate }),
			...(feet_rate && { feet_rate }),
			...(acupuncture_rate && { acupuncture_rate }),
			...(per_hour && { per_hour }),
		};

		const toastId = toast.loading(t('Updating Profile...'));

		updateEmployee(navigate, user.employee_id, updateEmployeeRequest)
			.then(() => {
				const updatedUser = {
					...user,
					...updateEmployeeRequest,
				};
				sessionStorage.setItem(userKey, JSON.stringify(updatedUser));
				setUser(updatedUser);
				const updatedEmployee = Object(updatedUser);
				delete updatedEmployee['language'];
				delete updatedEmployee['dark_mode'];
				if (user.permissions.includes(Permissions.PERMISSION_GET_EMPLOYEE)) {
					setEmployees(
						employees.map((employee) =>
							employee.employee_id == user.employee_id
								? updatedEmployee
								: employee
						)
					);
				} else {
					setEmployees([]);
				}

				toast.update(toastId, {
					render: t('Profile Updated Successfully'),
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
							{t('Failed to Update Profile')} <br />
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
			<ToastContainer limit={5} />
		</>
	);
};

export default Professional;
