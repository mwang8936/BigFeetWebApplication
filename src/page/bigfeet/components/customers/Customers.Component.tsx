import { FC, useState } from 'react';
import { useCustomersContext, useUserContext } from '../../BigFeet.Page';
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
	createToast,
	errorToast,
	updateToast,
} from '../../../../utils/toast.utils';

const Customers: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
	const [searchFilter, setSearchFilter] = useState<string | null>(null);
	const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

	const { customers, setCustomers } = useCustomersContext();
	const { user } = useUserContext();

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

	const filteredCustomers = searchFilter
		? customers.filter(
				(customer) =>
					customer.customer_name
						.toLowerCase()
						.includes(searchFilter.toLowerCase()) ||
					customer.phone_number
						.toLowerCase()
						.includes(searchFilter.toLowerCase())
		  )
		: customers;

	const onAddCustomer = async (request: AddCustomerRequest) => {
		const toastId = createToast(t('Adding Customer...'));
		addCustomer(navigate, request)
			.then((response) => {
				if (gettable) {
					setCustomers([...customers, response]);
				} else {
					setCustomers([]);
				}
				updateToast(toastId, t('Customer Added Successfully'));
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Add Customer'), error.message);
			});
	};

	const onEditCustomer = async (
		phoneNumber: string,
		request: UpdateCustomerRequest
	) => {
		const toastId = createToast(t('Updating Customer...'));
		updateCustomer(navigate, phoneNumber, request)
			.then(() => {
				if (gettable) {
					const oldCustomer = customers.find(
						(customer) => customer.phone_number === phoneNumber
					);
					if (oldCustomer) {
						const updatedCustomer = {
							...oldCustomer,
							...request,
						};
						setCustomers(
							customers.map((customer) =>
								customer.phone_number === phoneNumber
									? updatedCustomer
									: customer
							)
						);
					}
				} else {
					setCustomers([]);
				}
				updateToast(toastId, t('Customer Updated Successfully'));
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Update Customer'), error.message);
			});
	};

	const onDeleteCustomer = async (phoneNumber: string) => {
		const toastId = createToast(t('Deleting Customer...'));
		deleteCustomer(navigate, phoneNumber)
			.then(() => {
				if (gettable) {
					setCustomers(
						customers.filter(
							(customer) => customer.phone_number !== phoneNumber
						)
					);
				} else {
					setCustomers([]);
				}
				updateToast(toastId, t('Customer Deleted Successfully'));
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Delete Customer'), error.message);
			});
	};

	return (
		<>
			<div className="non-sidebar">
				<div className="h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
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
				<CustomerList
					customers={filteredCustomers}
					gettable={gettable}
					editable={editable}
					onEditCustomer={onEditCustomer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
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
