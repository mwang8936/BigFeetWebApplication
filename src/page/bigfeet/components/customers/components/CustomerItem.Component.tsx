import { FC, useState } from 'react';
import Customer from '../../../../../models/Customer.Model';
import { UpdateCustomerRequest } from '../../../../../models/requests/Customer.Request.Model';
import { formatPhoneNumber } from '../../../../../utils/string.utils';
import EditCustomerModal from '../../miscallaneous/modals/customer/EditCustomerModal.Component';
import { useTranslation } from 'react-i18next';

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
		<div
			className="w-full h-fit p-2 border-2 border-black flex flex-col hover:bg-slate-300 cursor-pointer"
			onClick={() => setOpen(true)}>
			<span>
				<span className="font-bold me-1">{t('Name')}:</span>
				{customer.customer_name}
			</span>
			<span>
				<span className="font-bold me-1">{t('Phone Number')}:</span>
				{formatPhoneNumber(customer.phone_number)}
			</span>
			{customer.notes && (
				<span>
					<span className="font-bold me-1">{t('Notes')}:</span>
					{customer.notes}
				</span>
			)}
			<EditCustomerModal
				open={open}
				setOpen={setOpen}
				customer={customer}
				editable={editable}
				onEditCustomer={onEditCustomer}
				deletable={deletable}
				onDeleteCustomer={onDeleteCustomer}
			/>
		</div>
	);
};

export default CustomerItem;
