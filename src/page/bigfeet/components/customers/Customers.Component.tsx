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
import { ToastContainer, toast } from 'react-toastify';
import AddInput from '../miscallaneous/add/AddInput.Component';
import ERRORS from '../../../../constants/error.constants';
import { useTranslation } from 'react-i18next';
import LABELS from '../../../../constants/label.constants';
import NAMES from '../../../../constants/name.constants';
import PLACEHOLDERS from '../../../../constants/placeholder.constants';

const Customers: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [openAddCustomerModal, setOpenAddCustomerModal] = useState(false);
	const [searchFilter, setSearchFilter] = useState<string | null>(null);
	const [invalidSearch, setInvalidSearch] = useState<boolean>(false);

	const { customers, setCustomers } = useCustomersContext();
	const { user } = useUserContext();

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
		const toastId = toast.loading(t('Adding Customer...'));
		addCustomer(navigate, request)
			.then((response) => {
				setCustomers([...customers, response]);
				toast.update(toastId, {
					render: t('Customer Added Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Add Customer')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			});
	};

	const onEditCustomer = async (
		phoneNumber: string,
		request: UpdateCustomerRequest
	) => {
		const toastId = toast.loading(t('Updating Customer...'));
		updateCustomer(navigate, phoneNumber, request)
			.then(() => {
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
							customer.phone_number === phoneNumber ? updatedCustomer : customer
						)
					);
				}
				toast.update(toastId, {
					render: t('Customer Updated Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Update Customer')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			});
	};

	const onDeleteCustomer = async (phoneNumber: string) => {
		const toastId = toast.loading(t('Deleting Customer...'));
		deleteCustomer(navigate, phoneNumber)
			.then(() => {
				setCustomers(
					customers.filter((customer) => customer.phone_number !== phoneNumber)
				);
				toast.update(toastId, {
					render: t('Customer Deleted Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Delete Customer')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			});
	};

	return (
		<>
			<div className="w-11/12 mx-auto h-screen flex flex-col">
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
					editable={editable}
					onEditCustomer={onEditCustomer}
					deletable={deletable}
					onDeleteCustomer={onDeleteCustomer}
				/>
			</div>
			<ToastContainer limit={5} />
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
