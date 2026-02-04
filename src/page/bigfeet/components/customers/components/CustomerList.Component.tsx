import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import CustomerItem from './CustomerItem.Component';

import { PaginatedCustomer } from '../../../../../models/Customer.Model';

interface CustomerListProp {
	customers: PaginatedCustomer[];
}

const CustomerList: FC<CustomerListProp> = ({ customers }) => {
	const { t } = useTranslation();

	const customersElement =
		customers.length !== 0 ? (
			customers.map((customer) => (
				<CustomerItem key={customer.customer_id} customer={customer} />
			))
		) : (
			<h1 className="large-centered-text">{t('No Customers Found')}</h1>
		);

	return <div className="list-div">{customersElement}</div>;
};

export default CustomerList;
