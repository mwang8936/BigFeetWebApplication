import { FC, useState } from 'react';
import EditService from './components/EditService.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';
import { useUserContext } from '../../BigFeet.Page.tsx';
import { Permissions } from '../../../../models/enums.ts';
import {
	addService,
	getServices,
} from '../../../../service/service.service.ts';
import { useNavigate } from 'react-router-dom';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import ERRORS from '../../../../constants/error.constants.ts';
import AddServiceModal from '../miscallaneous/modals/service/AddServiceModal.Component.tsx';
import { AddServiceRequest } from '../../../../models/requests/Service.Request.Model.ts';
import { useTranslation } from 'react-i18next';
import {
	createToast,
	errorToast,
	updateToast,
} from '../../../../utils/toast.utils.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Service from '../../../../models/Service.Model.ts';
import Loading from '../Loading.Component.tsx';
import Retry from '../Retry.Component.tsx';

const Services: FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const [retryingServiceQuery, setRetryingServiceQuery] =
		useState<boolean>(false);

	const { user } = useUserContext();

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);
	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_SERVICE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SERVICE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	const serviceQuery = useQuery({
		queryKey: ['services'],
		queryFn: () => getServices(navigate),
		enabled: gettable,
	});

	const serviceData: Service[] = serviceQuery.data;

	const isServiceLoading = serviceQuery.isLoading;

	const retryServiceQuery = serviceQuery.refetch;
	const isServiceError = serviceQuery.isError;
	const serviceError = serviceQuery.error;

	const isServicePaused = serviceQuery.isPaused;

	const tabs = serviceData.map((service) => service.service_name);

	const addServiceMutation = useMutation({
		mutationFn: (data: { request: AddServiceRequest }) =>
			addService(navigate, data.request),
		onMutate: async () => {
			const toastId = createToast(t('Adding Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
			updateToast(context.toastId, t('Service Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(context.toastId, t('Failed to Add Service'), error.message);
		},
	});

	const onAdd = async (request: AddServiceRequest) => {
		addServiceMutation.mutate({ request });
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
			{isServiceLoading ? (
				<Loading />
			) : isServiceError ? (
				<Retry
					retrying={retryingServiceQuery}
					error={
						gettable
							? ERRORS.service.permissions.get
							: (serviceError?.message as string)
					}
					onRetry={() => {
						setRetryingServiceQuery(true);
						retryServiceQuery().finally(() => setRetryingServiceQuery(false));
					}}
					enabled={gettable}
				/>
			) : isServicePaused ? (
				<Retry
					retrying={retryingServiceQuery}
					error={'Network Connection Issue'}
					onRetry={() => {}}
					enabled={false}
				/>
			) : (
				<>
					<Tabs
						tabs={tabs}
						selectedTab={selectedTab}
						onTabSelected={setSelectedTab}
					/>
					<div className="mt-8 mb-4">
						{serviceData.length <= 0 ? (
							<h1 className="m-auto text-gray-600 text-3xl">
								{t('No Services Created')}
							</h1>
						) : (
							<>
								{serviceData[selectedTab] && (
									<EditService
										editable={editable}
										deletable={deletable}
										service={serviceData[selectedTab]}
									/>
								)}
							</>
						)}
					</div>
				</>
			)}
		</div>
	);
};

export default Services;
