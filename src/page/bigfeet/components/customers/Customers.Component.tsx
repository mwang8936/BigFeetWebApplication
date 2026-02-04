import { FC, useEffect, useState } from 'react';
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
	DEFAULT_PAGE_SIZE,
	useCustomersQuery,
} from '../../../hooks/customer.hooks';
import { useUserQuery } from '../../../hooks/profile.hooks';

import ERRORS from '../../../../constants/error.constants';
import LABELS from '../../../../constants/label.constants';
import NAMES from '../../../../constants/name.constants';
import PLACEHOLDERS from '../../../../constants/placeholder.constants';

import { PaginatedCustomers } from '../../../../models/Customer.Model';
import { Permissions } from '../../../../models/enums';
import User from '../../../../models/User.Model';

const Customers: FC = () => {
	const { t } = useTranslation();

	const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);

	const [searchFilter, setSearchFilter] = useState<string | null>(null);
	const [debouncedSearch, setDebouncedSearch] = useState<string | undefined>(
		undefined
	);
	const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

	const [currentPage, setCurrentPage] = useState<number>(1);

	const [retryingCustomerQuery, setRetryingCustomerQuery] =
		useState<boolean>(false);

	// Debounce search input by 500ms
	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedSearch(searchFilter?.trim() || undefined);
			setCurrentPage(1); // Reset to page 1 when search changes
		}, 500);

		return () => clearTimeout(timer);
	}, [searchFilter]);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_CUSTOMER
	);
	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_CUSTOMER
	);

	const customerQuery = useCustomersQuery({
		gettable,
		params: {
			page: currentPage,
			page_size: DEFAULT_PAGE_SIZE,
			search: debouncedSearch,
		},
	});

	const paginatedData: PaginatedCustomers | undefined = customerQuery.data;
	const customers = paginatedData?.data || [];

	const isCustomerLoading = customerQuery.isLoading;

	const retryCustomerQuery = customerQuery.refetch;
	const isCustomerError = customerQuery.isError;
	const customerError = customerQuery.error;

	const isCustomerPaused = customerQuery.isPaused;

	// Show loading in list area, or show the customer list
	const customersElement = isCustomerLoading ? (
		<Loading />
	) : customers.length !== 0 ? (
		<CustomerList customers={customers} />
	) : (
		<h1 className="large-centered-text">
			{debouncedSearch ? t('No Customers Found') : t('No Customers Created')}
		</h1>
	);

	const paginationElement = paginatedData && paginatedData.totalPages > 0 && (
		<div className="flex justify-end items-center gap-4 mt-4 text-sm text-gray-600">
			<span>
				{t('Page')} {paginatedData.page} {t('of')} {paginatedData.totalPages}
			</span>
			<span>|</span>
			<span>
				{paginatedData.total} {t('total customers')}
			</span>
			<div className="flex gap-2">
				<button
					className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
					disabled={currentPage <= 1}
					onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
				>
					{t('Previous')}
				</button>
				<button
					className="px-3 py-1 border rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
					disabled={currentPage >= paginatedData.totalPages}
					onClick={() =>
						setCurrentPage((prev) =>
							Math.min(paginatedData.totalPages, prev + 1)
						)
					}
				>
					{t('Next')}
				</button>
			</div>
		</div>
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

			{paginationElement}
		</>
	);

	// Determine what to show in the content area
	const getContentElement = () => {
		if (!gettable) {
			return (
				<h1 className="large-centered-text">
					{t(ERRORS.customer.permissions.get)}
				</h1>
			);
		}

		if (isCustomerPaused) {
			return (
				<Retry
					retrying={retryingCustomerQuery}
					error={'Network Connection Issue'}
					onRetry={() => {}}
					enabled={false}
				/>
			);
		}

		if (isCustomerError) {
			return (
				<Retry
					retrying={retryingCustomerQuery}
					error={customerError?.message ?? ''}
					onRetry={() => {
						setRetryingCustomerQuery(true);
						retryCustomerQuery().finally(() => setRetryingCustomerQuery(false));
					}}
					enabled={gettable}
				/>
			);
		}

		// Show search and list (loading indicator is inside customersElement)
		return searchElement;
	};

	return (
		<>
			<div className="non-sidebar">
				<div className="title-bar">
					<h1 className="centered-title-text">{t('Customers')}</h1>

					<div className="vertical-center">
						<PermissionsButton
							btnTitle={'Add Customer'}
							btnType={ButtonType.ADD}
							top={false}
							disabled={!creatable}
							missingPermissionMessage={ERRORS.customer.permissions.add}
							onClick={() => setOpenAddCustomerModal(true)}
						/>
					</div>
				</div>

				{getContentElement()}
			</div>

			<AddCustomerModal
				open={openAddCustomerModal}
				setOpen={setOpenAddCustomerModal}
			/>
		</>
	);
};

export default Customers;
