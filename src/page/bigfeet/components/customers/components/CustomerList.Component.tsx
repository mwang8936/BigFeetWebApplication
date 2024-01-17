import { FC } from 'react';
import Customer from '../../../../../models/Customer.Model';
import { UpdateCustomerRequest } from '../../../../../models/requests/Customer.Request.Model';
import CustomerItem from './CustomerItem.Component';

interface CustomerListProp {
	customers: Customer[];
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
	editable,
	onEditCustomer,
	deletable,
	onDeleteCustomer,
}) => {
	return (
		<div className="flex flex-col flex-1 h-full w-full mx-auto border-black border-2 my-2 overflow-auto">
			{customers.map((customer) => (
				<CustomerItem
					key={customer.phone_number}
					customer={customer}
					editable={editable}
					onEditCustomer={onEditCustomer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			))}
		</div>
	);
};

export default CustomerList;
