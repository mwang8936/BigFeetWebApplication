import { FC } from 'react';
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

interface AddInputProp {
	text: string | null;
	setText(text: string | null): void;
	label: string;
	name: string;
	type: string;
	placeholder?: string;
	validationProp: ValidationProp;
}

const AddInput: FC<AddInputProp> = ({
	text,
	setText,
	label,
	name,
	type,
	placeholder,
	validationProp,
}) => {
	const { t } = useTranslation();

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="input-div">
				<input
					className="add-input"
					id={name}
					type={type}
					value={text ?? ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setText(text.length !== 0 ? text : null);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					maxLength={validationProp.maxLength}
					pattern={validationProp.pattern}
					required={validationProp.required}
					placeholder={placeholder && t(placeholder)}
				/>
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

export default AddInput;
