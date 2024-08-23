import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

import { useSocketIdContext } from '../bigfeet/BigFeet.Page';
import { useAuthenticationContext } from '../../App';

import { GetSchedulesParam } from '../../models/params/Schedule.Param';

import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../../models/requests/Schedule.Request.Model';

import {
	getProfileSchedules,
	signProfileSchedule,
} from '../../service/profile.service';
import {
	addSchedule,
	getSchedules,
	updateSchedule,
} from '../../service/schedule.service';

import { formatDateToQueryKey } from '../../utils/string.utils';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const schedulesQueryKey = 'schedules';

interface ScheduleQueryProp extends QueryProp {
	date: Date;
}

export const useSchedulesQuery = ({
	date,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: ScheduleQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [schedulesQueryKey, formatDateToQueryKey(date)],
		queryFn: () => {
			if (gettable) {
				const params: GetSchedulesParam = {
					start: date,
					end: date,
				};

				return getSchedules(i18n, queryClient, setAuthentication, params);
			} else {
				return getProfileSchedules(i18n, queryClient, setAuthentication);
			}
		},
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateScheduleMutation = ({
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
			date: Date;
			employeeId: number;
			request: UpdateScheduleRequest;
		}) =>
			updateSchedule(
				i18n,
				queryClient,
				setAuthentication,
				data.date,
				data.employeeId,
				data.request,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Schedule Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Schedule'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddScheduleMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { request: AddScheduleRequest }) =>
			addSchedule(i18n, queryClient, setAuthentication, data.request, socketId),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Adding Schedule...'));
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

			successToast(context.toastId, t('Schedule Added Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(context.toastId, t('Failed to Add Schedule'), error.message);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useSignProfileScheduleMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { socketId } = useSocketIdContext();

	return useMutation({
		mutationFn: (data: { date: Date }) =>
			signProfileSchedule(
				i18n,
				queryClient,
				setAuthentication,
				data.date,
				socketId
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Signing Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});

			if (onSuccess) onSuccess();

			successToast(context.toastId, t('Schedule Signed Successfully'));
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Sign Schedule'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
