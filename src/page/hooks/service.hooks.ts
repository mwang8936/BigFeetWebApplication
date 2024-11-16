import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';
import { schedulesQueryKey } from './schedule.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import {
	DeleteServiceParam,
	GetServiceParam,
	GetServicesParam,
	RecoverServiceParam,
} from '../../models/params/Service.Param';

import {
	AddServiceRecordRequest,
	AddServiceRequest,
	DiscontinueServiceRequest,
	UpdateServiceRequest,
} from '../../models/requests/Service.Request.Model';

import {
	addService,
	addServiceRecord,
	continueService,
	deleteService,
	deleteServiceRecord,
	discontinueService,
	getService,
	getServiceRecords,
	getServices,
	recoverService,
	updateService,
} from '../../service/service.service';

import { formatDateToQueryKey } from '../../utils/string.utils';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const servicesQueryKey = 'services';

export const usePrefetchServicesQuery = () => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	const prefetchServices = async () =>
		queryClient.prefetchQuery({
			queryKey: [servicesQueryKey],
			queryFn: () => getServices(i18n, queryClient, setAuthentication),
		});

	return prefetchServices;
};

interface GetServicesQueryProp extends QueryProp {
	withDeleted?: boolean;
	withRelations?: boolean;
}

export const useServicesQuery = ({
	withDeleted = false,
	withRelations = false,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: GetServicesQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [servicesQueryKey],
		queryFn: () => {
			const params: GetServicesParam = {
				with_deleted: withDeleted,
				with_relations: withRelations,
			};
			return getServices(i18n, queryClient, setAuthentication, params);
		},
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

interface GetServiceQueryProp extends QueryProp {
	serviceId: number;
	withDeleted?: boolean;
	withRelations?: boolean;
}

export const useServiceQuery = ({
	serviceId,
	withDeleted = false,
	withRelations = false,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: GetServiceQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [servicesQueryKey, serviceId, { withDeleted, withRelations }],
		queryFn: () => {
			const params: GetServiceParam = {
				with_deleted: withDeleted,
				with_relations: withRelations,
			};

			return getService(
				i18n,
				queryClient,
				setAuthentication,
				serviceId,
				params
			);
		},
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

interface ServiceRecordQueryProp extends QueryProp {
	date: Date;
}

export const useServiceRecordsQuery = ({
	date,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: ServiceRecordQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [servicesQueryKey, formatDateToQueryKey(date)],
		queryFn: () =>
			getServiceRecords(i18n, queryClient, setAuthentication, date),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateServiceMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { serviceId: number; request: UpdateServiceRequest }) =>
			updateService(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddServiceMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddServiceRequest }) =>
			addService(i18n, queryClient, setAuthentication, data.request, socketId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(context.toastId, t('Failed to Add Service'), error.message);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddServiceRecordMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: {
			serviceId: number;
			request: AddServiceRecordRequest;
		}) =>
			addServiceRecord(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useContinueServiceMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { serviceId: number }) =>
			continueService(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDiscontinueServiceMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: {
			serviceId: number;
			request: DiscontinueServiceRequest;
		}) =>
			discontinueService(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteServiceMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { serviceId: number; params?: DeleteServiceParam }) =>
			deleteService(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.params,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteServiceRecordMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { serviceId: number; validFrom: Date }) =>
			deleteServiceRecord(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.validFrom,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useRecoverServiceMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { serviceId: number; params?: RecoverServiceParam }) =>
			recoverService(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.params,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Recovering Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [schedulesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Service Recovered Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Recover Service'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
