import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { MutationProp } from './props.hooks';
import { schedulesQueryKey } from './schedule.hooks';

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

export const useUpdateVipPackageMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			serial: string;
			request: UpdateVipPackageRequest;
			originalDate: Date;
			newDate?: Date;
		}) => updateVipPackage(navigate, data.serial, data.request),
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

			successToast(context.toastId, t('Vip Package Updated Successfully'));
		},
		onError: (error, _variables, context) => {
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

export const useAddVipPackageMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: AddVipPackageRequest }) =>
			addVipPackage(navigate, data.request),
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

			successToast(context.toastId, t('Vip Package Added Successfully'));
		},
		onError: (error, _variables, context) => {
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

export const useDeleteVipPackageMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { serial: string; date: Date }) =>
			deleteVipPackage(navigate, data.serial),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Vip Package...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});
			successToast(context.toastId, t('Vip Package Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
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
