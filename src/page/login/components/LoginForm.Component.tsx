import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import secureLocalStorage from 'react-secure-storage';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import { passwordKey, usernameKey } from '../../../constants/api.constants';
import ERRORS from '../../../constants/error.constants';
import LENGTHS from '../../../constants/lengths.constants';
import NAMES from '../../../constants/name.constants';
import PATTERNS from '../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../constants/placeholder.constants';
import STORES from '../../../constants/store.constants';

import { LoginRequest } from '../../../models/requests/Login.Request.Model';

import { useLoginMutation } from '../../hooks/authentication.hooks';

const LoginForm: FC = () => {
	const { t } = useTranslation();

	//Obtain last used username and password from secure storage.
	const savedUsername = secureLocalStorage.getItem(
		usernameKey + import.meta.env.VITE_ENV
	);
	const savedPassword = secureLocalStorage.getItem(
		passwordKey + import.meta.env.VITE_ENV
	);

	const [username, setUsername] = useState<string>(
		typeof savedUsername == 'string' ? savedUsername : ''
	);
	const [usernameInvalid, setUsernameInvalid] = useState<boolean>(false);
	//Highlight username input if we are using a saved username.
	const [highlightUsername, setHighlightUsername] = useState<boolean>(
		typeof savedUsername == 'string'
	);

	const [password, setPassword] = useState<string>(
		typeof savedPassword == 'string' ? savedPassword : ''
	);
	const [showPassword, setShowPassword] = useState<boolean>(false);
	//Hightlight password input if we are using a saved password.
	const [highlightPassword, setHighlightPassword] = useState<boolean>(
		typeof savedPassword == 'string'
	);

	const [rememberMe, setRememberMe] = useState<boolean>(true);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const loginMutation = useLoginMutation({ setLoading, setError });

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		// Check if fields are empty
		if (!username) setError(ERRORS.login.username.required);
		else if (!password) setError(ERRORS.login.password.required);
		else {
			const request: LoginRequest = {
				username,
				password,
			};

			// Login API
			loginMutation.mutate({ request, rememberMe });
		}
	};

	const usernameElement = (
		<div className="mb-4">
			<label className="label" htmlFor={NAMES.login.username}>
				{t('Username')}
			</label>

			<input
				className={highlightUsername ? 'input-form-highlighted' : 'input-form'}
				value={username}
				name={NAMES.login.username}
				type="text"
				pattern={PATTERNS.login.username}
				maxLength={LENGTHS.login.username}
				placeholder={PLACEHOLDERS.login.username}
				onChange={(event) => {
					setUsername(event.target.value);
					setUsernameInvalid(!event.target.validity.valid);
					setHighlightUsername(false);
				}}
				required
			/>

			{username.length === 0 ? (
				<p className="error-label">{ERRORS.employee.username.required}</p>
			) : (
				usernameInvalid && (
					<p className="error-label">
						{t(
							ERRORS.employee.username.invalid.key,
							ERRORS.employee.username.invalid.value
						)}
					</p>
				)
			)}
		</div>
	);

	const passwordElement = (
		<div className="mb-4">
			<label className="label" htmlFor={NAMES.login.password}>
				{t('Password')}
			</label>

			<div className="flex relative">
				<input
					className={
						highlightPassword
							? 'input-form-highlighted pl-11'
							: 'input-form pl-11'
					}
					value={password}
					name={NAMES.login.password}
					type={showPassword ? 'text' : 'password'}
					maxLength={LENGTHS.login.password}
					placeholder={PLACEHOLDERS.login.password}
					onChange={(event) => {
						setPassword(event.target.value);
						setHighlightPassword(false);
					}}
					required
				/>

				<div className="show-password-login-div">
					{showPassword ? (
						<EyeIcon
							className="pointer-icon"
							onClick={() => setShowPassword(!showPassword)}
						/>
					) : (
						<EyeSlashIcon
							className="pointer-icon"
							onClick={() => setShowPassword(!showPassword)}
						/>
					)}
				</div>
			</div>

			{!password && (
				<p className="error-label">{ERRORS.employee.password.required}</p>
			)}
		</div>
	);

	const rememberMeElement = (
		<div className="flex flex-row mb-4">
			<input
				className="mr-2"
				checked={rememberMe}
				onChange={() => setRememberMe(!rememberMe)}
				name={NAMES.login.remember_me}
				type="checkbox"
			/>

			<p className="remember-me-label">{t('Remember Me')}</p>
		</div>
	);

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<h1 className="login-title">{STORES.city}</h1>

			{usernameElement}

			{passwordElement}

			{rememberMeElement}

			<div>
				<button
					className="button"
					type="submit"
					disabled={loading || username == '' || password == ''}>
					{loading && (
						<svg
							className="white-spin"
							xmlns="http://www.w3.org/2000/svg"
							fill="none"
							viewBox="0 0 24 24">
							<circle
								className="opacity-25"
								cx="12"
								cy="12"
								r="10"
								stroke="currentColor"
								strokeWidth="4"
							/>
							<path
								className="opacity-75"
								fill="currentColor"
								d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
							/>
						</svg>
					)}
					{loading ? t('Signing In') : t('Sign In')}
				</button>

				{error && <p className="error-label">{error}</p>}
			</div>
		</form>
	);
};

export default LoginForm;
