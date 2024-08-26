import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';

import ERRORS from '../../../../../constants/error.constants';
import LENGTHS from '../../../../../constants/lengths.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import PATTERNS from '../../../../../constants/patterns.constants';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	maxLength?: number;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
	matching: boolean;
	setMatching(matching: boolean): void;
}

interface AddPasswordProp {
	password: string | null;
	setPassword(password: string | null): void;
	label: string;
	name: string;
	retypeLabel: string;
	retypeName: string;
	validationProp: ValidationProp;
}

const AddPassword: FC<AddPasswordProp> = ({
	password,
	setPassword,
	label,
	name,
	retypeLabel,
	retypeName,
	validationProp,
}) => {
	const { t } = useTranslation();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [retypePassword, setRetypePassword] = useState<string | null>(null);
	const [showRetypePassword, setShowRetypePassword] = useState<boolean>(false);

	return (
		<>
			<div className="mb-4">
				<label className="label" htmlFor={name}>
					{t(label)}
				</label>

				<div className="div-input">
					<input
						className="add-input pl-12"
						id={name}
						type={showPassword ? 'text' : 'password'}
						value={password ?? ''}
						onChange={(event) => {
							const text = event.target.value;
							const textOrNull = text.length !== 0 ? text : null;

							setPassword(textOrNull);
							validationProp.setMatching(textOrNull === retypePassword);
							validationProp.setInvalid(!event.target.validity.valid);
						}}
						maxLength={LENGTHS.employee.password}
						pattern={PATTERNS.employee.password}
						required={validationProp.required}
						placeholder={PLACEHOLDERS.employee.password}
					/>

					<div className="show-password-div">
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

				{validationProp.required &&
				(password === null || password.length === 0) ? (
					<p className="error-label">
						{validationProp.requiredMessage &&
							t(validationProp.requiredMessage)}
					</p>
				) : validationProp.invalid ? (
					<p className="error-label">
						{t(
							validationProp.invalidMessage.key,
							validationProp.invalidMessage.value
						)}
					</p>
				) : (
					!validationProp.matching && (
						<p className="error-label">{t(ERRORS.employee.password.match)}</p>
					)
				)}
			</div>

			<div className="mb-4">
				<label className="label" htmlFor={retypeName}>
					{t(retypeLabel)}
				</label>

				<div className="div-input">
					<input
						className="add-input pl-12"
						id={retypeName}
						type={showRetypePassword ? 'text' : 'password'}
						value={retypePassword ?? ''}
						onChange={(event) => {
							const text = event.target.value;
							const textOrNull = text.length !== 0 ? text : null;

							setRetypePassword(textOrNull);
							validationProp.setMatching(textOrNull === password);
							validationProp.setInvalid(!event.target.validity.valid);
						}}
						maxLength={LENGTHS.employee.password}
						required={
							validationProp.required ||
							(password !== null && password.length !== 0)
						}
						placeholder={PLACEHOLDERS.employee.password}
					/>

					<div className="show-password-div">
						{showRetypePassword ? (
							<EyeIcon
								className="pointer-icon"
								onClick={() => setShowRetypePassword(!showRetypePassword)}
							/>
						) : (
							<EyeSlashIcon
								className="pointer-icon"
								onClick={() => setShowRetypePassword(!showRetypePassword)}
							/>
						)}
					</div>
				</div>

				{(retypePassword === null || retypePassword.length === 0) && (
					<p className="error-label">
						{validationProp.requiredMessage &&
							t(validationProp.requiredMessage)}
					</p>
				)}
				{!validationProp.matching && (
					<p className="error-label">{t(ERRORS.employee.password.match)}</p>
				)}
			</div>
		</>
	);
};

export default AddPassword;
