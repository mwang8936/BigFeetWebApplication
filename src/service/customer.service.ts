import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { customerPath } from '../constants/api.constants';

import {
	GetCustomerParam,
	GetCustomersParam,
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
	phone_number: string,
	params?: GetCustomerParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${phone_number}`,
		'get',
		undefined,
		params
	);
}

export async function updateCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	phone_number: string,
	request: UpdateCustomerRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${phone_number}`,
		'patch',
		request
	);
}

export async function addCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddCustomerRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}`,
		'post',
		request
	);
}

export async function deleteCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	phone_number: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${phone_number}`,
		'delete'
	);
}

export async function recoverCustomer(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	phone_number: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${customerPath}/${phone_number}/recover`,
		'delete'
	);
}
