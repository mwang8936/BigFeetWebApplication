import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EditCustomerModal from '../../miscallaneous/modals/customer/EditCustomerModal.Component';

import Customer from '../../../../../models/Customer.Model';
import { UpdateCustomerRequest } from '../../../../../models/requests/Customer.Request.Model';

import { formatPhoneNumber } from '../../../../../utils/string.utils';

interface CustomerItemProp {
	customer: Customer;
	editable: boolean;
	onEditCustomer(
		phoneNumber: string,
		request: UpdateCustomerRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteCustomer(phoneNumber: string): Promise<void>;
}

const CustomerItem: FC<CustomerItemProp> = ({
	customer,
	editable,
	onEditCustomer,
	deletable,
	onDeleteCustomer,
}) => {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="list-item-div" onClick={() => setOpen(true)}>
				<span>
					<span className="list-item-field">{t('Phone Number')}:</span>
					{formatPhoneNumber(customer.phone_number)}
				</span>

				{customer.customer_name && (
					<span>
						<span className="list-item-field">{t('Name')}:</span>
						{customer.customer_name}
					</span>
				)}

				{customer.notes && (
					<span>
						<span className="list-item-field">{t('Notes')}:</span>
						{customer.notes}
					</span>
				)}
			</div>

			<EditCustomerModal
				open={open}
				setOpen={setOpen}
				customer={customer}
				editable={editable}
				onEditCustomer={onEditCustomer}
				deletable={deletable}
				onDeleteCustomer={onDeleteCustomer}
			/>
		</>
	);
};

export default CustomerItem;
