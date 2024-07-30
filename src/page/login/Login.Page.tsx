import { FC } from 'react';

import LoginForm from './components/LoginForm.Component';

import Logo from '../../assets/Logo.png';

const Login: FC = () => {
	return (
		<div className="center-page">
			<img src={Logo} />

			<LoginForm />
		</div>
	);
};

export default Login;
