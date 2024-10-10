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

interface AddPercentageProp {
	percentage: number | null;
	setPercentage(percentage: number | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
	placeholder: string;
}

const AddPercentage: FC<AddPercentageProp> = ({
	percentage,
	setPercentage,
	label,
	name,
	validationProp,
	placeholder,
}) => {
	const { t } = useTranslation();

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>
			<div className="div-input">
				<input
					className="add-input pl-9"
					id={name}
					type="number"
					value={
						percentage === null ? '' : parseFloat((percentage * 100).toFixed(2))
					}
					onChange={(event) => {
						const amount = parseFloat(event.target.value);

						setPercentage(
							isNaN(amount) ? null : parseFloat((amount / 100).toFixed(4))
						);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					min={0}
					max={validationProp.max ?? 100}
					step={0.01}
					onWheel={(event) => event.currentTarget.blur()}
					required={validationProp.required}
					placeholder={placeholder}
				/>
				<div className="input-icon-div">
					<span className="text-gray-500">%</span>
				</div>
			</div>
			{validationProp.required && percentage === null ? (
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

export default AddPercentage;
