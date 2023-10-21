import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import {
	AddCustomerRequest,
	UpdateCustomerRequest,
} from '../models/requests/Customer.Request.Model';
import { customerPath } from '../constants/api.constants';

export async function getCustomers(navigate: NavigateFunction) {
	return authorizedRequest(navigate, `${customerPath}`, 'get');
}

export async function getCustomer(
	navigate: NavigateFunction,
	phone_number: number
) {
	return authorizedRequest(
		navigate,
		`${customerPath}/${phone_number}`,
		'get'
	);
}

export async function updateCustomer(
	navigate: NavigateFunction,
	phone_number: number,
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
	phone_number: number
) {
	return authorizedRequest(
		navigate,
		`${customerPath}/${phone_number}`,
		'delete'
	);
}
