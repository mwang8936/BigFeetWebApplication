import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { useLogout } from './authentication.hooks';
import { employeesQueryKey } from './employee.hooks';
import { MutationProp, QueryProp } from './props.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

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
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [userQueryKey],
		queryFn: () => getProfile(i18n, queryClient, setAuthentication),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateProfileMutation = ({
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

			const toastId = createLoadingToast(t('Updating Profile...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [employeesQueryKey] });
			queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

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
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { request: UpdateProfileRequest }) =>
			updateProfile(i18n, queryClient, setAuthentication, data.request),
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

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

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

export const useDeleteProfileMutation = ({
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
		mutationFn: (data: { userId: number }) =>
			deleteEmployee(
				i18n,
				queryClient,
				setAuthentication,
				data.userId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Profile...'));
			return { toastId };
		},
		onSuccess: (_data, _variables, context) => {
			queryClient.invalidateQueries({ queryKey: [userQueryKey] });

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Profile Deleted Successfully'));

			logout();
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

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
