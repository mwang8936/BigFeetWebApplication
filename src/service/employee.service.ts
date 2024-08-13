import { QueryClient } from '@tanstack/react-query';

import { i18n } from 'i18next';

import authorizedRequest from './base.service';

import { employeePath } from '../constants/api.constants';

import {
	GetEmployeeParam,
	GetEmployeesParam,
} from '../models/params/Employee.Param';

import {
	AddEmployeeRequest,
	UpdateEmployeeRequest,
} from '../models/requests/Employee.Request.Model';

export async function getEmployees(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	params?: GetEmployeesParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${employeePath}`,
		'get',
		undefined,
		params
	);
}

export async function getEmployee(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	employee_id: number,
	params?: GetEmployeeParam
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${employeePath}/${employee_id}`,
		'get',
		undefined,
		params
	);
}

export async function updateEmployee(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	employee_id: number,
	request: UpdateEmployeeRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`employee/${employee_id}`,
		'patch',
		request,
		undefined,
		socket_id
	);
}

export async function addEmployee(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	request: AddEmployeeRequest,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${employeePath}`,
		'post',
		request,
		undefined,
		socket_id
	);
}

export async function deleteEmployee(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	employee_id: number,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${employeePath}/${employee_id}`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
}

export async function recoverEmployee(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	employee_id: number,
	socket_id?: string
) {
	return authorizedRequest(
		i18n,
		queryClient,
		setAuthentication,
		`${employeePath}/${employee_id}/recover`,
		'delete',
		undefined,
		undefined,
		socket_id
	);
}
