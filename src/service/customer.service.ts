import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { customerPath } from '../constants/api.constants';

import {
	GetCustomerParam,
	GetCustomersParam,
	SearchCustomerParam,
} from '../models/params/Customer.Param';

import {
	AddCustomerRequest,
	UpdateCustomerRequest,
} from '../models/requests/Customer.Request.Model';

export async function getCustomers(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetCustomersParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}`,
		'get',
		undefined,
		params
	);
}

export async function getCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	customer_id: number,
	params?: GetCustomerParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${customer_id}`,
		'get',
		undefined,
		params
	);
}

export async function searchCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params: SearchCustomerParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/search`,
		'get',
		undefined,
		params
	);
}

export async function updateCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	customer_id: number,
	request: UpdateCustomerRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${customer_id}`,
		'patch',
		request,
		undefined,
		socket_id
	);
}

export async function addCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddCustomerRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}`,
		'post',
		request,
		undefined,
		socket_id
	);
}

export async function deleteCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	customer_id: number,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${customer_id}`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
}

export async function recoverCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	customer_id: number,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${customer_id}/recover`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
}
