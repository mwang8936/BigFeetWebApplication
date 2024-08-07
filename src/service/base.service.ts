import { QueryClient } from '@tanstack/react-query';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { i18n } from 'i18next';

import Cookies from 'js-cookie';

import BASE_API_URL, { tokenKey } from '../constants/api.constants';

import { Language } from '../models/enums';

import { getLanguageFile } from '../utils/i18n.utils';

export default async function authorizedRequest(
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void,
	url: string,
	method: string,
	data?: any,
	params?: any
) {
	const accessToken = Cookies.get(tokenKey);

	const config: AxiosRequestConfig = {
		method: method,
		baseURL: BASE_API_URL,
		url: url,
		headers: { Authorization: `Bearer ${accessToken}` },
		data: data,
		params: params,
	};
	console.log('API Request:', config);

	return axios(config)
		.then((response) => {
			console.log('API Response:', response);
			return parseData(response.data);
		})
		.catch((error: AxiosError) => {
			console.error('API Error:', error);

			const message = onError(error, i18n, queryClient, setAuthentication);
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

function onError(
	error: AxiosError,
	i18n: i18n,
	queryClient: QueryClient,
	setAuthentication: (authenticated: boolean) => void
) {
	if (error.response) {
		const responseData: any = error.response.data;
		if (error.response.status === 401) {
			i18n.changeLanguage(getLanguageFile(Language.ENGLISH));

			queryClient.clear();

			Cookies.remove(tokenKey);
			setAuthentication(false);

			return 'Access token invalid.';
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
