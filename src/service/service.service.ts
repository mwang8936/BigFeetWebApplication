import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { servicePath } from '../constants/api.constants';

import {
	GetServiceParam,
	GetServicesParam,
} from '../models/params/Service.Param';

import {
	AddServiceRequest,
	UpdateServiceRequest,
} from '../models/requests/Service.Request.Model';

export async function getServices(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetServicesParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}`,
		'get',
		undefined,
		params
	);
}

export async function getService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	params?: GetServiceParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'get',
		undefined,
		params
	);
}

export async function updateService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	request: UpdateServiceRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'patch',
		request
	);
}

export async function addService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddServiceRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}`,
		'post',
		request
	);
}

export async function deleteService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'delete'
	);
}

export async function recoverService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}/recover`,
		'delete'
	);
}
