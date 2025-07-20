import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';

import BASE_API_URL, {
	authenticatePath,
	loginPath,
	tokenKey,
} from '../constants/api.constants';

import { LoginRequest } from '../models/requests/Login.Request.Model';

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
					if (/^\d{4}-\d{2}-\d{2}$/.test(property)) {
						const [year, month, day] = property.split('-').map(Number);
						const date = new Date(year, month - 1, day);

						const pstDate = new Date(
							date.toLocaleString('en-US', { timeZone: 'America/Los_Angeles' })
						);

						data[key] = pstDate;
					} else if (
						/(\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.exec(
							property
						)
					)
						data[key] = new Date(property);
					else if (
						/((?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9])/.exec(property)
					) {
						const hours = parseInt(property.split(':')[0]);
						const minutes = parseInt(property.split(':')[1]);
						data[key] = new Date(1970, 1, 1, hours, minutes);
					}
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
