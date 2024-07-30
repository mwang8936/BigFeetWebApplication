import { NavigateFunction } from 'react-router-dom';

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
	navigate: NavigateFunction,
	params?: GetEmployeesParam
) {
	return authorizedRequest(
		navigate,
		`${employeePath}`,
		'get',
		undefined,
		params
	);
}

export async function getEmployee(
	navigate: NavigateFunction,
	employee_id: number,
	params?: GetEmployeeParam
) {
	return authorizedRequest(
		navigate,
		`${employeePath}/${employee_id}`,
		'get',
		undefined,
		params
	);
}

export async function updateEmployee(
	navigate: NavigateFunction,
	employee_id: number,
	request: UpdateEmployeeRequest
) {
	return authorizedRequest(
		navigate,
		`employee/${employee_id}`,
		'patch',
		request
	);
}

export async function addEmployee(
	navigate: NavigateFunction,
	request: AddEmployeeRequest
) {
	return authorizedRequest(navigate, `${employeePath}`, 'post', request);
}

export async function deleteEmployee(
	navigate: NavigateFunction,
	employee_id: number
) {
	return authorizedRequest(
		navigate,
		`${employeePath}/${employee_id}`,
		'delete'
	);
}

export async function recoverEmployee(
	navigate: NavigateFunction,
	employee_id: number
) {
	return authorizedRequest(
		navigate,
		`${employeePath}/${employee_id}/recover`,
		'delete'
	);
}
