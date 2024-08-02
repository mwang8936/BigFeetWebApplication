import { useNavigate } from 'react-router-dom';
import { MutationProp, QueryProp } from './props.hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	addService,
	deleteService,
	getServices,
	updateService,
} from '../../service/service.service';
import { useTranslation } from 'react-i18next';
import {
	AddServiceRequest,
	UpdateServiceRequest,
} from '../../models/requests/Service.Request.Model';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const servicesQueryKey = 'services';

export const useServicesQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: [servicesQueryKey],
		queryFn: () => getServices(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateServiceMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { serviceId: number; request: UpdateServiceRequest }) =>
			updateService(navigate, data.serviceId, data.request),
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

export const useAddServiceMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: AddServiceRequest }) =>
			addService(navigate, data.request),
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
			if (context)
				errorToast(context.toastId, t('Failed to Add Service'), error.message);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteServiceMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { serviceId: number }) =>
			deleteService(navigate, data.serviceId),
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
