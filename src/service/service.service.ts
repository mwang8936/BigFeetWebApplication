import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import {
	AddServiceRequest,
	UpdateServiceRequest,
} from '../models/requests/Service.Request.Model';
import { servicePath } from '../constants/api.constants';

export async function getServices(navigate: NavigateFunction) {
	return authorizedRequest(navigate, `${servicePath}`, 'get');
}

export async function getService(
	navigate: NavigateFunction,
	service_id: number
) {
	return authorizedRequest(navigate, `${servicePath}/${service_id}`, 'get');
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
	return authorizedRequest(
		navigate,
		`${servicePath}/${service_id}`,
		'delete'
	);
}
