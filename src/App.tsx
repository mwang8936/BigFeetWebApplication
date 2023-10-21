import { createContext, useContext, useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';

import BigFeet from './page/bigfeet/BigFeet.Page';
import Login from './page/login/Login.Page';

import { authenticate } from './service/auth.service';

const AuthenticationContext = createContext<
	| {
			authenticated: boolean;
			setAuthentication(authenticated: boolean): void;
	  }
	| undefined
>(undefined);

export function useAuthenticationContext() {
	const context = useContext(AuthenticationContext);
	if (context === undefined) {
		throw new Error(
			'useAuthenticationContext must be within AuthenticationProvider'
		);
	}

	return context;
}

export default function App() {
	const [authenticated, setAuthentication] = useState(false);

	useEffect(() => {
		authenticate(setAuthentication);
	});

	return (
		<BrowserRouter>
			<AuthenticationContext.Provider
				value={{ authenticated, setAuthentication }}
			>
				<Routes>
					<Route
						index
						element={
							authenticated ? (
								<BigFeet />
							) : (
								<Navigate replace to='/login' />
							)
						}
					/>
					<Route
						path='/login'
						element={
							authenticated ? (
								<Navigate replace to='/' />
							) : (
								<Login />
							)
						}
					/>
					<Route path='*' element={<h1>404 PAGE NOT FOUND</h1>} />
				</Routes>
			</AuthenticationContext.Provider>
		</BrowserRouter>
	);
}
