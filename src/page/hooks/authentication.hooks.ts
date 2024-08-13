import secureLocalStorage from 'react-secure-storage';
import { useTranslation } from 'react-i18next';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import Cookies from 'js-cookie';

import { MutationProp } from './props.hooks';
import { userQueryKey } from './profile.hooks';

import { useAuthenticationContext } from '../../App';

import {
	passwordKey,
	tokenKey,
	usernameKey,
} from '../../constants/api.constants';

import { Language } from '../../models/enums';

import { LoginRequest } from '../../models/requests/Login.Request.Model';

import { authenticate, login } from '../../service/auth.service';

import { getLanguageFile } from '../../utils/i18n.utils';

export const useLoginMutation = ({ setLoading, setError }: MutationProp) => {
	const queryClient = useQueryClient();

	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: (data: { request: LoginRequest; rememberMe: boolean }) =>
			login(data.request),
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
			const username = variables.request.username;
			const password = variables.request.password;

			const rememberMe = variables.rememberMe;
			if (rememberMe) {
				secureLocalStorage.setItem(usernameKey, username);
				secureLocalStorage.setItem(passwordKey, password);
			} else {
				secureLocalStorage.removeItem(usernameKey);
				secureLocalStorage.removeItem(passwordKey);
			}

			// Store the user
			queryClient.setQueryData([userQueryKey], user);
		},
		onError: (error) => {
			if (setError) setError(error.message);
		},
		onSettled: () => {
			if (setLoading) setLoading(false);
		},
	});
};

export const useAuthenticateMutation = ({
	setLoading,
	setError,
}: MutationProp) => {
	const { setAuthentication } = useAuthenticationContext();

	return useMutation({
		mutationFn: () => authenticate(setAuthentication),
		onMutate: async () => {
			if (setLoading) setLoading(true);
		},
		onSuccess: () => setAuthentication(true),
		onError: (error) => {
			if (setError) {
				setError(error.message);
			}

			console.error('Error during authentication:', error.message);
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

		console.log('User logged out.');
	};

	return logout;
};
