import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MutationProp } from './props.hooks';
import { schedulesQueryKey } from './schedule.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../models/requests/Vip-Package.Request.Model';

import {
	addVipPackage,
	deleteVipPackage,
	updateVipPackage,
} from '../../service/vip-package.service';

import { formatDateToQueryKey } from '../../utils/string.utils';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const useUpdateVipPackageMutation = ({
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
			vipPackageId: number;
			request: UpdateVipPackageRequest;
			originalDate: Date;
			newDate?: Date;
		}) =>
			updateVipPackage(
				i18n,
				queryClient,
				setAuthentication,
				data.vipPackageId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					schedulesQueryKey,
					formatDateToQueryKey(variables.originalDate),
				],
			});
			if (variables.newDate) {
				queryClient.invalidateQueries({
					queryKey: [
						schedulesQueryKey,
						formatDateToQueryKey(variables.newDate),
					],
				});
			}

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Vip Package Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Vip Package'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddVipPackageMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddVipPackageRequest }) =>
			addVipPackage(
				i18n,
				queryClient,
				setAuthentication,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					schedulesQueryKey,
					formatDateToQueryKey(variables.request.date),
				],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Vip Package Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Add Vip Package'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteVipPackageMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { vipPackageId: number; date: Date }) =>
			deleteVipPackage(
				i18n,
				queryClient,
				setAuthentication,
				data.vipPackageId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Vip Package Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Vip Package'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
