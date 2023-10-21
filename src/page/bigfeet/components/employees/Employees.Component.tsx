import { useState } from 'react';
import AddButton from '../miscallaneous/AddButton.Component';
import { useEmployeesContext, useUserContext } from '../../BigFeet.Page';
import { Gender, Permissions, Role } from '../../../../models/enums';
import { addEmployee } from '../../../../service/employee.service';
import AddEmployee from './AddEmployee.Component';
import Tabs from '../miscallaneous/Tabs.Component';
import EditEmployee from './EditEmployee.Component';
import { useNavigate } from 'react-router-dom';

export default function Employees() {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	const { employees, setEmployees } = useEmployeesContext();
	const { user } = useUserContext();

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_EMPLOYEE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

	const tabs = employees.map((employee) => employee.username);

	const [adding, setAdding] = useState(false);
	const [addError, setAddError] = useState('');
	const [addSuccess, setAddSuccess] = useState('');

	const [gender, setGender] = useState<Gender | null>(null);
	const [role, setRole] = useState<Role | null>(null);
	const [permissions, setPermissions] = useState<Permissions[]>([]);

	const onAdd = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAddError('');
		setAddSuccess('');
		const username: string | undefined =
			event.currentTarget.username?.value?.trim();
		const password: string | undefined =
			event.currentTarget.password?.value?.trim();
		const first_name: string | undefined =
			event.currentTarget.first_name?.value?.trim();
		const last_name: string | undefined =
			event.currentTarget.last_name?.value?.trim();
		const body_rate: number | undefined =
			event.currentTarget.body_rate?.value == ''
				? undefined
				: event.currentTarget.body_rate?.value;
		const feet_rate: number | undefined =
			event.currentTarget.feet_rate?.value == ''
				? undefined
				: event.currentTarget.feet_rate?.value;
		const per_hour: number | undefined =
			event.currentTarget.per_hour?.value == ''
				? undefined
				: event.currentTarget.per_hour?.value;

		if (
			!username ||
			!password ||
			!first_name ||
			!last_name ||
			!gender ||
			!role
		) {
			setAddError('Missing Required Field');
		} else {
			const addEmployeeRequest = {
				username,
				password,
				first_name,
				last_name,
				gender,
				role,
				permissions,
				body_rate,
				feet_rate,
				per_hour,
			};
			setAdding(true);
			addEmployee(navigate, addEmployeeRequest)
				.then((response) => {
					const updatedEmployees = employees;
					updatedEmployees.push(response);
					setEmployees(updatedEmployees);
					setAddSuccess('Successfully Added');
				})
				.catch((error) => setAddError(error.message))
				.finally(() => setAdding(false));
		}
	};

	return (
		<div className='w-11/12 mx-auto h-full flex-col'>
			<div className='h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between'>
				<h1 className='my-auto text-gray-600 text-3xl'>Employees</h1>
				<div className='h-fit my-auto flex'>
					<AddButton
						element={
							<AddEmployee
								setGender={setGender}
								setRole={setRole}
								setPermissions={setPermissions}
							/>
						}
						elementTitle='Add Employee'
						loading={adding}
						disabled={!creatable}
						missingPermissionMessage='You do not have permission to create employees.'
						onAdd={onAdd}
						addBtnTitle='Add Employee'
						addingBtnTitle='Adding Employee...'
						addTitle='Create Employee'
						error={addError}
						success={addSuccess}
					/>
				</div>
			</div>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>
			<div className='mt-8 mb-4'>
				{employees.length <= 0 ? (
					<h1 className='m-auto text-gray-600 text-3xl'>
						No Employees Created
					</h1>
				) : (
					<>
						{employees[selectedTab] && (
							<EditEmployee
								editable={editable}
								deletable={deletable}
								employee={employees[selectedTab]}
							/>
						)}
					</>
				)}
			</div>
		</div>
	);
}
