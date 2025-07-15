import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { profilePath } from '../constants/api.constants';

import AcupunctureReport from '../models/Acupuncture-Report.Model';
import Payroll from '../models/Payroll.Model';
import Schedule from '../models/Schedule.Model';

import {
	GetProfileAcupunctureReportsParam,
	GetProfilePayrollsParam,
	GetProfileSchedulesParam,
} from '../models/params/Profile.Param';

import {
	ChangeProfilePasswordRequest,
	LogoutRequest,
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

export async function getProfileAcupunctureReports(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetProfileAcupunctureReportsParam
): Promise<AcupunctureReport[]> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/acupuncture-report`,
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

export async function logout(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: LogoutRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/logout`,
		'post',
		request
	);
}
