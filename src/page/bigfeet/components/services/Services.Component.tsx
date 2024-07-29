import { FC, useState } from 'react';
import EditService from './components/EditService.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';
import { Permissions } from '../../../../models/enums.ts';
import { addService } from '../../../../service/service.service.ts';
import { useNavigate } from 'react-router-dom';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import ERRORS from '../../../../constants/error.constants.ts';
import AddServiceModal from '../miscallaneous/modals/service/AddServiceModal.Component.tsx';
import { AddServiceRequest } from '../../../../models/requests/Service.Request.Model.ts';
import { useTranslation } from 'react-i18next';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../utils/toast.utils.tsx';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import Service from '../../../../models/Service.Model.ts';
import Loading from '../Loading.Component.tsx';
import Retry from '../Retry.Component.tsx';
import {
	useServicesQuery,
	useUserQuery,
} from '../../../../service/query/get-items.query.ts';
import User from '../../../../models/User.Model.ts';

const Services: FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openAddModal, setOpenAddModal] = useState<boolean>(false);

	const [retryingServiceQuery, setRetryingServiceQuery] =
		useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

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

	const serviceQuery = useServicesQuery({ gettable });

	const services: Service[] = serviceQuery.data || [];

	const isServiceLoading = serviceQuery.isLoading;

	const retryServiceQuery = serviceQuery.refetch;
	const isServiceError = serviceQuery.isError;
	const serviceError = serviceQuery.error;

	const isServicePaused = serviceQuery.isPaused;

	let tabs: string[] = [];
	if (!isServiceLoading && !isServiceError && !isServicePaused) {
		tabs = services.map((service) => service.service_name);
	}

	const addServiceMutation = useMutation({
		mutationFn: (data: { request: AddServiceRequest }) =>
			addService(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['services'] });
			successToast(context.toastId, t('Service Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(context.toastId, t('Failed to Add Service'), error.message);
		},
	});

	const onAdd = async (request: AddServiceRequest) => {
		addServiceMutation.mutate({ request });
	};

	const servicesElement =
		services.length !== 0 ? (
			<>
				{services[selectedTab] && (
					<EditService
						editable={editable}
						deletable={deletable}
						service={services[selectedTab]}
					/>
				)}
			</>
		) : (
			<h1 className="m-auto text-gray-600 text-3xl">
				{t('No Services Created')}
			</h1>
		);

	const tabsElement = (
		<>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={setSelectedTab}
			/>
			<div className="mt-8 mb-4 pr-4 overflow-auto">{servicesElement}</div>
		</>
	);

	const pausedElement = isServicePaused ? (
		<Retry
			retrying={retryingServiceQuery}
			error={'Network Connection Issue'}
			onRetry={() => {}}
			enabled={false}
		/>
	) : (
		tabsElement
	);

	const errorsElement = isServiceError ? (
		<Retry
			retrying={retryingServiceQuery}
			error={serviceError?.message as string}
			onRetry={() => {
				setRetryingServiceQuery(true);
				retryServiceQuery().finally(() => setRetryingServiceQuery(false));
			}}
			enabled={gettable}
		/>
	) : (
		pausedElement
	);

	const permissionsElement = !gettable ? (
		<h1 className="m-auto text-gray-600 text-3xl">
			{t(ERRORS.service.permissions.get)}
		</h1>
	) : (
		errorsElement
	);

	const isLoadingElement = isServiceLoading ? <Loading /> : permissionsElement;

	return (
		<>
			<div className="non-sidebar">
				<div className="py-4 h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
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
				{isLoadingElement}
			</div>
			<AddServiceModal
				open={openAddModal}
				setOpen={setOpenAddModal}
				creatable={creatable}
				onAddService={onAdd}
			/>
		</>
	);
};

export default Services;
