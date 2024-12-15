import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import EditCustomerModal from '../../miscallaneous/modals/customer/EditCustomerModal.Component';

import { CustomerCurrent } from '../../../../../models/Customer.Model';

import { formatPhoneNumber } from '../../../../../utils/string.utils';

interface CustomerItemProp {
	customer: CustomerCurrent;
}

const CustomerItem: FC<CustomerItemProp> = ({ customer }) => {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	return (
		<>
			<div className="list-item-div" onClick={() => setOpen(true)}>
				{customer.phone_number && (
					<span>
						<span className="list-item-field">{t('Phone Number')}:</span>
						{formatPhoneNumber(customer.phone_number)}
					</span>
				)}

				{customer.vip_serial && (
					<span>
						<span className="list-item-field">{t('VIP Serial')}:</span>
						{customer.vip_serial}
					</span>
				)}

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

			<EditCustomerModal open={open} setOpen={setOpen} customer={customer} />
		</>
	);
};

export default CustomerItem;
