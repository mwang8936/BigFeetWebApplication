import { FC } from 'react';
import { useTranslation } from 'react-i18next';

interface ValidationProp {
	required: boolean;
	requiredMessage?: string;
}

interface AddTextAreaProp {
	text: string | null;
	setText(text: string | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
	placeholder?: string;
}

const AddTextArea: FC<AddTextAreaProp> = ({
	text,
	setText,
	name,
	label,
	validationProp,
	placeholder,
}) => {
	const { t } = useTranslation();

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>
			<div className="flex rounded-md shadow-sm">
				<textarea
					className="add-input"
					id={name}
					value={text || ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setText(text.length !== 0 ? text : null);
					}}
					required={validationProp.required}
					placeholder={placeholder && t(placeholder)}
				/>
			</div>
			{validationProp.required && (text === null || text.length === 0) && (
				<p className="error-label">
					{validationProp.requiredMessage && t(validationProp.requiredMessage)}
				</p>
			)}
		</div>
	);
};

export default AddTextArea;
