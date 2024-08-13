import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { profilePath } from '../constants/api.constants';

import { UpdateProfileRequest } from '../models/requests/Profile.Request.Model';

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
	setAuthentication: (authenticated: boolean) => void
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/schedule`,
		'get'
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

export async function signProfileSchedule(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	date: Date
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${profilePath}/sign/${date.toISOString()}`,
		'patch'
	);
}
