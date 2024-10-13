import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { acupunctureReportPath } from '../constants/api.constants';

import AcupunctureReport from '../models/Acupuncture-Report.Model';

import { GetAcupunctureReportsParam } from '../models/params/Acupuncture-Report.Param';

import {
	AddAcupunctureReportRequest,
	UpdateAcupunctureReportRequest,
} from '../models/requests/Acupuncture-Report.Request.Model';

export async function getAcupunctureReports(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetAcupunctureReportsParam
): Promise<AcupunctureReport[]> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${acupunctureReportPath}`,
		'get',
		undefined,
		params
	);
}

export async function getAcupunctureReport(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	employee_id: number
): Promise<AcupunctureReport> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${acupunctureReportPath}/${year}/${month}/employee/${employee_id}`,
		'get'
	);
}

export async function updateAcupunctureReport(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	employee_id: number,
	request: UpdateAcupunctureReportRequest
): Promise<AcupunctureReport> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${acupunctureReportPath}/${year}/${month}/employee/${employee_id}`,
		'patch',
		request
	);
}

export async function addAcupunctureReport(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddAcupunctureReportRequest
): Promise<AcupunctureReport> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${acupunctureReportPath}`,
		'post',
		request
	);
}

export async function deleteAcupunctureReport(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	employee_id: number
): Promise<AcupunctureReport> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${acupunctureReportPath}/${year}/${month}/employee/${employee_id}`,
		'delete'
	);
}
