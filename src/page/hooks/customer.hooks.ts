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
	searchCustomer,
	updateCustomer,
} from '../../service/customer.service';

import {
	GetCustomersParam,
	SearchCustomerParam,
} from '../../models/params/Customer.Param';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const customersQueryKey = 'customers';
export const DEFAULT_PAGE_SIZE = 50;

export const usePrefetchCustomersQuery = () => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	const defaultParams: GetCustomersParam = {
		page: 1,
		page_size: DEFAULT_PAGE_SIZE,
	};

	const prefetchCustomers = async () =>
		queryClient.prefetchQuery({
			queryKey: [customersQueryKey, defaultParams],
			queryFn: () =>
				getCustomers(i18n, queryClient, setAuthentication, defaultParams),
		});

	return prefetchCustomers;
};

export interface CustomersQueryProp extends QueryProp {
	params?: GetCustomersParam;
}

export const useCustomersQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
	params,
}: CustomersQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [customersQueryKey, params],
		queryFn: () => getCustomers(i18n, queryClient, setAuthentication, params),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export interface SearchCustomerQueryProp {
	gettable: boolean;
	params: SearchCustomerParam | null;
}

export const searchCustomerQueryKey = 'searchCustomer';

export const useSearchCustomerQuery = ({
	gettable,
	params,
}: SearchCustomerQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [searchCustomerQueryKey, params],
		queryFn: () =>
			searchCustomer(i18n, queryClient, setAuthentication, params!),
		enabled: gettable && params !== null,
		staleTime: 0,
		gcTime: 0,
	});
};

export const useUpdateCustomerMutation = ({
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

			if (onSuccess) onSuccess();

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
	onSuccess,
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

			if (onSuccess) onSuccess();

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
	onSuccess,
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

			if (onSuccess) onSuccess();

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
