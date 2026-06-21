import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { servicePath } from '../constants/api.constants';

import { Service, ServiceRecord } from '../models/Service.Model';

import {
	DeleteServiceParam,
	GetServiceParam,
	GetServicesParam,
	RecoverServiceParam,
} from '../models/params/Service.Param';

import {
	AddServiceRecordRequest,
	AddServiceRequest,
	DiscontinueServiceRequest,
	UpdateServiceRequest,
} from '../models/requests/Service.Request.Model';

function deserializeRecord(raw: any): ServiceRecord {
	return {
		...raw,
		valid_from: new Date(raw.valid_from),
		valid_to: raw.valid_to != null ? new Date(raw.valid_to) : undefined,
	};
}

function deserializeService(raw: any): Service {
	return {
		...raw,
		created_at: new Date(raw.created_at),
		updated_at: new Date(raw.updated_at),
		deleted_at: raw.deleted_at != null ? new Date(raw.deleted_at) : undefined,
		records: raw.records?.map(deserializeRecord),
	};
}

export async function getServices(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetServicesParam
): Promise<Service[]> {
	const raw: any[] = await authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}`,
		'get',
		undefined,
		params
	);
	return raw.map(deserializeService);
}

export async function getServiceRecords(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	date: Date
): Promise<ServiceRecord[]> {
	const raw: any[] = await authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/records/${encodeURIComponent(date.toISOString())}`,
		'get'
	);
	return raw.map(deserializeRecord);
}

export async function getService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	params?: GetServiceParam
): Promise<Service> {
	const raw = await authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'get',
		undefined,
		params
	);
	return deserializeService(raw);
}

export async function updateService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	request: UpdateServiceRequest,
	socket_id?: string
): Promise<Service> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'patch',
		request,
		undefined,
		socket_id
	);
}

export async function addService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddServiceRequest,
	socket_id?: string
): Promise<Service> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}`,
		'post',
		request,
		undefined,
		socket_id
	);
}

export async function addServiceRecord(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	request: AddServiceRecordRequest,
	socket_id?: string
): Promise<ServiceRecord | null> {
	const raw = await authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'post',
		request,
		undefined,
		socket_id
	);
	return raw ? deserializeRecord(raw) : null;
}

export async function continueService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	socket_id?: string
): Promise<Service> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}/continue`,
		'patch',
		undefined,
		undefined,
		socket_id
	);
}

export async function discontinueService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	request: DiscontinueServiceRequest,
	socket_id?: string
): Promise<Service> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}/discontinue`,
		'patch',
		request,
		undefined,
		socket_id
	);
}

export async function deleteService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	params?: DeleteServiceParam,
	socket_id?: string
): Promise<Service> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}`,
		'delete',
		undefined,
		params,
		socket_id
	);
}

export async function deleteServiceRecord(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	valid_from: Date,
	socket_id?: string
): Promise<ServiceRecord> {
	const raw = await authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}/record/${encodeURIComponent(valid_from.toISOString())}`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
	return deserializeRecord(raw);
}

export async function recoverService(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	service_id: number,
	params?: RecoverServiceParam,
	socket_id?: string
): Promise<Service> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${servicePath}/${service_id}/recover`,
		'delete',
		undefined,
		params,
		socket_id
	);
}
