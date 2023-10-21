import LoginForm from './components/LoginForm.Component';

import Logo from '../../assets/Logo.png';

export default function Login() {
	return (
		<div className='center'>
			<img src={Logo} />
			<LoginForm />
		</div>
	);
}
