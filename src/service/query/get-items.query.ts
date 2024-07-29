import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';

import { getCustomers } from '../customer.service';
import { getEmployees } from '../employee.service';
import { getProfile, getProfileSchedules } from '../profile.service';
import { getSchedules } from '../schedule.service';
import { getServices } from '../service.service';

import { GetSchedulesParam } from '../../models/params/Schedule.Param';

import { formatDateToQueryKey } from '../../utils/string.utils';

interface QueryProp {
	gettable: boolean;
	staleTime?: number; // In milliseconds
	refetchInterval?: number; // In milliseconds
	refetchIntervalInBackground?: boolean;
}

export const useCustomersQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: ['customers'],
		queryFn: () => getCustomers(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useEmployeesQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: ['employees'],
		queryFn: () => getEmployees(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

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
		queryKey: ['schedules', formatDateToQueryKey(date)],
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

export const useServicesQuery = ({
	gettable,
	staleTime = 1000 * 30,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: ['services'],
		queryFn: () => getServices(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};

export const useUserQuery = ({
	gettable,
	staleTime,
	refetchInterval,
	refetchIntervalInBackground,
}: QueryProp) => {
	const navigate = useNavigate();

	return useQuery({
		queryKey: ['user'],
		queryFn: () => getProfile(navigate),
		enabled: gettable,
		staleTime,
		refetchInterval,
		refetchIntervalInBackground,
	});
};
