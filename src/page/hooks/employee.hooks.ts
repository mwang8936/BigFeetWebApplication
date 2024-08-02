import { useNavigate } from 'react-router-dom';
import { MutationProp, QueryProp } from './props.hooks';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import {
	addEmployee,
	deleteEmployee,
	getEmployees,
	updateEmployee,
} from '../../service/employee.service';
import { useTranslation } from 'react-i18next';
import {
	AddEmployeeRequest,
	UpdateEmployeeRequest,
} from '../../models/requests/Employee.Request.Model';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';
import { userQueryKey } from './profile.hooks';
import { useLogout } from './authentication.hooks';

export const employeesQueryKey = 'employees';

export const useEmployeesQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: [employeesQueryKey],
		queryFn: () => getEmployees(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateEmployeeMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			employeeId: number;
			request: UpdateEmployeeRequest;
			userId: number;
		}) => updateEmployee(navigate, data.employeeId, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Employee...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });

			if (variables.employeeId === variables.userId)
				queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			successToast(context.toastId, t('Employee Updated Successfully'));
		},
		onError: (error, _variables, context) => {
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

export const useAddEmployeeMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: AddEmployeeRequest }) =>
			addEmployee(navigate, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Employee...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			successToast(context.toastId, t('Employee Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(context.toastId, t('Failed to Add Employee'), error.message);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteEmployeeMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const logout = useLogout();

	return useMutation({
		mutationFn: (data: { employeeId: number; userId: number }) =>
			deleteEmployee(navigate, data.employeeId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Employee...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });

			if (variables.employeeId === variables.userId) logout();

			successToast(context.toastId, t('Employee Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
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
