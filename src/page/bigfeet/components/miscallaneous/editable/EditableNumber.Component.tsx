import { FC, useEffect, useState } from 'react';
import PermissionsButton from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	max?: number;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface EditableNumberProp {
	originalInput: number | null;
	input: number | null;
	setInput(input: number | null): void;
	label: string;
	name: string;
	placeholder?: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableNumber: FC<EditableNumberProp> = ({
	originalInput,
	input,
	setInput,
	label,
	name,
	placeholder,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [originalInput]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setInput(originalInput);
			validationProp.setInvalid(false);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>
			<div className="flex rounded-md shadow-sm">
				<input
					className="editable-input"
					id={name}
					type="number"
					value={input ?? ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setInput(text.length !== 0 ? parseInt(text, 10) : null);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					min={0}
					max={validationProp.max}
					step={1}
					required={validationProp.required}
					disabled={disabled}
					placeholder={placeholder}
				/>
				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? t('Change') : t('Cancel')}
						disabled={!editable}
						missingPermissionMessage={t(missingPermissionMessage)}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>
			{validationProp.required && input === null ? (
				<p className="error-label">
					{validationProp.requiredMessage && t(validationProp.requiredMessage)}
				</p>
			) : (
				validationProp.invalid && (
					<p className="error-label">
						{t(
							validationProp.invalidMessage.key,
							validationProp.invalidMessage.value
						)}
					</p>
				)
			)}
		</div>
	);
};

export default EditableNumber;
