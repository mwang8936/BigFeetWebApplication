import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { customersQueryKey } from './customer.hooks';
import { payrollsQueryKey } from './payroll.hooks';
import { MutationProp } from './props.hooks';
import { schedulesQueryKey } from './schedule.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import {
	AddReservationRequest,
	UpdateReservationRequest,
} from '../../models/requests/Reservation.Request.Model';

import {
	addReservation,
	deleteReservation,
	updateReservation,
} from '../../service/reservation.service';

import { formatDateToQueryKey } from '../../utils/string.utils';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const useUpdateReservationMutation = ({
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
			reservationId: number;
			request: UpdateReservationRequest;
			originalDate: Date;
			newDate?: Date;
		}) =>
			updateReservation(
				i18n,
				queryClient,
				setAuthentication,
				data.reservationId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Reservation...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					schedulesQueryKey,
					formatDateToQueryKey(variables.originalDate),
				],
			});

			queryClient.invalidateQueries({
				queryKey: [
					payrollsQueryKey,
					variables.originalDate.getFullYear(),
					variables.originalDate.getMonth() + 1,
				],
			});

			if (variables.newDate) {
				queryClient.invalidateQueries({
					queryKey: [
						schedulesQueryKey,
						formatDateToQueryKey(variables.newDate),
					],
				});

				queryClient.invalidateQueries({
					queryKey: [
						payrollsQueryKey,
						variables.newDate.getFullYear(),
						variables.newDate.getMonth() + 1,
					],
				});
			}
			if (
				variables.request.phone_number ||
				variables.request.customer_name ||
				variables.request.notes
			) {
				queryClient.invalidateQueries({ queryKey: [customersQueryKey] });
			}

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Reservation Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Reservation'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddReservationMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddReservationRequest }) =>
			addReservation(
				i18n,
				queryClient,
				setAuthentication,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Reservation...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					schedulesQueryKey,
					formatDateToQueryKey(variables.request.reserved_date),
				],
			});

			queryClient.invalidateQueries({
				queryKey: [
					payrollsQueryKey,
					variables.request.reserved_date.getFullYear(),
					variables.request.reserved_date.getMonth() + 1,
				],
			});

			if (
				variables.request.phone_number ||
				variables.request.customer_name ||
				variables.request.notes
			) {
				queryClient.invalidateQueries({ queryKey: [customersQueryKey] });
			}

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Reservation Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Add Reservation'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteReservationMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { reservationId: number; date: Date }) =>
			deleteReservation(
				i18n,
				queryClient,
				setAuthentication,
				data.reservationId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Reservation...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});

			queryClient.invalidateQueries({
				queryKey: [
					payrollsQueryKey,
					variables.date.getFullYear(),
					variables.date.getMonth() + 1,
				],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Reservation Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Reservation'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
