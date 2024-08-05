import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import CustomerItem from './CustomerItem.Component';

import Customer from '../../../../../models/Customer.Model';

import { UpdateCustomerRequest } from '../../../../../models/requests/Customer.Request.Model';

interface CustomerListProp {
	customers: Customer[];
	editable: boolean;
	onEditCustomer(
		customerId: number,
		request: UpdateCustomerRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteCustomer(customerId: number): Promise<void>;
}

const CustomerList: FC<CustomerListProp> = ({
	customers,
	editable,
	onEditCustomer,
	deletable,
	onDeleteCustomer,
}) => {
	const { t } = useTranslation();

	const customersElement =
		customers.length !== 0 ? (
			customers.map((customer) => (
				<CustomerItem
					key={customer.customer_id}
					customer={customer}
					editable={editable}
					onEditCustomer={onEditCustomer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			))
		) : (
			<h1 className="large-centered-text">{t('No Customers Found')}</h1>
		);

	return <div className="list-div">{customersElement}</div>;
};

export default CustomerList;
