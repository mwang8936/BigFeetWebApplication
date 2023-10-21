import { Role } from '../../../../../models/enums';
import EditablePayRate from '../../miscallaneous/EditablePayRate.Component';
import SaveButton from '../../miscallaneous/SaveButton.Component';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { useEmployeesContext, useUserContext } from '../../../BigFeet.Page';
import { updateEmployee } from '../../../../../service/employee.service';
import EditableDropDown from '../../miscallaneous/EditableDropDown.Component';
import { roleDropDownItems } from '../../../../../constants/drop-down.constants';
import Employee from '../../../../../models/Employee.Model';

interface ProfessionalProp {
	editable: boolean;
	role: Role;
	feetRate: number | null;
	bodyRate: number | null;
	perHour: number | null;
}

export default function Professional(prop: ProfessionalProp) {
	const navigate = useNavigate();

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [role, setRole] = useState<Role | null>(prop.role);

	const { user, setUser } = useUserContext();
	let employees: Employee[] = [];
	let setEmployees = (_: Employee[]) => {};
	try {
		employees = useEmployeesContext().employees;
		setEmployees = useEmployeesContext().setEmployees;
	} catch {}

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setSuccess('');
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
		if (!role) {
			setError('Missing Required Field');
		} else if (
			role == prop.role &&
			body_rate == prop.bodyRate &&
			feet_rate == prop.feetRate &&
			per_hour == prop.perHour
		) {
			setError('No changes were made');
		} else {
			const updateEmployeeRequest = {
				...(role != prop.role && { role }),
				...(body_rate != prop.bodyRate && { body_rate }),
				...(feet_rate != prop.feetRate && { feet_rate }),
				...(per_hour != prop.perHour && { per_hour }),
			};
			const updatedUser = {
				...user,
				...updateEmployeeRequest,
			};
			setSaving(true);
			updateEmployee(navigate, user.employee_id, updateEmployeeRequest)
				.then(() => {
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
			<EditableDropDown
				default={
					roleDropDownItems.find(
						(option) => option.id == prop.role
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

			<EditablePayRate
				text={prop.feetRate?.toString()}
				label='Feet Rate'
				name='feet_rate'
				max={99.99}
				required={false}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Feet Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<EditablePayRate
				text={prop.bodyRate?.toString()}
				label='Body Rate'
				name='body_rate'
				max={99.99}
				required={false}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Body Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<EditablePayRate
				text={prop.perHour?.toString()}
				label='Hourly Rate'
				name='per_hour'
				max={99.99}
				required={false}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Hourly Rate must be between $0-100 and limited to 2 decimal places.'
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
