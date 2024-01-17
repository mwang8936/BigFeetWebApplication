import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../models/requests/Vip-Package.Request.Model';
import { vipPackagePath } from '../constants/api.constants';

export async function getVipPackages(navigate: NavigateFunction) {
	return authorizedRequest(navigate, `${vipPackagePath}`, 'get');
}

export async function getVipPackage(
	navigate: NavigateFunction,
	serial: string
) {
	return authorizedRequest(navigate, `${vipPackagePath}/${serial}`, 'get');
}

export async function updateVipPackage(
	navigate: NavigateFunction,
	serial: string,
	request: UpdateVipPackageRequest
) {
	return authorizedRequest(
		navigate,
		`${vipPackagePath}/${serial}`,
		'patch',
		request
	);
}

export async function addVipPackage(
	navigate: NavigateFunction,
	request: AddVipPackageRequest
) {
	return authorizedRequest(navigate, `${vipPackagePath}`, 'post', request);
}

export async function deleteVipPackage(
	navigate: NavigateFunction,
	serial: string
) {
	return authorizedRequest(navigate, `${vipPackagePath}/${serial}`, 'delete');
}
