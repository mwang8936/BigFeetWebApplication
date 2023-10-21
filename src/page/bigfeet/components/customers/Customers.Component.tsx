import { useState } from 'react';
import { useCustomersContext, useUserContext } from '../../BigFeet.Page';
import { Permissions } from '../../../../models/enums';
import AddButton from '../miscallaneous/AddButton.Component';
import { addCustomer } from '../../../../service/customer.service';
import { useNavigate } from 'react-router-dom';
import Search from './Search.Component';
import PhoneInput from './PhoneInput.Component';

export default function Customers() {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);

	const { customers, setCustomers } = useCustomersContext();
	const { user } = useUserContext();

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_CUSTOMER
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_CUSTOMER
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_CUSTOMER
	);

	const [adding, setAdding] = useState(false);
	const [addError, setAddError] = useState('');
	const [addSuccess, setAddSuccess] = useState('');

	const onAdd = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setAddError('');
		setAddSuccess('');
		const customer_name: string | undefined =
			event.currentTarget.customer_name?.value.trim();
		const phone_number: number | undefined =
			event.currentTarget.phone_number?.value;
		const notes: string | undefined = event.currentTarget.notes?.value;

		if (!customer_name || !phone_number) {
			setAddError('Missing Required Field');
		} else {
			const addCustomerRequest = {
				customer_name,
				phone_number,
				notes,
			};
			setAdding(true);
			addCustomer(navigate, addCustomerRequest)
				.then((response) => {
					const updatedCustomers = customers;
					updatedCustomers.push(response);
					setCustomers(updatedCustomers);
					setAddSuccess('Successfully Added');
				})
				.catch((error) => setAddError(error.message))
				.finally(() => setAdding(false));
		}
	};

	return (
		<div className='w-11/12 mx-auto h-full flex-col'>
			<div className='h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between'>
				<h1 className='my-auto text-gray-600 text-3xl'>Customers</h1>
				<div className='h-fit my-auto flex'>
					<AddButton
						loading={adding}
						disabled={!creatable}
						missingPermissionMessage='You do not have permission to create customers.'
						onAdd={onAdd}
						addBtnTitle='Add Customer'
						addingBtnTitle='Adding Customer...'
						addTitle='Create customer'
						error={addError}
						success={addSuccess}
					/>
				</div>

				<PhoneInput />
			</div>
			<Search />
		</div>
	);
}
