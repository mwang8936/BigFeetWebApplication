import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useLogout } from './authentication.hooks';
import { employeesQueryKey } from './employee.hooks';
import { MutationProp, QueryProp } from './props.hooks';

import { UpdateEmployeeRequest } from '../../models/requests/Employee.Request.Model';
import { UpdateProfileRequest } from '../../models/requests/Profile.Request.Model';

import { deleteEmployee, updateEmployee } from '../../service/employee.service';
import { getProfile, updateProfile } from '../../service/profile.service';

import { getLanguageFile } from '../../utils/i18n.utils';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const userQueryKey = 'user';

export const useUserQuery = ({
	gettable,
	staleTime,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: [userQueryKey],
		queryFn: () => getProfile(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateProfileMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			employeeId: number;
			request: UpdateEmployeeRequest;
		}) => updateEmployee(navigate, data.employeeId, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Profile...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Profile'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useUpdateProfileSettingsMutation = ({
	setLoading,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: UpdateProfileRequest }) =>
			updateProfile(navigate, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Profile...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			const updatedLanguage = variables.request.language;

			if (updatedLanguage)
				i18n.changeLanguage(getLanguageFile(updatedLanguage));

			successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Profile'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteProfileMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const logout = useLogout();

	return useMutation({
		mutationFn: (data: { userId: number }) =>
			deleteEmployee(navigate, data.userId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Profile...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			successToast(context.toastId, t('Profile Deleted Successfully'));

			logout();
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Profile'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
