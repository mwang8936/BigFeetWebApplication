import { FC } from 'react';
import Customer from '../../../../../models/Customer.Model';
import { UpdateCustomerRequest } from '../../../../../models/requests/Customer.Request.Model';
import CustomerItem from './CustomerItem.Component';

interface CustomerListProp {
	customers: Customer[];
	gettable: boolean;
	editable: boolean;
	onEditCustomer(
		phoneNumber: string,
		request: UpdateCustomerRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteCustomer(phoneNumber: string): Promise<void>;
}

const CustomerList: FC<CustomerListProp> = ({
	customers,
	gettable,
	editable,
	onEditCustomer,
	deletable,
	onDeleteCustomer,
}) => {
	const customersElement =
		customers.length !== 0 ? (
			customers.map((customer) => (
				<CustomerItem
					key={customer.phone_number}
					customer={customer}
					editable={editable}
					onEditCustomer={onEditCustomer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			))
		) : (
			<h1 className="text-3xl">No Customers</h1>
		);

	const permissionsElement = gettable ? (
		customersElement
	) : (
		<h1 className="text-3xl">Missing Get Customers Permissions</h1>
	);

	return (
		<div className="flex flex-col flex-1 h-full w-full mx-auto border-black border-2 overflow-auto">
			{permissionsElement}
		</div>
	);
};

export default CustomerList;
