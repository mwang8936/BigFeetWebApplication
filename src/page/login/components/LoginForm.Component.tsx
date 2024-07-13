import Cookies from 'js-cookie';
import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import secureLocalStorage from 'react-secure-storage';

import ERRORS from '../../../constants/error.constants';
import LENGTHS from '../../../constants/lengths.constants';
import PATTERNS from '../../../constants/patterns.constants';

import { useAuthenticationContext } from '../../../App';

import { login } from '../../../service/auth.service';
import {
	passwordKey,
	tokenKey,
	userKey,
	usernameKey,
} from '../../../constants/api.constants';
import STORES from '../../../constants/store.constants';

export default function LoginForm() {
	//Obtain last used username and password from secure storage.
	const savedUsername = secureLocalStorage.getItem(usernameKey);
	const savedPassword = secureLocalStorage.getItem(passwordKey);

	const [username, setUsername] = useState(
		typeof savedUsername == 'string' ? savedUsername : ''
	);
	const [usernameInvalid, setUsernameInvalid] = useState(false);
	//Highlight username input if we are using a saved username.
	const [highlightUsername, setHighlightUsername] = useState(
		typeof savedUsername == 'string'
	);

	const [password, setPassword] = useState(
		typeof savedPassword == 'string' ? savedPassword : ''
	);
	const [showPassword, setShowPassword] = useState(false);
	//Hightlight password input if we are using a saved password.
	const [highlightPassword, setHighlightPassword] = useState(
		typeof savedPassword == 'string'
	);

	const [loading, setLoading] = useState(false);
	const [error, setError] = useState('');

	const { setAuthentication } = useAuthenticationContext();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();

		if (!username) setError(ERRORS.employee.username.required);
		else if (!password) setError(ERRORS.employee.password.required);
		else {
			const rememberMe: boolean | undefined =
				event.currentTarget.remember_me?.checked;
			setLoading(true);
			//Login API request.
			login({ username, password })
				.then((response) => {
					const { user, accessToken } = response.data;
					//Set authentication to true, store access token for future protected requests, and store user item.
					setAuthentication(true);
					Cookies.set(tokenKey, accessToken);
					sessionStorage.setItem(userKey, JSON.stringify(user));
					//If remember me is checked, securely store username and password in local storage.
					if (rememberMe) {
						secureLocalStorage.setItem(usernameKey, username);
						secureLocalStorage.setItem(passwordKey, password);
					} else {
						secureLocalStorage.removeItem(usernameKey);
						secureLocalStorage.removeItem(passwordKey);
					}
				})
				.catch((error) => {
					console.log(error);
					if (error.response) {
						const responseData: any = error.response.data;
						if (responseData) {
							setError(`${responseData.error}: ${responseData.messages}`);
						} else {
							setError(error.response.statusText);
						}
					} else {
						setError(error.message || 'An unidentified error occurred.');
					}
				})
				.finally(() => setLoading(false));
		}
	};

	const usernameElement = (
		<div className="mb-4">
			<label className="label" htmlFor="username">
				Username
			</label>
			<input
				className={highlightUsername ? 'input-form-highlighted' : 'input-form'}
				value={username}
				id="username"
				name="username"
				type="text"
				pattern={PATTERNS.login.username}
				maxLength={LENGTHS.employee.username}
				placeholder="Username"
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
					<p className="error-label">{ERRORS.employee.username.invalid}</p>
				)
			)}
		</div>
	);

	const passwordElement = (
		<div className="mb-4">
			<label className="label" htmlFor="password">
				Password
			</label>
			<div className="flex relative">
				<input
					className={
						highlightPassword
							? 'input-form-highlighted pl-11'
							: 'input-form pl-11'
					}
					value={password}
					id="password"
					name="password"
					type={showPassword ? 'text' : 'password'}
					maxLength={LENGTHS.employee.password}
					placeholder="******************"
					onChange={(event) => {
						setPassword(event.target.value);
						setHighlightPassword(false);
					}}
					required
				/>
				<div className="absolute mt-1 mb-3 inset-y-0 left-0 flex items-center pl-3 z-20">
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

	return (
		<form className="login-form" onSubmit={handleSubmit}>
			<h1 className="login-title">{STORES.city}</h1>
			{usernameElement}
			{passwordElement}
			<div className="mb-4 flex flex-row">
				<input
					className="mr-2"
					defaultChecked={true}
					name="remember_me"
					type="checkbox"
				/>
				<p className="block text-gray-700 text-sm font-bold">Remember Me</p>
			</div>
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
					{loading ? 'Signing In' : 'Sign In'}
				</button>
				{error && <p className="error-label">{error}</p>}
			</div>
		</form>
	);
}
