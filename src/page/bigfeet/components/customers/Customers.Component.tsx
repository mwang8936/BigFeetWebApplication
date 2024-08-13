import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import CustomerList from './components/CustomerList.Component';

import Loading from '../Loading.Component';
import Retry from '../Retry.Component';

import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';

import AddInput from '../miscallaneous/add/AddInput.Component';

import AddCustomerModal from '../miscallaneous/modals/customer/AddCustomerModal.Component';

import {
	useCustomersQuery,
	useAddCustomerMutation,
	useDeleteCustomerMutation,
	useUpdateCustomerMutation,
} from '../../../hooks/customer.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';

import ERRORS from '../../../../constants/error.constants';
import LABELS from '../../../../constants/label.constants';
import NAMES from '../../../../constants/name.constants';
import PLACEHOLDERS from '../../../../constants/placeholder.constants';

import Customer from '../../../../models/Customer.Model';
import { Permissions } from '../../../../models/enums';
import User from '../../../../models/User.Model';

import {
	AddCustomerRequest,
	UpdateCustomerRequest,
} from '../../../../models/requests/Customer.Request.Model';

const Customers: FC = () => {
	const { t } = useTranslation();

	const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);

	const [searchFilter, setSearchFilter] = useState<string | null>(null);
	const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

	const [retryingCustomerQuery, setRetryingCustomerQuery] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_CUSTOMER
	);
	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_CUSTOMER
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_CUSTOMER
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_CUSTOMER
	);

	const customerQuery = useCustomersQuery({ gettable });

	const customers: Customer[] = customerQuery.data || [];

	const isCustomerLoading = customerQuery.isLoading;

	const retryCustomerQuery = customerQuery.refetch;
	const isCustomerError = customerQuery.isError;
	const customerError = customerQuery.error;

	const isCustomerPaused = customerQuery.isPaused;

	let filteredCustomers: Customer[] = [];
	if (
		!isCustomerLoading &&
		!isCustomerError &&
		!isCustomerPaused &&
		customers
	) {
		filteredCustomers = searchFilter
			? customers.filter(
					(customer) =>
						customer.phone_number
							?.toLowerCase()
							?.includes(searchFilter.toLowerCase()) ||
						customer.vip_serial
							?.toLowerCase()
							?.includes(searchFilter.toLowerCase()) ||
						customer.customer_name
							?.toLowerCase()
							?.includes(searchFilter.toLowerCase())
			  )
			: customers;
	}

	const addCustomerMutation = useAddCustomerMutation({});
	const onAddCustomer = async (request: AddCustomerRequest) => {
		addCustomerMutation.mutate({ request });
	};

	const updateCustomerMutation = useUpdateCustomerMutation({});
	const onEditCustomer = async (
		customerId: number,
		request: UpdateCustomerRequest
	) => {
		updateCustomerMutation.mutate({ customerId, request });
	};

	const deleteCustomerMutation = useDeleteCustomerMutation({});
	const onDeleteCustomer = async (customerId: number) => {
		deleteCustomerMutation.mutate({ customerId });
	};

	const customersElement =
		customers.length !== 0 ? (
			<CustomerList
				customers={filteredCustomers}
				editable={editable}
				onEditCustomer={onEditCustomer}
				deletable={deletable}
				onDeleteCustomer={onDeleteCustomer}
			/>
		) : (
			<h1 className="large-centered-text">{t('No Customers Created')}</h1>
		);

	const searchElement = (
		<>
			<AddInput
				text={searchFilter}
				setText={setSearchFilter}
				label={LABELS.customer.search_customer}
				name={NAMES.customer.search_customer}
				type="text"
				validationProp={{
					required: false,
					invalid: invalidSearch,
					setInvalid: setInvalidSearch,
					invalidMessage: ERRORS.customer.search_customer.invalid,
				}}
				placeholder={PLACEHOLDERS.customer.search_customer}
			/>

			<div className="content-div">{customersElement}</div>
		</>
	);

	const pausedElement = isCustomerPaused ? (
		<Retry
			retrying={retryingCustomerQuery}
			error={'Network Connection Issue'}
			onRetry={() => {}}
			enabled={false}
		/>
	) : (
		searchElement
	);

	const errorsElement = isCustomerError ? (
		<Retry
			retrying={retryingCustomerQuery}
			error={customerError?.message ?? ''}
			onRetry={() => {
				setRetryingCustomerQuery(true);
				retryCustomerQuery().finally(() => setRetryingCustomerQuery(false));
			}}
			enabled={gettable}
		/>
	) : (
		pausedElement
	);

	const permissionsElement = !gettable ? (
		<h1 className="large-centered-text">
			{t(ERRORS.customer.permissions.get)}
		</h1>
	) : (
		errorsElement
	);

	const isLoadingElement = isCustomerLoading ? <Loading /> : permissionsElement;

	return (
		<>
			<div className="non-sidebar">
				<div className="title-bar">
					<h1 className="centered-title-text">{t('Customers')}</h1>

					<div className="vertical-center">
						<PermissionsButton
							btnTitle={t('Add Customer')}
							btnType={ButtonType.ADD}
							top={false}
							disabled={!creatable}
							missingPermissionMessage={t(ERRORS.customer.permissions.add)}
							onClick={() => {
								setOpenAddCustomerModal(true);
							}}
						/>
					</div>
				</div>

				{isLoadingElement}
			</div>

			<AddCustomerModal
				open={openAddCustomerModal}
				setOpen={setOpenAddCustomerModal}
				creatable={creatable}
				onAddCustomer={onAddCustomer}
			/>
		</>
	);
};

export default Customers;
