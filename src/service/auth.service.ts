import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import { LoginRequest } from '../models/requests/Login.Request.Model';

import BASE_API_URL, {
	authenticatePath,
	loginPath,
	tokenKey,
	userKey,
} from '../constants/api.constants';

export function login(request: LoginRequest) {
	const config: AxiosRequestConfig = {
		method: 'post',
		baseURL: BASE_API_URL,
		url: loginPath,
		data: request,
	};
	return axios(config);
}

export async function authenticate(
	setAuthentication: (authenticated: boolean) => void
) {
	const accessToken = Cookies.get(tokenKey);
	if (accessToken) {
		const config: AxiosRequestConfig = {
			method: 'post',
			baseURL: BASE_API_URL,
			url: authenticatePath,
			headers: { Authorization: `Bearer ${accessToken}` },
		};
		console.log('Login Request:', config);

		axios(config)
			.then((response) => {
				console.log('Login Response:', response);

				setAuthentication(true);
			})
			.catch((error: AxiosError) => {
				console.error('Error logging in:', error);

				setAuthentication(false);

				const message = onError(error);
				throw new Error(message);
			});
	} else {
		setAuthentication(false);
	}
}

function onError(error: AxiosError) {
	if (error.response) {
		const responseData: any = error.response.data;
		if (responseData) {
			return `${responseData.error}: ${responseData.messages}`;
		} else {
			return error.response.statusText;
		}
	} else {
		return error.message || 'An unidentified error occurred.';
	}
}

export function logout(setAuthentication: (authenticated: boolean) => void) {
	console.log('User logged out.');

	sessionStorage.removeItem(userKey);
	Cookies.remove(tokenKey);
	setAuthentication(false);
}
