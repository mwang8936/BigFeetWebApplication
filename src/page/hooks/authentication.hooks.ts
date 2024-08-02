import { useQueryClient } from '@tanstack/react-query';

import Cookies from 'js-cookie';

import { useAuthenticationContext } from '../../App';

import { tokenKey } from '../../constants/api.constants';

import { authenticate } from '../../service/auth.service';
import { useTranslation } from 'react-i18next';
import { getLanguageFile } from '../../utils/i18n.utils';
import { Language } from '../../models/enums';

export const useLogin = () => {
	const queryClient = useQueryClient();
	const { setAuthentication } = useAuthenticationContext();
};

export const useAuthenticate = () => {
	const { setAuthentication } = useAuthenticationContext();

	return authenticate(setAuthentication).catch((error) =>
		console.error('Error during authentication:', error.message)
	);
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
