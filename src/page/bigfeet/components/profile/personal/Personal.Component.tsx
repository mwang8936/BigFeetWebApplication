import PATTERNS from '../../../../../constants/patterns.constants';
import LENGTHS from '../../../../../constants/lengths.constants';
import EditableInput from '../../miscallaneous/EditableInput.Component';
import SaveButton from '../../miscallaneous/SaveButton.Component';
import { useState } from 'react';
import { updateEmployee } from '../../../../../service/employee.service';
import { useNavigate } from 'react-router-dom';
import { useEmployeesContext, useUserContext } from '../../../BigFeet.Page';
import { Gender } from '../../../../../models/enums';
import EditableDropDown from '../../miscallaneous/EditableDropDown.Component';
import { genderDropDownItems } from '../../../../../constants/drop-down.constants';
import Employee from '../../../../../models/Employee.Model';

interface PersonalProp {
	editable: boolean;
	username: string;
	firstName: string;
	lastName: string;
	gender: Gender;
}

export default function Personal(prop: PersonalProp) {
	const navigate = useNavigate();

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const { user, setUser } = useUserContext();
	let employees: Employee[] = [];
	let setEmployees = (_: Employee[]) => {};
	try {
		employees = useEmployeesContext().employees;
		setEmployees = useEmployeesContext().setEmployees;
	} catch {}

	const [gender, setGender] = useState<Gender | null>(prop.gender);

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setSuccess('');
		const username: string | undefined =
			event.currentTarget.username?.value;
		const first_name: string | undefined =
			event.currentTarget.first_name?.value;
		const last_name: string | undefined =
			event.currentTarget.last_name?.value;
		if (!username || !first_name || !last_name || !gender) {
			setError('Missing Required Field');
		} else if (
			username == prop.username &&
			first_name == prop.firstName &&
			last_name == prop.lastName &&
			gender == prop.gender
		) {
			setError('No changes were made');
		} else {
			const updateEmployeeRequest = {
				...(username != prop.username && { username }),
				...(first_name != prop.firstName && { first_name }),
				...(last_name != prop.lastName && { last_name }),
				...(gender != prop.gender && { gender }),
			};
			setSaving(true);
			updateEmployee(navigate, user.employee_id, updateEmployeeRequest)
				.then(() => {
					const updatedUser = {
						...user,
						...updateEmployeeRequest,
					};
					sessionStorage.setItem('user', JSON.stringify(updatedUser));
					setUser(updatedUser);
					const updatedEmployee = Object(updatedUser);
					delete updatedEmployee['language'];
					delete updatedEmployee['dark_mode'];
					setEmployees(
						employees.map((employee) =>
							employee.employee_id == user.employee_id
								? updatedEmployee
								: employee
						)
					);
					setSuccess('Profile successfully updated.');
				})
				.catch((error) => setError(error.message))
				.finally(() => setSaving(false));
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<EditableInput
				text={prop.username}
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
				text={prop.firstName}
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
				text={prop.lastName}
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
						(option) => option.id == prop.gender
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

			<div className='flex border-t-2 border-gray-400 py-4'>
				<SaveButton
					loading={saving}
					disabled={!prop.editable}
					saveBtnTitle='Save Changes'
					savingBtnTitle='Saving...'
					missingPermissionMessage='You do not have permission to change employee details.'
					error={error}
					success={success}
				/>
			</div>
		</form>
	);
}
