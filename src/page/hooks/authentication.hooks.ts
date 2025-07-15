import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Cookies from 'js-cookie';

import { MutationProp } from './props.hooks';
import { userQueryKey } from './profile.hooks';
import { useDeviceInfo } from './useDeviceInfo.hooks';

import { useAuthenticationContext } from '../../App';

import {
	passwordKey,
	tokenKey,
	usernameKey,
} from '../../constants/api.constants';

import { Language } from '../../models/enums';

import { LoginRequest } from '../../models/requests/Login.Request.Model';

import { login } from '../../service/auth.service';

import { getLanguageFile } from '../../utils/i18n.utils';

export const useLoginMutation = ({
	setLoading,
	setError,
	onSuccess,
}: MutationProp) => {
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();
	const { deviceId, deviceName, deviceModel } = useDeviceInfo();

	return useMutation({
		mutationFn: (data: {
			username: string;
			password: string;
			rememberMe: boolean;
		}) => {
			const request: LoginRequest = {
				username: data.username,
				password: data.password,
				device_id: deviceId,
				device_name: deviceName,
				device_model: deviceModel,
			};

			return login(request);
		},
		onMutate: async () => {
			if (setLoading) setLoading(true);
		},
		onSuccess: (data, variables) => {
			// Obtain user profile and access token from login response
			const { user, accessToken } = data;

			// Set user as authenticated and add access token to authorization cookie
			setAuthentication(true);
			Cookies.set(tokenKey, accessToken);

			//If remember me is checked, securely store username and password in local storage.
			const username = variables.username;
			const password = variables.password;

			const rememberMe = variables.rememberMe;
			if (rememberMe) {
				secureLocalStorage.setItem(
					usernameKey + import.meta.env.VITE_ENV,
					username
				);
				secureLocalStorage.setItem(
					passwordKey + import.meta.env.VITE_ENV,
					password
				);
			} else {
				secureLocalStorage.removeItem(usernameKey + import.meta.env.VITE_ENV);
				secureLocalStorage.removeItem(passwordKey + import.meta.env.VITE_ENV);
			}

			// Store the user
			queryClient.setQueryData([userQueryKey], user);

			if (onSuccess) onSuccess();
		},
		onError: (error) => {
			if (setError) setError(error.message);
		},
		onSettled: () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useLogout = () => {
	const { i18n } = useTranslation();
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	const logout = () => {
		i18n.changeLanguage(getLanguageFile(Language.ENGLISH));

		queryClient.clear();

		Cookies.remove(tokenKey);
		setAuthentication(false);

		if (import.meta.env.VITE_ENV === 'development')
			console.log('User logged out.');
	};

	return logout;
};
