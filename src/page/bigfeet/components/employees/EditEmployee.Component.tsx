import { useEffect, useState } from 'react';
import { Role, Permissions, Gender } from '../../../../models/enums';
import { useEmployeesContext, useUserContext } from '../../BigFeet.Page';
import {
	deleteEmployee,
	updateEmployee,
} from '../../../../service/employee.service';
import EditableInput from '../miscallaneous/EditableInput.Component';
import PATTERNS from '../../../../constants/patterns.constants';
import LENGTHS from '../../../../constants/lengths.constants';
import EditablePayRate from '../miscallaneous/EditablePayRate.Component';
import DatesDisplay from '../miscallaneous/DatesDisplay.Component';
import EditableMultiSelect from '../miscallaneous/EditableMultiSelect.Component';
import SaveButton from '../miscallaneous/SaveButton.Component';
import DeleteButton from '../miscallaneous/DeleteButton.Component';
import { useNavigate } from 'react-router-dom';
import Employee from '../../../../models/Employee.Model';
import EditableDropDown from '../miscallaneous/EditableDropDown.Component';
import {
	genderDropDownItems,
	roleDropDownItems,
} from '../../../../constants/drop-down.constants';
import { useAuthenticationContext } from '../../../../App';
import { logout } from '../../../../service/auth.service';

interface EditEmployeeProp {
	editable: boolean;
	deletable: boolean;
	employee: Employee;
}

