import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useLogout } from './authentication.hooks';
import { userQueryKey } from './profile.hooks';
import { MutationProp, QueryProp } from './props.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import {
	AddEmployeeRequest,
	UpdateEmployeeRequest,
} from '../../models/requests/Employee.Request.Model';

import {
	addEmployee,
	deleteEmployee,
	getEmployees,
	updateEmployee,
} from '../../service/employee.service';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const employeesQueryKey = 'employees';

export const usePrefetchEmployeesQuery = () => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	const prefetchEmployees = async () =>
		queryClient.prefetchQuery({
			queryKey: [employeesQueryKey],
			queryFn: () => getEmployees(i18n, queryClient, setAuthentication),
		});

	return prefetchEmployees;
};

export const useEmployeesQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [employeesQueryKey],
		queryFn: () => getEmployees(i18n, queryClient, setAuthentication),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateEmployeeMutation = ({
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
			employeeId: number;
			request: UpdateEmployeeRequest;
			userId: number;
		}) =>
			updateEmployee(
				i18n,
				queryClient,
				setAuthentication,
				data.employeeId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Employee...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });

			if (variables.employeeId === variables.userId)
				queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Employee Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Employee'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddEmployeeMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddEmployeeRequest }) =>
			addEmployee(i18n, queryClient, setAuthentication, data.request, socketId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Employee...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Employee Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(context.toastId, t('Failed to Add Employee'), error.message);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteEmployeeMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	const logout = useLogout();

	return useMutation({
		mutationFn: (data: { employeeId: number; userId: number }) =>
			deleteEmployee(
				i18n,
				queryClient,
				setAuthentication,
				data.employeeId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Employee...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Employee Deleted Successfully'));

			if (variables.employeeId === variables.userId) logout();
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Employee'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
