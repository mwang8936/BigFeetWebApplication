import AddInput from '../miscallaneous/AddInput.Component';

export default function AddCustomer() {
	return (
		<>
			<AddInput
				label='Phone Number'
				name='phone_number'
				type='tel'
				pattern={PATTERNS.username}
				maxLength={LENGTHS.username}
				placeholder='Username'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				invalidMessage='Username can only contain letters, numbers and .'
				requiredMessage='Username cannot be empty.'
			/>
		</>
	);
}
