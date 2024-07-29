import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import {
	GetCustomerParam,
	GetCustomersParam,
} from '../models/params/Customer.Param';

import {
	AddCustomerRequest,
	UpdateCustomerRequest,
} from '../models/requests/Customer.Request.Model';

import { customerPath } from '../constants/api.constants';

export async function getCustomers(
	navigate: NavigateFunction,
	params?: GetCustomersParam
) {
	return authorizedRequest(
		navigate,
		`${customerPath}`,
		'get',
		undefined,
		params
	);
}

export async function getCustomer(
	navigate: NavigateFunction,
	phone_number: string,
	params?: GetCustomerParam
) {
	return authorizedRequest(
		navigate,
		`${customerPath}/${phone_number}`,
		'get',
		undefined,
		params
	);
}

export async function updateCustomer(
	navigate: NavigateFunction,
	phone_number: string,
	request: UpdateCustomerRequest
) {
	return authorizedRequest(
		navigate,
		`${customerPath}/${phone_number}`,
		'patch',
		request
	);
}

export async function addCustomer(
	navigate: NavigateFunction,
	request: AddCustomerRequest
) {
	return authorizedRequest(navigate, `${customerPath}`, 'post', request);
}

export async function deleteCustomer(
	navigate: NavigateFunction,
	phone_number: string
) {
	return authorizedRequest(
		navigate,
		`${customerPath}/${phone_number}`,
		'delete'
	);
}

export async function recoverCustomer(
	navigate: NavigateFunction,
	phone_number: string
) {
	return authorizedRequest(
		navigate,
		`${customerPath}/${phone_number}/recover`,
		'delete'
	);
}
