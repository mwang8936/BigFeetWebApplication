import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

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
	const navigate = useNavigate();

	return useQuery({
		queryKey: [schedulesQueryKey, formatDateToQueryKey(date)],
		queryFn: () => {
			if (gettable) {
				const params: GetSchedulesParam = {
					start: date,
					end: date,
				};

				return getSchedules(navigate, params);
			} else {
				return getProfileSchedules(navigate);
			}
		},
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateScheduleMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: {
			date: Date;
			employeeId: number;
			request: UpdateScheduleRequest;
		}) => updateSchedule(navigate, data.date, data.employeeId, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});

			successToast(context.toastId, t('Schedule Updated Successfully'));
		},
		onError: (error, _variables, context) => {
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

export const useAddScheduleMutation = ({ setLoading }: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { request: AddScheduleRequest }) =>
			addSchedule(navigate, data.request),
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

			successToast(context.toastId, t('Schedule Added Successfully'));
		},
		onError: (error, _variables, context) => {
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
}: MutationProp) => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	return useMutation({
		mutationFn: (data: { date: Date }) =>
			signProfileSchedule(navigate, data.date),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Signing Schedule...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [schedulesQueryKey, formatDateToQueryKey(variables.date)],
			});

			successToast(context.toastId, t('Schedule Signed Successfully'));
		},
		onError: (error, _variables, context) => {
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
