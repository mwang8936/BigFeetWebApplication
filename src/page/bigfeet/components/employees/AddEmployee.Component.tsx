import { useEffect } from 'react';
import LENGTHS from '../../../../constants/lengths.constants';
import PATTERNS from '../../../../constants/patterns.constants';
import { Gender, Permissions, Role } from '../../../../models/enums';
import AddInput from '../miscallaneous/AddInput.Component';
import AddMultiSelect from '../miscallaneous/AddMultiSelect.Component';
import AddPassword from '../miscallaneous/AddPassword.Component';
import AddPayRate from '../miscallaneous/AddPayRate.Component';
import AddDropDown from '../miscallaneous/AddDropDown.Component';
import {
	genderDropDownItems,
	roleDropDownItems,
} from '../../../../constants/drop-down.constants';

interface AddEmployeeProp {
	setGender(gender: Gender | null): void;
	setRole(role: Role | null): void;
	setPermissions(permissions: Permissions[]): void;
}

export default function AddEmployee(prop: AddEmployeeProp) {
	const permissionValues = Object.values(Permissions).map(
		(permission: Permissions) => permission
	);

	useEffect(() => {
		prop.setGender(null);
		prop.setRole(null);
		prop.setPermissions([]);
	}, []);

	return (
		<>
			<AddInput
				defaultText=''
				label='Username'
				name='username'
				type='text'
				pattern={PATTERNS.employee.username}
				maxLength={LENGTHS.username}
				placeholder='Username'
				required={true}
				invalidMessage='Username can only contain letters, numbers and .'
				requiredMessage='Username cannot be empty.'
			/>

			<AddPassword />

			<AddInput
				defaultText=''
				label='First Name'
				name='first_name'
				type='text'
				pattern={PATTERNS.employee.first_name}
				maxLength={LENGTHS.first_name}
				placeholder='FirstName'
				required={true}
				invalidMessage='First Name can only contain letters.'
				requiredMessage='First Name cannot be empty.'
			/>

			<AddInput
				defaultText=''
				label='Last Name'
				name='last_name'
				type='text'
				pattern={PATTERNS.employee.last_name}
				maxLength={LENGTHS.last_name}
				placeholder='LastName'
				required={true}
				invalidMessage='Last Name can only contain letters.'
				requiredMessage='Last Name cannot be empty.'
			/>

			<AddDropDown
				default={genderDropDownItems[0]}
				options={genderDropDownItems}
				onSelect={(option) => {
					if (option.id == null) prop.setGender(null);
					else prop.setGender(option.id as Gender);
				}}
				label='Gender'
				required={true}
				requiredMessage='A gender must be selected.'
			/>

			<AddDropDown
				default={roleDropDownItems[0]}
				options={roleDropDownItems}
				onSelect={(option) => {
					if (option.id == null) prop.setRole(null);
					else prop.setRole(option.id as Role);
				}}
				label='Role'
				required={true}
				requiredMessage='A role must be selected.'
			/>

			<AddMultiSelect
				label='Permissions'
				id='permissions'
				options={permissionValues.map((value) => ({
					value: value,
					label: value,
				}))}
				defaultValues={[]}
				onSelect={(selectedList) =>
					prop.setPermissions(
						selectedList.map((item) => item.value as Permissions)
					)
				}
				placeholder='Select Permissions'
			/>

			<AddPayRate
				defaultText=''
				label='Feet Rate'
				name='feet_rate'
				max={99.99}
				required={false}
				invalidMessage='Feet Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<AddPayRate
				defaultText=''
				label='Body Rate'
				name='body_rate'
				max={99.99}
				required={false}
				invalidMessage='Body Rate must be between $0-100 and limited to 2 decimal places.'
			/>

			<AddPayRate
				defaultText=''
				label='Hourly Rate'
				name='per_hour'
				max={99.99}
				required={false}
				invalidMessage='Hourly Rate must be between $0-100 and limited to 2 decimal places.'
			/>
		</>
	);
}
