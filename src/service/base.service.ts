import { QueryClient } from '@tanstack/react-query';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { parseDateString } from '../utils/date.utils';

import { i18n } from 'i18next';

import Cookies from 'js-cookie';

import BASE_API_URL, {
	refreshPath,
	tokenKey,
} from '../constants/api.constants';

import { Language } from '../models/enums';

import { getLanguageFile } from '../utils/i18n.utils';

export default async function authorizedRequest(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	url: string,
	method: string,
	data?: any,
	params?: any,
	socket_id?: string
) {
	const accessToken = Cookies.get(tokenKey);

	const requestData = data || {};

	const config: AxiosRequestConfig = {
		method,
		baseURL: BASE_API_URL,
		url,
		headers: { Authorization: `Bearer ${accessToken}` },
		data: requestData,
		params,
	};

	if (socket_id && config.headers) {
		config.headers['x-socket-id'] = socket_id;
	}

	if (import.meta.env.VITE_ENV === 'development')
		console.log('API Request:', config);

	return axios(config)
		.then((response) => {
			if (import.meta.env.VITE_ENV === 'development')
				console.log('API Response:', response);

			return parseData(response.data);
		})
		.catch(async (error: AxiosError) => {
			if (import.meta.env.VITE_ENV === 'development')
				console.error('API Error:', error);

			const message = await onError(
				error,
				i18n,
				queryClient,
				setAuthentication
			);
			if (typeof message === 'string') throw new Error(message);
		});
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

async function onError(
	error: AxiosError,
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void
): Promise<string> {
	if (error.response) {
		const responseData: any = error.response.data;
		if (error.response.status === 401) {
			try {
				const config: AxiosRequestConfig = {
					method: 'post',
					baseURL: BASE_API_URL,
					url: refreshPath,
					withCredentials: true,
				};
				const refreshResponse = await axios(config);

				const { accessToken } = refreshResponse.data;
				Cookies.set(tokenKey, accessToken);
				// TODO Retry the original request with the new access token
			} catch (refreshError) {
				i18n.changeLanguage(getLanguageFile(Language.ENGLISH));

				queryClient.clear();

				Cookies.remove(tokenKey);
				setAuthentication(false);

				return 'Access token invalid.';
			}
		}
		if (responseData) {
			return `${responseData.error}: ${responseData.messages}`;
		} else {
			return error.response.statusText;
		}
	} else {
		return error.message || 'An unidentified error occurred.';
	}
}
