import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { useState } from 'react';
import LENGTHS from '../../../../constants/lengths.constants';

export default function AddPassword() {
	const [password, setPassword] = useState('');
	const [showPassword, setShowPassword] = useState(false);
	const [retypePassword, setRetypePassword] = useState('');
	const [showRetypePassword, setShowRetypePassword] = useState(false);

	return (
		<>
			<div className='mb-4'>
				<label className='label' htmlFor='password'>
					Add Password
				</label>
				<div className='flex relative rounded-md shadow-sm'>
					<input
						className='add-input pl-12'
						value={password}
						id='password'
						name='password'
						type={showPassword ? 'text' : 'password'}
						maxLength={LENGTHS.password}
						placeholder='******************'
						onChange={(event) => setPassword(event.target.value)}
						required
					/>
					<div className='absolute mt-3 mb-3 inset-y-0 left-0 flex items-center pl-3 z-20'>
						{showPassword ? (
							<EyeIcon
								className='h-6 w-6 text-gray-500 cursor-pointer'
								onClick={() => setShowPassword(!showPassword)}
							/>
						) : (
							<EyeSlashIcon
								className='h-6 w-6 text-gray-500 cursor-pointer'
								onClick={() => setShowPassword(!showPassword)}
							/>
						)}
					</div>
				</div>
				{password.length === 0 && (
					<p className='error-label'>Password cannot be empty.</p>
				)}
			</div>
			<div className='mb-4'>
				<label className='label' htmlFor='retypePassword'>
					Retype Password
				</label>
				<div className='flex relative rounded-md shadow-sm'>
					<input
						className='add-input pl-12'
						value={retypePassword}
						id='retypePassword'
						type={showRetypePassword ? 'text' : 'password'}
						maxLength={LENGTHS.password}
						pattern={password}
						placeholder='******************'
						onInvalid={(event) =>
							event.currentTarget.setCustomValidity(
								'Passwords must match.'
							)
						}
						onChange={(event) => {
							event.currentTarget.setCustomValidity('');
							setRetypePassword(event.target.value);
						}}
						required
					/>
					<div className='absolute mt-3 mb-3 inset-y-0 left-0 flex items-center pl-3 z-20'>
						{showRetypePassword ? (
							<EyeIcon
								className='h-6 w-6 text-gray-500 cursor-pointer'
								onClick={() =>
									setShowRetypePassword(!showRetypePassword)
								}
							/>
						) : (
							<EyeSlashIcon
								className='h-6 w-6 text-gray-500 cursor-pointer'
								onClick={() =>
									setShowRetypePassword(!showRetypePassword)
								}
							/>
						)}
					</div>
				</div>
				{retypePassword.length === 0 && (
					<p className='error-label'>Password cannot be empty.</p>
				)}
				{retypePassword !== password && (
					<p className='error-label'>Passwords must match.</p>
				)}
			</div>
		</>
	);
}
