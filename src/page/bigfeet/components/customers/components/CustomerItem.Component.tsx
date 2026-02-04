import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Accordion, AccordionDetails, AccordionSummary } from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

import EditCustomerModal from '../../miscallaneous/modals/customer/EditCustomerModal.Component';

import { PaginatedCustomer } from '../../../../../models/Customer.Model';

import { formatPhoneNumber } from '../../../../../utils/string.utils';
import { moneyToString } from '../../../../../utils/number.utils';

interface CustomerItemProp {
	customer: PaginatedCustomer;
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

				{customer.reservations.length > 0 && (
					<Accordion onClick={(e) => e.stopPropagation()}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							{t('Reservations')} ({customer.reservations.length})
						</AccordionSummary>
						<AccordionDetails>
							{customer.reservations.map((reservation) => (
								<div
									key={reservation.reservation_id}
									className="flex gap-4 py-1 border-b last:border-b-0 text-sm"
								>
									<span>{reservation.service?.service_name}</span>
									<span>{new Date(reservation.date).toLocaleDateString()}</span>
									<span>
										{reservation.employee.first_name}{' '}
										{reservation.employee.last_name}
									</span>
								</div>
							))}
						</AccordionDetails>
					</Accordion>
				)}

				{customer.vip_packages.length > 0 && (
					<Accordion onClick={(e) => e.stopPropagation()}>
						<AccordionSummary expandIcon={<ExpandMoreIcon />}>
							{t('VIP Packages')} ({customer.vip_packages.length})
						</AccordionSummary>
						<AccordionDetails>
							{customer.vip_packages.map((vipPackage) => (
								<div
									key={vipPackage.vip_package_id}
									className="flex gap-4 py-1 border-b last:border-b-0 text-sm"
								>
									<span>${moneyToString(vipPackage.sold_amount)}</span>
									<span>
										{new Date(vipPackage.created_at).toLocaleDateString()}
									</span>
								</div>
							))}
						</AccordionDetails>
					</Accordion>
				)}
			</div>

			<EditCustomerModal open={open} setOpen={setOpen} customer={customer} />
		</>
	);
};

export default CustomerItem;
