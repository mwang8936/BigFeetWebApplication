import { FC } from 'react';
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

interface AddNumberProp {
	input: number | null;
	setInput(input: number | null): void;
	label: string;
	name: string;
	placeholder?: string;
	validationProp: ValidationProp;
}

const AddNumber: FC<AddNumberProp> = ({
	input,
	setInput,
	label,
	name,
	placeholder,
	validationProp,
}) => {
	const { t } = useTranslation();

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="div-input">
				<input
					className="add-input"
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
					placeholder={placeholder}
				/>
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

export default AddNumber;
