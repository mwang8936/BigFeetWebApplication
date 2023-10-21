import { NavigateFunction } from 'react-router-dom';
import authorizedRequest from './base.service';
import { GetSchedulesParam } from '../models/params/Schedule.Param';
import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../models/requests/Schedule.Request.Model';
import { schedulePath } from '../constants/api.constants';

export async function getSchedules(
	navigate: NavigateFunction,
	params: GetSchedulesParam
) {
	return authorizedRequest(
		navigate,
		`${schedulePath}`,
		'get',
		undefined,
		params
	);
}

export async function getSchedule(
	navigate: NavigateFunction,
	date: Date,
	employee_id: number
) {
	return authorizedRequest(
		navigate,
		`${schedulePath}/${date}/employee/${employee_id}`,
		'get'
	);
}

export async function updateSchedule(
	navigate: NavigateFunction,
	date: Date,
	employee_id: number,
	request: UpdateScheduleRequest
) {
	return authorizedRequest(
		navigate,
		`${schedulePath}/${date}/employee/${employee_id}`,
		'patch',
		request
	);
}

export async function addSchedule(
	navigate: NavigateFunction,
	request: AddScheduleRequest
) {
	return authorizedRequest(navigate, `${schedulePath}`, 'post', request);
}

export async function deleteSchedule(
	navigate: NavigateFunction,
	date: Date,
	employee_id: number
) {
	return authorizedRequest(
		navigate,
		`${schedulePath}/${date}/employee/${employee_id}`,
		'delete'
	);
}
