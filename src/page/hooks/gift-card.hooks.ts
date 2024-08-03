import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

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
	const navigate = useNavigate();

	return useQuery({
		queryKey: [giftCardsQueryKey, formatDateToQueryKey(date)],
		queryFn: () => {
			const params: GetGiftCardsParam = {
				start: date,
				end: date,
			};

			return getGiftCards(navigate, params);
		},
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateGiftCardMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			giftCardId: string;
			request: UpdateGiftCardRequest;
			originalDate: Date;
			newDate?: Date;
		}) => updateGiftCard(navigate, data.giftCardId, data.request),
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

export const useAddGiftCardMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: AddGiftCardRequest }) =>
			addGiftCard(navigate, data.request),
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

export const useDeleteGiftCardMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { giftCardId: string; date: Date }) =>
			deleteGiftCard(navigate, data.giftCardId),
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
