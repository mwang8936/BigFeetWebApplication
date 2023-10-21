import axios, { AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import BASE_API_URL from '../constants/api.constants';

import { LoginRequest } from '../models/requests/Login.Request.Model';

export function login(request: LoginRequest) {
	const config: AxiosRequestConfig = {
		method: 'post',
		baseURL: BASE_API_URL,
		url: 'login',
		data: request,
	};
	return axios(config);
}

export async function authenticate(
	setAuthentication: (authenticated: boolean) => void
) {
	const accessToken = Cookies.get('accessToken');
	if (accessToken) {
		const config: AxiosRequestConfig = {
			method: 'post',
			baseURL: BASE_API_URL,
			url: 'authenticate',
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		axios(config)
			.then(() => setAuthentication(true))
			.catch(() => setAuthentication(false));
	} else {
		setAuthentication(false);
	}
}

export function logout(setAuthentication: (authenticated: boolean) => void) {
	sessionStorage.removeItem('user');
	Cookies.remove('accessToken');
	setAuthentication(false);
}
