import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { customersQueryKey } from './customer.hooks';
import { MutationProp } from './props.hooks';
import { schedulesQueryKey } from './schedule.hooks';

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
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

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
				data.request
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
			if (variables.newDate) {
				queryClient.invalidateQueries({
					queryKey: [
						schedulesQueryKey,
						formatDateToQueryKey(variables.newDate),
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
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { request: AddReservationRequest }) =>
			addReservation(i18n, queryClient, setAuthentication, data.request),
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
			if (
				variables.request.phone_number ||
				variables.request.customer_name ||
				variables.request.notes
			) {
				queryClient.invalidateQueries({ queryKey: [customersQueryKey] });
			}

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
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { reservationId: number; date: Date }) =>
			deleteReservation(
				i18n,
				queryClient,
				setAuthentication,
				data.reservationId
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
