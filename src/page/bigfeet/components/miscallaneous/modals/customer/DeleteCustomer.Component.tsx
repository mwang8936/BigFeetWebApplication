import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import DeleteBottom from '../DeleteBottom.Component';

import { useDeleteCustomerMutation } from '../../../../../hooks/customer.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';

import Customer from '../../../../../../models/Customer.Model';
import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { formatPhoneNumber } from '../../../../../../utils/string.utils';

interface DeleteCustomerProp {
	setOpen(open: boolean): void;
	customer: Customer;
}

const DeleteCustomer: FC<DeleteCustomerProp> = ({ setOpen, customer }) => {
	const { t } = useTranslation();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_CUSTOMER
	);

	const deleteCustomerMutation = useDeleteCustomerMutation({});
	const onDeleteCustomer = async (customerId: number) => {
		deleteCustomerMutation.mutate({ customerId });
	};

	const onDelete = async () => {
		onDeleteCustomer(customer.customer_id);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
						<ExclamationTriangleIcon
							className="h-6 w-6 text-red-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Edit Customer', {
								id: customer.phone_number
									? formatPhoneNumber(customer.phone_number)
									: customer.vip_serial ?? '',
							})}
						</Dialog.Title>

						<div className="mt-2">
							{t(
								'Are you sure you want to delete this customer? This action cannot be reversed.'
							)}
						</div>
					</div>
				</div>
			</div>

			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.customer.permissions.delete}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DeleteCustomer;
