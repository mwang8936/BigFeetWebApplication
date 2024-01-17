import { FC, useState } from 'react';
import EditService from './components/EditService.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';
import { useServicesContext, useUserContext } from '../../BigFeet.Page.tsx';
import { Permissions } from '../../../../models/enums.ts';
import { addService } from '../../../../service/service.service.ts';
import { useNavigate } from 'react-router-dom';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import ERRORS from '../../../../constants/error.constants.ts';
import AddServiceModal from '../miscallaneous/modals/service/AddServiceModal.Component.tsx';
import { AddServiceRequest } from '../../../../models/requests/Service.Request.Model.ts';
import { ToastContainer, toast } from 'react-toastify';
import { useTranslation } from 'react-i18next';

const Services: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const { services, setServices } = useServicesContext();
	const { user } = useUserContext();

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_SERVICE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SERVICE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	const tabs = services.map((service) => service.service_name);

	const onAdd = async (addServiceRequest: AddServiceRequest) => {
		const toastId = toast.loading(t('Adding Service...'));
		addService(navigate, addServiceRequest)
			.then((response) => {
				setServices([...services, response]);
				toast.update(toastId, {
					render: t('Service Added Successfully'),
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
							{t('Failed to Add Service')} <br />
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
		<div className="w-11/12 mx-auto h-full flex-col">
			<div className="h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
				<h1 className="my-auto text-gray-600 text-3xl">{t('Services')}</h1>
				<div className="h-fit my-auto flex">
					<PermissionsButton
						btnTitle={t('Add Service')}
						btnType={ButtonType.ADD}
						top={false}
						disabled={!creatable}
						missingPermissionMessage={ERRORS.service.permissions.add}
						onClick={() => {
							setOpenAddModal(true);
						}}
					/>
				</div>
			</div>
			<AddServiceModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				creatable={creatable}
				onAddService={onAdd}
			/>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>
			<div className="mt-8 mb-4">
				{services.length <= 0 ? (
					<h1 className="m-auto text-gray-600 text-3xl">
						{t('No Services Created')}
					</h1>
				) : (
					<>
						{services[selectedTab] && (
							<EditService
								editable={editable}
								deletable={deletable}
								service={services[selectedTab]}
							/>
						)}
					</>
				)}
			</div>
			<ToastContainer limit={5} />
		</div>
	);
};

export default Services;
