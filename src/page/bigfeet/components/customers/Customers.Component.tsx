import { FC, useState } from 'react';
import { Permissions } from '../../../../models/enums';
import {
	addCustomer,
	deleteCustomer,
	updateCustomer,
} from '../../../../service/customer.service';
import { useNavigate } from 'react-router-dom';
import CustomerList from './components/CustomerList.Component';
import {
	AddCustomerRequest,
	UpdateCustomerRequest,
} from '../../../../models/requests/Customer.Request.Model';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component';
import AddCustomerModal from '../miscallaneous/modals/customer/AddCustomerModal.Component';
import AddInput from '../miscallaneous/add/AddInput.Component';
import ERRORS from '../../../../constants/error.constants';
import { useTranslation } from 'react-i18next';
import LABELS from '../../../../constants/label.constants';
import NAMES from '../../../../constants/name.constants';
import PLACEHOLDERS from '../../../../constants/placeholder.constants';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../utils/toast.utils';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Loading from '../Loading.Component';
import Customer from '../../../../models/Customer.Model';
import Retry from '../Retry.Component';
import {
	useCustomersQuery,
	useUserQuery,
} from '../../../../service/query/get-items.query';
import User from '../../../../models/User.Model';

const Customers: FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

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
	if (!isCustomerLoading && !isCustomerError && !isCustomerPaused) {
		filteredCustomers = searchFilter
			? customers.filter(
					(customer) =>
						customer.customer_name
							?.toLowerCase()
							?.includes(searchFilter.toLowerCase()) ||
						customer.phone_number
							.toLowerCase()
							.includes(searchFilter.toLowerCase())
			  )
			: customers;
	}

	const addCustomerMutation = useMutation({
		mutationFn: (data: { request: AddCustomerRequest }) =>
			addCustomer(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Customer...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			successToast(context.toastId, t('Customer Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(context.toastId, t('Failed to Add Customer'), error.message);
		},
	});

	const onAddCustomer = async (request: AddCustomerRequest) => {
		addCustomerMutation.mutate({ request });
	};

	const editCustomerMutation = useMutation({
		mutationFn: (data: {
			phoneNumber: string;
			request: UpdateCustomerRequest;
		}) => updateCustomer(navigate, data.phoneNumber, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Customer...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			successToast(context.toastId, t('Customer Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Customer'),
					error.message
				);
		},
	});

	const onEditCustomer = async (
		phoneNumber: string,
		request: UpdateCustomerRequest
	) => {
		editCustomerMutation.mutate({ phoneNumber, request });
	};

	const deleteCustomerMutation = useMutation({
		mutationFn: (data: { phoneNumber: string }) =>
			deleteCustomer(navigate, data.phoneNumber),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Deleting Customer...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['customers'] });
			successToast(context.toastId, t('Customer Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Customer'),
					error.message
				);
		},
	});

	const onDeleteCustomer = async (phoneNumber: string) => {
		deleteCustomerMutation.mutate({ phoneNumber });
	};

	const customersElement = (
		<CustomerList
			customers={filteredCustomers}
			editable={editable}
			onEditCustomer={onEditCustomer}
			deletable={deletable}
			onDeleteCustomer={onDeleteCustomer}
		/>
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
			<div className="mb-4 pr-4 overflow-auto">{customersElement}</div>
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
			error={customerError?.message as string}
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
		<h1 className="m-auto text-gray-600 text-3xl">
			{t(ERRORS.customer.permissions.get)}
		</h1>
	) : (
		errorsElement
	);

	const isLoadingElement = isCustomerLoading ? <Loading /> : permissionsElement;

	return (
		<>
			<div className="non-sidebar">
				<div className="py-4 h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
					<h1 className="my-auto text-gray-600 text-3xl">{t('Customers')}</h1>
					<div className="h-fit my-auto flex">
						<PermissionsButton
							btnTitle={t('Add Customer')}
							btnType={ButtonType.ADD}
							top={false}
							disabled={!creatable}
							missingPermissionMessage={ERRORS.customer.permissions.add}
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
