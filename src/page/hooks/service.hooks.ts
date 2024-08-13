import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

import { useAuthenticationContext } from '../../App';

import {
	AddServiceRequest,
	UpdateServiceRequest,
} from '../../models/requests/Service.Request.Model';

import {
	addService,
	deleteService,
	getServices,
	updateService,
} from '../../service/service.service';

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

export const useServicesQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [servicesQueryKey],
		queryFn: () => getServices(i18n, queryClient, setAuthentication),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateServiceMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { serviceId: number; request: UpdateServiceRequest }) =>
			updateService(
				i18n,
				queryClient,
				setAuthentication,
				data.serviceId,
				data.request
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });

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
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { request: AddServiceRequest }) =>
			addService(i18n, queryClient, setAuthentication, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Adding Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			if (setLoading) setLoading(true);

			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
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

export const useDeleteServiceMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { serviceId: number }) =>
			deleteService(i18n, queryClient, setAuthentication, data.serviceId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Service...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [servicesQueryKey] });
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
