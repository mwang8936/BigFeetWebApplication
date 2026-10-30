import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import BASE_API_URL, {
	authenticatePath,
	loginPath,
	tokenKey,
} from '../constants/api.constants';

import { LoginRequest } from '../models/requests/Login.Request.Model';

import { parseDateString } from '../utils/date.utils';

export function login(request: LoginRequest) {
	const config: AxiosRequestConfig = {
		method: 'post',
		baseURL: BASE_API_URL,
		url: loginPath,
		data: request,
		withCredentials: true,
	};

	return axios(config)
		.then((response) => {
			if (import.meta.env.VITE_ENV === 'development')
				console.log('Login Response:', response);

			return parseData(response.data);
		})
		.catch((error: AxiosError) => {
			if (import.meta.env.VITE_ENV === 'development')
				console.error('Error logging in:', error);

			const message = onError(error);
			if (typeof message === 'string') throw new Error(message);
		});
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

		if (import.meta.env.VITE_ENV === 'development')
			console.log('Login Request:', config);

		axios(config)
			.then((response) => {
				if (import.meta.env.VITE_ENV === 'development')
					console.log('Login Response:', response);

				setAuthentication(true);
			})
			.catch((error: AxiosError) => {
				if (import.meta.env.VITE_ENV === 'development')
					console.error('Error logging in:', error);

				setAuthentication(false);

				const message = onError(error);
				throw new Error(message);
			});
	} else {
		setAuthentication(false);
	}
}

function parseData(data: any) {
	if (data) {
		if (Array.isArray(data)) {
			data.map((object) => parseData(object));
		} else {
			Object.keys(data).forEach((key) => {
				const property = data[key];
				if (typeof property === 'string') {
					// Only write back converted values: arrays of plain strings (e.g.
					// permissions) recurse into here as strings, whose characters are
					// read only.
					const parsed = parseDateString(property);
					if (parsed instanceof Date) data[key] = parsed;
				} else if (typeof property === 'object') {
					data[key] = parseData(property);
				}
			});
		}
	}
	return data;
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
