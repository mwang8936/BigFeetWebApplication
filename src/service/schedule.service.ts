import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { schedulePath } from '../constants/api.constants';

import { GetSchedulesParam } from '../models/params/Schedule.Param';

import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../models/requests/Schedule.Request.Model';

export async function getSchedules(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetSchedulesParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${schedulePath}`,
		'get',
		undefined,
		params
	);
}

export async function getSchedule(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	date: Date,
	employee_id: number
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${schedulePath}/${date.toISOString()}/employee/${employee_id}`,
		'get'
	);
}

export async function updateSchedule(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	date: Date,
	employee_id: number,
	request: UpdateScheduleRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${schedulePath}/${date.toISOString()}/employee/${employee_id}`,
		'patch',
		request
	);
}

export async function addSchedule(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddScheduleRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${schedulePath}`,
		'post',
		request
	);
}

export async function deleteSchedule(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	date: Date,
	employee_id: number
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${schedulePath}/${date.toISOString()}/employee/${employee_id}`,
		'delete'
	);
}
