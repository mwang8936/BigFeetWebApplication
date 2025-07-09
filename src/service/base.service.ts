import { QueryClient } from '@tanstack/react-query';

import axios, { AxiosError, AxiosRequestConfig } from 'axios';

import { DateTime } from 'luxon';

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
		.catch((error: AxiosError) => {
			if (import.meta.env.VITE_ENV === 'development')
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
					) {
						const parsed = DateTime.fromISO(property);
						if (parsed.isValid) {
							data[key] = parsed.toJSDate();
						} else {
							// Pad a 0 before the day value if it is single digit
							const normalizedInput = property
								.split('-')
								.map((part, i) => (i === 0 ? part : part.padStart(2, '0')))
								.join('-');

							// Parse as a date in the beginning of the day in PST (America/Los_Angeles)
							const isoDate = DateTime.fromISO(normalizedInput, {
								zone: 'America/Los_Angeles',
							}).startOf('day');

							if (isoDate.isValid) {
								data[key] = isoDate.toJSDate();
							} else {
								data[key] = new Date(property); // Fallback to original string if parsing fails
							}
						}
					} else if (
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
