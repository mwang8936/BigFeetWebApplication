import { NavigateFunction } from 'react-router-dom';

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
	navigate: NavigateFunction,
	params?: GetServicesParam
) {
	return authorizedRequest(
		navigate,
		`${servicePath}`,
		'get',
		undefined,
		params
	);
}

export async function getService(
	navigate: NavigateFunction,
	service_id: number,
	params?: GetServiceParam
) {
	return authorizedRequest(
		navigate,
		`${servicePath}/${service_id}`,
		'get',
		undefined,
		params
	);
}

export async function updateService(
	navigate: NavigateFunction,
	service_id: number,
	request: UpdateServiceRequest
) {
	return authorizedRequest(
		navigate,
		`${servicePath}/${service_id}`,
		'patch',
		request
	);
}

export async function addService(
	navigate: NavigateFunction,
	request: AddServiceRequest
) {
	return authorizedRequest(navigate, `${servicePath}`, 'post', request);
}

export async function deleteService(
	navigate: NavigateFunction,
	service_id: number
) {
	return authorizedRequest(navigate, `${servicePath}/${service_id}`, 'delete');
}

export async function recoverService(
	navigate: NavigateFunction,
	service_id: number
) {
	return authorizedRequest(
		navigate,
		`${servicePath}/${service_id}/recover`,
		'delete'
	);
}
