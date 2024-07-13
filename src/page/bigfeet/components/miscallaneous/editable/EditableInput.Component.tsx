import { FC, useEffect, useState } from 'react';
import PermissionsButton from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	maxLength?: number;
	pattern?: string;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface EditableInputProp {
	originalText: string | null;
	text: string | null;
	setText(text: string | null): void;
	label: string;
	name: string;
	type: string;
	placeholder?: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableInput: FC<EditableInputProp> = ({
	originalText,
	text,
	setText,
	label,
	name,
	type,
	placeholder,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [originalText]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setText(originalText);
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
					type={type}
					value={text || ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setText(text.length !== 0 ? text : null);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					pattern={validationProp.pattern}
					maxLength={validationProp.maxLength}
					required={validationProp.required}
					disabled={disabled}
					placeholder={placeholder && t(placeholder)}
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
			{validationProp.required && (text === null || text.length === 0) ? (
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

export default EditableInput;
