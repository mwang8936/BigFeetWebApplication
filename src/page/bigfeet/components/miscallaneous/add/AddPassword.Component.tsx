import { EyeIcon, EyeSlashIcon } from '@heroicons/react/24/outline';
import { FC, useState } from 'react';
import LENGTHS from '../../../../../constants/lengths.constants';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import ERRORS from '../../../../../constants/error.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
import { useTranslation } from 'react-i18next';

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
	validationProp: ValidationProp;
}

const AddPassword: FC<AddPasswordProp> = ({
	password,
	setPassword,
	validationProp,
}) => {
	const { t } = useTranslation();

	const [showPassword, setShowPassword] = useState<boolean>(false);
	const [retypePassword, setRetypePassword] = useState<string | null>(null);
	const [showRetypePassword, setShowRetypePassword] = useState<boolean>(false);

	return (
		<>
			<div className="mb-4">
				<label className="label" htmlFor={NAMES.employee.password}>
					{t(LABELS.employee.password)}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="add-input pl-12"
						id={NAMES.employee.password}
						type={showPassword ? 'text' : 'password'}
						value={password || ''}
						onChange={(event) => {
							const text = event.target.value;
							const textOrNull = text.length !== 0 ? text : null;

							setPassword(textOrNull);
							validationProp.setMatching(textOrNull === retypePassword);
							validationProp.setInvalid(!event.target.validity.valid);
						}}
						maxLength={LENGTHS.employee.password}
						required={validationProp.required}
						placeholder={PLACEHOLDERS.employee.password}
					/>
					<div className="absolute mt-3 mb-3 inset-y-0 left-0 flex items-center pl-3 z-20">
						{showPassword ? (
							<EyeIcon
								className="h-6 w-6 text-gray-500 cursor-pointer"
								onClick={() => setShowPassword(!showPassword)}
							/>
						) : (
							<EyeSlashIcon
								className="h-6 w-6 text-gray-500 cursor-pointer"
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
				<label className="label" htmlFor={NAMES.employee.retype_password}>
					{t(LABELS.employee.retype_password)}
				</label>
				<div className="flex relative rounded-md shadow-sm">
					<input
						className="add-input pl-12"
						id={NAMES.employee.retype_password}
						type={showRetypePassword ? 'text' : 'password'}
						value={retypePassword || ''}
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
					<div className="absolute mt-3 mb-3 inset-y-0 left-0 flex items-center pl-3 z-20">
						{showRetypePassword ? (
							<EyeIcon
								className="h-6 w-6 text-gray-500 cursor-pointer"
								onClick={() => setShowRetypePassword(!showRetypePassword)}
							/>
						) : (
							<EyeSlashIcon
								className="h-6 w-6 text-gray-500 cursor-pointer"
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