export default function EditEmployee(prop: EditEmployeeProp) {
	const navigate = useNavigate();

	const [saving, setSaving] = useState(false);
	const [saveError, setSaveError] = useState('');
	const [saveSuccess, setSaveSuccess] = useState('');
	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState('');
	const [deleteSuccess, setDeleteSuccess] = useState('');

	const [gender, setGender] = useState<Gender | null>(prop.employee.gender);
	const [role, setRole] = useState<Role | null>(prop.employee.role);

	const [permissions, setPermissions] = useState<Permissions[]>(
		prop.employee.permissions
	);

	useEffect(() => {
		setPermissions(prop.employee.permissions);
	}, [prop.employee]);

	const permissionValues = Object.values(Permissions).map(
		(permission: Permissions) => permission
	);

	const { user, setUser } = useUserContext();
	const { employees, setEmployees } = useEmployeesContext();
	const { setAuthentication } = useAuthenticationContext();

	const onSave = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setSaveError('');
		setSaveSuccess('');
		const username: string | undefined =
			event.currentTarget.username?.value?.trim();
		const first_name: string | undefined =
			event.currentTarget.first_name?.value?.trim();
		const last_name: string | undefined =
			event.currentTarget.last_name?.value?.trim();
		const body_rate: number | null =
			event.currentTarget.body_rate?.value == ''
				? null
				: event.currentTarget.body_rate?.value;
		const feet_rate: number | null =
			event.currentTarget.feet_rate?.value == ''
				? null
				: event.currentTarget.feet_rate?.value;
		const per_hour: number | null =
			event.currentTarget.per_hour?.value == ''
				? null
				: event.currentTarget.per_hour?.value;

		if (
			!username ||
			!first_name ||
			!last_name ||
			!gender ||
			!role ||
			!permissions
		) {
			setSaveError('Missing Required Field');
		} else if (
			username == prop.employee.username &&
			first_name == prop.employee.first_name &&
			last_name == prop.employee.last_name &&
			gender == prop.employee.gender &&
			role == prop.employee.role &&
			permissions.length === prop.employee.permissions.length &&
			prop.employee.permissions.every((permission) =>
				permissions.includes(permission)
			) &&
			feet_rate == prop.employee.feet_rate &&
			body_rate == prop.employee.body_rate &&
			per_hour == prop.employee.per_hour
		) {
			setSaveError('No changes have been made');
		} else {
			const updateEmployeeRequest = {
				...(username != prop.employee.username && {
					username,
				}),
				...(first_name != prop.employee.first_name && { first_name }),
				...(last_name != prop.employee.last_name && { last_name }),
				...(gender != prop.employee.gender && { gender }),
				...(role != prop.employee.role && { role }),
				...((permissions.length !== prop.employee.permissions.length ||
					!prop.employee.permissions.every((permission) =>
						permissions.includes(permission)
					)) && { permissions }),
				...(feet_rate != prop.employee.feet_rate && { feet_rate }),
				...(body_rate != prop.employee.body_rate && { body_rate }),
				...(per_hour != prop.employee.per_hour && { per_hour }),
			};

			setSaving(true);
			updateEmployee(
				navigate,
				prop.employee.employee_id,
				updateEmployeeRequest
			)
				.then(() => {
					const updatedEmployee = {
						...prop.employee,
						...updateEmployeeRequest,
					};
					setEmployees(
						employees.map((employee) =>
							employee.employee_id == prop.employee.employee_id
								? updatedEmployee
								: employee
						)
					);

					if (prop.employee.employee_id == user.employee_id) {
						const updatedUser = {
							...user,
							...updateEmployeeRequest,
						};
						sessionStorage.setItem(
							'user',
							JSON.stringify(updatedUser)
						);
						setUser(updatedUser);
					}
					setSaveSuccess('Successfully Saved');
				})
				.catch((error) => setSaveError(error.message))
				.finally(() => setSaving(false));
			setSaving(false);
		}
	};

	const onDelete = async () => {
		setDeleteError('');
		setDeleteSuccess('');
		setDeleting(true);
		deleteEmployee(navigate, prop.employee.employee_id)
			.then(() => {
				setEmployees(
					employees.filter(
						(employee) =>
							employee.employee_id != prop.employee.employee_id
					)
				);
				setDeleteSuccess('Successfully Deleted');
				if (prop.employee.employee_id == user.employee_id) {
					logout(setAuthentication);
				}
			})
			.catch((error) => setDeleteError(error.message))
			.finally(() => setDeleting(false));
	};

	return (
		<form onSubmit={onSave}>
			<EditableInput
				text={prop.employee.username}
				label='Username'
				name='username'
				type='text'
				pattern={PATTERNS.employee.username}
				maxLength={LENGTHS.employee.username}
				placeholder='Username'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Username can only contain letters, numbers and .'
				requiredMessage='Username cannot be empty.'
			/>

			<EditableInput
				text={prop.employee.first_name}
				label='First Name'
				name='first_name'
				type='text'
				pattern={PATTERNS.employee.first_name}
				maxLength={LENGTHS.employee.first_name}
				placeholder='FirstName'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='First Name can only contain letters.'
				requiredMessage='First Name cannot be empty.'
			/>

			<EditableInput
				text={prop.employee.last_name}
				label='Last Name'
				name='last_name'
				type='text'
				pattern={PATTERNS.employee.last_name}
				maxLength={LENGTHS.employee.last_name}
				placeholder='LastName'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Last Name can only contain letters.'
				requiredMessage='Last Name cannot be empty.'
			/>

			<EditableDropDown
				default={
					genderDropDownItems.find(
						(option) => option.id == prop.employee.gender
					) || genderDropDownItems[0]
				}
				options={genderDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setGender(null);
					else setGender(option.id as Gender);
				}}
				label='Gender'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				requiredMessage='A gender must be selected.'
			/>

			<EditableDropDown
				default={
					roleDropDownItems.find(
						(option) => option.id == prop.employee.role
					) || roleDropDownItems[0]
				}
				options={roleDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setRole(null);
					else setRole(option.id as Role);
				}}
				label='Role'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				requiredMessage='A role must be selected.'
			/>

			<EditableMultiSelect
				label='Permissions'
				id='permissions'
				options={permissionValues.map((value) => ({
					value: value,
					label: value,
				}))}
				selectedValues={prop.employee.permissions.map((value) => ({
					value: value,
					label: value,
				}))}
				onSelect={(selectedList) =>
					setPermissions(
						selectedList.map((item) => item.value as Permissions)
					)
				}
				placeholder='Select Permissions'
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
			/>

			<EditablePayRate
				text={prop.employee.feet_rate?.toString()}
				label='Feet Rate'
				name='feet_rate'
				max={99.99}
				required={false}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Feet Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<EditablePayRate
				text={prop.employee.body_rate?.toString()}
				label='Body Rate'
				name='body_rate'
				max={99.99}
				required={false}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Body Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<EditablePayRate
				text={prop.employee.per_hour?.toString()}
				label='Hourly Rate'
				name='per_hour'
				max={99.99}
				required={false}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Hourly Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<div className='flex border-t-2 border-gray-400 py-4 justify-between'>
				<SaveButton
					loading={saving}
					disabled={!prop.editable}
					missingPermissionMessage='You do not have permission to change service details.'
					saveBtnTitle='Save Changes'
					savingBtnTitle='Saving...'
					error={saveError}
					success={saveSuccess}
				/>
				<DeleteButton
					loading={deleting}
					disabled={!prop.deletable}
					missingPermissionMessage='You do not have permission to delete employees'
					onDelete={onDelete}
					deleteBtnTitle='Delete Employee'
					deletingBtnTitle='Deleting Employee...'
					deleteTitle={`Delete Employee: ${prop.employee.username}`}
					deleteMsg='Are you sure you want to
                    delete this employee? This
                    action cannot be reversed.'
					error={deleteError}
					success={deleteSuccess}
				/>
			</div>

			<DatesDisplay
				updatedAt={prop.employee.updated_at}
				createdAt={prop.employee.created_at}
			/>
		</form>
	);
}
