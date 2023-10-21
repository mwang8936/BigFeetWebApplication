import { NavigateFunction } from 'react-router-dom';

import authorizedRequest from './base.service';

import { UpdateProfileRequest } from '../models/requests/Profile.Request.Model';
import { profilePath } from '../constants/api.constants';

export async function getProfile(navigate: NavigateFunction) {
	return authorizedRequest(navigate, `${profilePath}`, 'get');
}

export async function getProfileSchedules(navigate: NavigateFunction) {
	return authorizedRequest(navigate, `${profilePath}/schedule`, 'get');
}

export async function updateProfile(
	navigate: NavigateFunction,
	request: UpdateProfileRequest
) {
	return authorizedRequest(navigate, `${profilePath}`, 'patch', request);
}
