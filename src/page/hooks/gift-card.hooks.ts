import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import { GetGiftCardsParam } from '../../models/params/Gift-Card.Param';

import {
	AddGiftCardRequest,
	UpdateGiftCardRequest,
} from '../../models/requests/GIft-Card.Request';

import {
	addGiftCard,
	deleteGiftCard,
	getGiftCards,
	updateGiftCard,
} from '../../service/gift-card.services';

import { formatDateToQueryKey } from '../../utils/string.utils';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const giftCardsQueryKey = 'gift-cards';

interface GiftCardQueryProp extends QueryProp {
	date: Date;
}

export const useGiftCardsQuery = ({
	date,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: GiftCardQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [giftCardsQueryKey, formatDateToQueryKey(date)],
		queryFn: () => {
			const params: GetGiftCardsParam = {
				start: date,
				end: date,
			};

			return getGiftCards(i18n, queryClient, setAuthentication, params);
		},
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateGiftCardMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: {
			giftCardId: string;
			request: UpdateGiftCardRequest;
			originalDate: Date;
			newDate?: Date;
		}) =>
			updateGiftCard(
				i18n,
				queryClient,
				setAuthentication,
				data.giftCardId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Gift Card...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					giftCardsQueryKey,
					formatDateToQueryKey(variables.originalDate),
				],
			});
			if (variables.newDate) {
				queryClient.invalidateQueries({
					queryKey: [
						giftCardsQueryKey,
						formatDateToQueryKey(variables.newDate),
					],
				});
			}

			successToast(context.toastId, t('Gift Card Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Gift Card'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddGiftCardMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddGiftCardRequest }) =>
			addGiftCard(i18n, queryClient, setAuthentication, data.request, socketId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Gift Card...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					giftCardsQueryKey,
					formatDateToQueryKey(variables.request.date),
				],
			});

			successToast(context.toastId, t('Gift Card Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Add Gift Card'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useDeleteGiftCardMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { giftCardId: string; date: Date }) =>
			deleteGiftCard(
				i18n,
				queryClient,
				setAuthentication,
				data.giftCardId,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Deleting Gift Card...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [giftCardsQueryKey, formatDateToQueryKey(variables.date)],
			});

			successToast(context.toastId, t('Gift Card Deleted Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Delete Gift Card'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
