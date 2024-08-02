import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import { customersQueryKey } from './customer.hooks';
import { MutationProp } from './props.hooks';
import { schedulesQueryKey } from './schedule.hooks';

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

export const useUpdateReservationMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			reservationId: number;
			request: UpdateReservationRequest;
			originalDate: Date;
			newDate?: Date;
		}) => updateReservation(navigate, data.reservationId, data.request),
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

export const useAddReservationMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: AddReservationRequest }) =>
			addReservation(navigate, data.request),
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

export const useDeleteReservationMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { reservationId: number; date: Date }) =>
			deleteReservation(navigate, data.reservationId),
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
