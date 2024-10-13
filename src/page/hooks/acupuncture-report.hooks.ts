import { useTranslation } from 'react-i18next';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';

import { MutationProp, QueryProp } from './props.hooks';

import { useAuthenticationContext } from '../../App';

import { GetAcupunctureReportsParam } from '../../models/params/Acupuncture-Report.Param';

import {
	AddAcupunctureReportRequest,
	UpdateAcupunctureReportRequest,
} from '../../models/requests/Acupuncture-Report.Request.Model';

import {
	addAcupunctureReport,
	getAcupunctureReports,
	updateAcupunctureReport,
} from '../../service/acupuncture-report.service';
import { getProfileAcupunctureReports } from '../../service/profile.service';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../utils/toast.utils';

export const acupunctureReportsQueryKey = 'acupuncture-reports';

interface AcupunctureReportQueryProp extends QueryProp {
	year: number;
	month: number;
}

export const useAcupunctureReportsQuery = ({
	year,
	month,
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: AcupunctureReportQueryProp) => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useQuery({
		queryKey: [acupunctureReportsQueryKey, year, month],
		queryFn: () => {
			const date = new Date(year, month - 1, 1);

			const params: GetAcupunctureReportsParam = {
				start: date,
				end: date,
			};

			if (gettable) {
				return getAcupunctureReports(
					i18n,
					queryClient,
					setAuthentication,
					params
				);
			} else {
				return getProfileAcupunctureReports(
					i18n,
					queryClient,
					setAuthentication,
					params
				);
			}
		},
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUpdateAcupunctureReportMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: {
			year: number;
			month: number;
			employeeId: number;
			request: UpdateAcupunctureReportRequest;
		}) =>
			updateAcupunctureReport(
				i18n,
				queryClient,
				setAuthentication,
				data.year,
				data.month,
				data.employeeId,
				data.request
			),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Updating Acupuncture Report...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [acupunctureReportsQueryKey, variables.year, variables.month],
			});

			if (onSuccess) onSuccess();

			successToast(
				context.toastId,
				t('Acupuncture Report Updated Successfully')
			);
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Acupuncture Report'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAddAcupunctureReportMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const { i18n, t } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { request: AddAcupunctureReportRequest }) =>
			addAcupunctureReport(i18n, queryClient, setAuthentication, data.request),
		onMutate: async () => {
			if (setLoading) setLoading(true);

			const toastId = createLoadingToast(t('Generating Acupuncture Report...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({
				queryKey: [
					acupunctureReportsQueryKey,
					variables.request.year,
					variables.request.month,
				],
			});

			if (onSuccess) onSuccess();

			successToast(
				context.toastId,
				t('Acupuncture Report Generated Successfully')
			);
		},
		onError: (error, _variables, context) => {
			if (setError) setError(error.message);

			if (context)
				errorToast(
					context.toastId,
					t('Failed to Generate Acupuncture Report'),
					error.message
				);
		},
		onSettled: async () => {
			if (setLoading) setLoading(false);
		},
	});
};
