import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import {
	AddEmployeeRequest,
	UpdateEmployeeRequest,
} from '../models/requests/Employee.Request.Model';
import { employeePath } from '../constants/api.constants';

export async function getEmployees(navigate: NavigateFunction) {
	return authorizedRequest(navigate, `${employeePath}`, 'get');
}

export async function getEmployee(
	navigate: NavigateFunction,
	employee_id: number
) {
	return authorizedRequest(navigate, `${employeePath}/${employee_id}`, 'get');
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
