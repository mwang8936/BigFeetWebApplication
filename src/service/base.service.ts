import axios, { AxiosError, AxiosRequestConfig } from 'axios';
import Cookies from 'js-cookie';
import { NavigateFunction } from 'react-router-dom';

import BASE_API_URL from '../constants/api.constants';

export default async function authorizedRequest(
	navigate: NavigateFunction,
	url: string,
	method: string,
	data?: any,
	params?: any
) {
	const accessToken = Cookies.get('accessToken');
	const config: AxiosRequestConfig = {
		method: method,
		baseURL: BASE_API_URL,
		url: url,
		headers: { Authorization: `Bearer ${accessToken}` },
		data: data,
		params: params,
	};
	return axios(config)
		.then((response) => {
			return parseData(response.data);
		})
		.catch((error: AxiosError) => {
			const message = onError(error, navigate);
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
					if (
						/(\d{4}\-(0?[1-9]|1[012])\-(0?[1-9]|[12][0-9]|3[01]))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))/.exec(
							property
						)
					)
						data[key] = new Date(property);
					else if (
						/((?:2[0-3]|[01]?[0-9]):[0-5][0-9]:[0-5][0-9])/.exec(
							property
						)
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

function onError(error: AxiosError, navigate: NavigateFunction) {
	if (error.response) {
		const responseData: any = error.response.data;
		if (error.response.status === 401) {
			return navigate('/login');
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
