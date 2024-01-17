import { FC } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';

interface ValidationProp {
	max?: number;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: string;
}

interface AddMinuteProp {
	minutes: number | null;
	setMinutes(minutes: number | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
}

const AddMinute: FC<AddMinuteProp> = ({
	minutes,
	setMinutes,
	label,
	name,
	validationProp,
}) => {
	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{label}
			</label>
			<div className="flex relative rounded-md shadow-sm">
				<input
					className="add-input pl-11"
					id={name}
					type="number"
					value={minutes || ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setMinutes(text.length !== 0 ? parseInt(text, 10) : null);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					min={validationProp.required ? 1 : 0}
					max={validationProp.max}
					step={1}
					required={validationProp.required}
					placeholder={PLACEHOLDERS.service.time}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
					<ClockIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
				</div>
			</div>
			{validationProp.required && minutes === null ? (
				<p className="error-label">{validationProp.requiredMessage}</p>
			) : (
				validationProp.invalid && (
					<p className="error-label">{validationProp.invalidMessage}</p>
				)
			)}
		</div>
	);
};

export default AddMinute;
