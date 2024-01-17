import { FC } from 'react';

interface ValidationProp {
	maxLength?: number;
	pattern?: string;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: string;
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
	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{label}
			</label>
			<div className="flex rounded-md shadow-sm">
				<input
					className="add-input"
					id={name}
					type={type}
					value={text || ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setText(text.length !== 0 ? text : null);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					maxLength={validationProp.maxLength}
					pattern={validationProp.pattern}
					required={validationProp.required}
					placeholder={placeholder}
				/>
			</div>
			{validationProp.required && (text === null || text.length === 0) ? (
				<p className="error-label">{validationProp.requiredMessage}</p>
			) : (
				validationProp.invalid && (
					<p className="error-label">{validationProp.invalidMessage}</p>
				)
			)}
		</div>
	);
};

export default AddInput;
