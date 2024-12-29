import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

import { useAuthenticationContext } from '../../App';

import { PayrollPart } from '../../models/enums';

import { GetPayrollsParam } from '../../models/params/Payroll.Param';

import {
	AddPayrollRequest,
	UpdatePayrollRequest,
} from '../../models/requests/Payroll.Request.Model';

import { getProfilePayrolls } from '../../service/profile.service';
import {
	addPayroll,
	getPayrolls,
	refreshPayroll,
	updatePayroll,
} from '../../service/payroll.service';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const payrollsQueryKey = 'payrolls';

interface PayrollQueryProp extends QueryProp {
	year: number;
	month: number;
}

export const usePayrollsQuery = ({
	year,
	month,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: PayrollQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [payrollsQueryKey, year, month],
		queryFn: () => {
			const date = new Date(year, month - 1, 1);

			const params: GetPayrollsParam = {
				start: date,
				end: date,
			};

			if (gettable) {
				return getPayrolls(i18n, queryClient, setAuthentication, params);
			} else {
				return getProfilePayrolls(i18n, queryClient, setAuthentication, params);
			}
		},
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdatePayrollMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: {
			year: number;
			month: number;
			part: PayrollPart;
			employeeId: number;
			request: UpdatePayrollRequest;
		}) =>
			updatePayroll(
				i18n,
				queryClient,
				setAuthentication,
				data.year,
				data.month,
				data.part,
				data.employeeId,
				data.request
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Payroll...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [payrollsQueryKey, variables.year, variables.month],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Payroll Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Payroll'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddPayrollMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { request: AddPayrollRequest }) =>
			addPayroll(i18n, queryClient, setAuthentication, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Generating Payroll...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					payrollsQueryKey,
					variables.request.year,
					variables.request.month,
				],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Payroll Generated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Generate Payroll'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useRefreshPayrollMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: {
			year: number;
			month: number;
			part: PayrollPart;
			employeeId: number;
		}) =>
			refreshPayroll(
				i18n,
				queryClient,
				setAuthentication,
				data.year,
				data.month,
				data.part,
				data.employeeId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Refreshing Payroll...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [payrollsQueryKey, variables.year, variables.month],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Payroll Refreshed Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Refresh Payroll'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
