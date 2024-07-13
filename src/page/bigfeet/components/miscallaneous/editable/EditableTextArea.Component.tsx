import { FC, useEffect, useState } from 'react';
import PermissionsButton from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

interface ValidationProp {
	required: boolean;
	requiredMessage?: string;
}

interface EditableTextAreaProp {
	originalText: string | null;
	text: string | null;
	setText(text: string | null): void;
	label: string;
	name: string;
	placeholder?: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableTextArea: FC<EditableTextAreaProp> = ({
	originalText,
	text,
	setText,
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
	}, [originalText]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setText(originalText);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>
			<div className="flex rounded-md shadow-sm">
				<textarea
					className="editable-input"
					id={name}
					value={text || ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setText(text.length !== 0 ? text : null);
					}}
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
			{validationProp.required && (text === null || text.length === 0) && (
				<p className="error-label">
					{validationProp.requiredMessage && t(validationProp.requiredMessage)}
				</p>
			)}
		</div>
	);
};

export default EditableTextArea;
