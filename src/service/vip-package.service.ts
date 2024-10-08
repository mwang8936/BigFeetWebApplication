import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { vipPackagePath } from '../constants/api.constants';

import { GetVipPackagesParam } from '../models/params/Vip-Package.Param';

import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../models/requests/Vip-Package.Request.Model';

export async function getVipPackages(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetVipPackagesParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${vipPackagePath}`,
		'get',
		undefined,
		params
	);
}

export async function getVipPackage(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	serial: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${vipPackagePath}/${serial}`,
		'get'
	);
}

export async function updateVipPackage(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	serial: string,
	request: UpdateVipPackageRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${vipPackagePath}/${serial}`,
		'patch',
		request
	);
}

export async function addVipPackage(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddVipPackageRequest
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${vipPackagePath}`,
		'post',
		request
	);
}

export async function deleteVipPackage(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	serial: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${vipPackagePath}/${serial}`,
		'delete'
	);
}
