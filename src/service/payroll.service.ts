import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { payrollPath } from '../constants/api.constants';

import { PayrollPart } from '../models/enums';
import Payroll from '../models/Payroll.Model';

import { GetPayrollsParam } from '../models/params/Payroll.Param';

import {
	AddPayrollRequest,
	UpdatePayrollRequest,
} from '../models/requests/Payroll.Request.Model';

export async function getPayrolls(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetPayrollsParam
): Promise<Payroll[]> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${payrollPath}`,
		'get',
		undefined,
		params
	);
}

export async function getPayroll(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number
): Promise<Payroll> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${payrollPath}/${year}/${month}/${part}/employee/${employee_id}`,
		'get'
	);
}

export async function updatePayroll(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number,
	request: UpdatePayrollRequest
): Promise<Payroll> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${payrollPath}/${year}/${month}/${part}/employee/${employee_id}`,
		'patch',
		request
	);
}

export async function addPayroll(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddPayrollRequest
): Promise<Payroll> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${payrollPath}`,
		'post',
		request
	);
}

export async function deletePayroll(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number
): Promise<Payroll> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${payrollPath}/${year}/${month}/${part}/employee/${employee_id}`,
		'delete'
	);
}

export async function refreshPayroll(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	year: number,
	month: number,
	part: PayrollPart,
	employee_id: number
): Promise<Payroll> {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${payrollPath}/refresh/${year}/${month}/${part}/employee/${employee_id}`,
		'patch'
	);
}
