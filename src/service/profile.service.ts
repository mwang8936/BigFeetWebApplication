import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { profilePath } from '../constants/api.constants';

import Payroll from '../models/Payroll.Model';
import Schedule from '../models/Schedule.Model';

import {
	GetProfilePayrollsParam,
	GetProfileSchedulesParam,
} from '../models/params/Profile.Param';

import {
	ChangeProfilePasswordRequest,
	UpdateProfileRequest,
} from '../models/requests/Profile.Request.Model';

export async function getProfile(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}`,
		'get'
	);
}

export async function getProfileSchedules(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetProfileSchedulesParam
): Promise<Schedule[]> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/schedule`,
		'get',
		undefined,
		params
	);
}

export async function getProfilePayrolls(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetProfilePayrollsParam
): Promise<Payroll[]> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/payroll`,
		'get',
		undefined,
		params
	);
}

export async function updateProfile(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: UpdateProfileRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}`,
		'patch',
		request
	);
}

export async function changeProfilePassword(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: ChangeProfilePasswordRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/change_password`,
		'patch',
		request
	);
}

export async function signProfileSchedule(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	date: Date,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/sign/${date.toISOString()}`,
		'patch',
		undefined,
		undefined,
		socket_id
	);
}
