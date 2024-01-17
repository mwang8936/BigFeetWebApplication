import { FC } from 'react';

interface ValidationProp {
	max?: number;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: string;
}

interface AddPayRateProp {
	amount: number | null;
	setAmount(amount: number | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
	placeholder: string;
}

const AddPayRate: FC<AddPayRateProp> = ({
	amount,
	setAmount,
	label,
	name,
	validationProp,
	placeholder,
}) => {
	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{label}
			</label>
			<div className="flex relative rounded-md shadow-sm">
				<input
					className="add-input pl-9"
					id={name}
					type="number"
					value={amount === null ? '' : amount}
					onChange={(event) => {
						const amount = parseFloat(event.target.value);

						setAmount(isNaN(amount) ? null : amount);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					min={validationProp.required ? 0.01 : 0}
					max={validationProp.max}
					step={0.01}
					required={validationProp.required}
					placeholder={placeholder}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4">
					<span className="text-gray-500">$</span>
				</div>
			</div>
			{validationProp.required && amount === null ? (
				<p className="error-label">{validationProp.requiredMessage}</p>
			) : (
				validationProp.invalid && (
					<p className="error-label">{validationProp.invalidMessage}</p>
				)
			)}
		</div>
	);
};

export default AddPayRate;
