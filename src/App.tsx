import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BigFeet from './page/bigfeet/BigFeet.Page';
import Login from './page/login/Login.Page';

import { authenticate } from './service/auth.service';

const AuthenticationContext = createContext<{
	authenticated: boolean;
	setAuthentication(authenticated: boolean): void;
}>({ authenticated: false, setAuthentication: () => {} });

export function useAuthenticationContext() {
	return useContext(AuthenticationContext);
}

export default function App() {
	const [authenticated, setAuthentication] = useState(false);

	useEffect(() => {
		let isMounted = true;

		const cleanup = () => {
			isMounted = false;
		};

		if (isMounted) {
			authenticate(setAuthentication).catch((error) =>
				console.error('Error during authentication:', error.message)
			);
		}

		return cleanup;
	}, []);

	const mainElement = authenticated ? (
		<BigFeet />
	) : (
		<Navigate replace to="/login" />
	);

	const loginElement = authenticated ? <Navigate replace to="/" /> : <Login />;

	return (
		<BrowserRouter>
			<AuthenticationContext.Provider
				value={{ authenticated, setAuthentication }}>
				<Routes>
					<Route index element={mainElement} />
					<Route path="/login" element={loginElement} />
					<Route path="*" element={<h1>404 PAGE NOT FOUND</h1>} />
				</Routes>
			</AuthenticationContext.Provider>
		</BrowserRouter>
	);
}
