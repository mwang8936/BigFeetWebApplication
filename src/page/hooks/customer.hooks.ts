import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import {
	AddCustomerRequest,
	UpdateCustomerRequest,
} from '../../models/requests/Customer.Request.Model';

import {
	addCustomer,
	deleteCustomer,
	getCustomers,
	updateCustomer,
} from '../../service/customer.service';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const customersQueryKey = 'customers';

export const usePrefetchCustomersQuery = () => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	const prefetchCustomers = async () =>
		queryClient.prefetchQuery({
			queryKey: [customersQueryKey],
			queryFn: () => getCustomers(i18n, queryClient, setAuthentication),
		});

	return prefetchCustomers;
};

export const useCustomersQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [customersQueryKey],
		queryFn: () => getCustomers(i18n, queryClient, setAuthentication),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateCustomerMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: {
			customerId: number;
			request: UpdateCustomerRequest;
		}) =>
			updateCustomer(
				i18n,
				queryClient,
				setAuthentication,
				data.customerId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Customer...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [customersQueryKey] });

			successToast(context.toastId, t('Customer Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Customer'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddCustomerMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddCustomerRequest }) =>
			addCustomer(i18n, queryClient, setAuthentication, data.request, socketId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Customer...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [customersQueryKey] });

			successToast(context.toastId, t('Customer Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(context.toastId, t('Failed to Add Customer'), error.message);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteCustomerMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { customerId: number }) =>
			deleteCustomer(
				i18n,
				queryClient,
				setAuthentication,
				data.customerId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Customer...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [customersQueryKey] });

			successToast(context.toastId, t('Customer Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Customer'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
