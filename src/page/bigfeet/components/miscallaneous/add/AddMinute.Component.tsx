import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { ClockIcon } from '@heroicons/react/24/outline';

import PLACEHOLDERS from '../../../../../constants/placeholder.constants';

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
	const { t } = useTranslation();

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="div-input">
				<input
					className="add-input pl-11"
					id={name}
					type="number"
					value={minutes ?? ''}
					onChange={(event) => {
						const text = event.target.value.trimStart();

						setMinutes(text.length !== 0 ? parseInt(text, 10) : null);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					min={validationProp.required ? 1 : 0}
					max={validationProp.max}
					step={1}
					onWheel={(event) => event.currentTarget.blur()}
					required={validationProp.required}
					placeholder={PLACEHOLDERS.service.time}
				/>

				<div className="input-icon-div pl-3">
					<ClockIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
				</div>
			</div>

			{validationProp.required && minutes === null ? (
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

export default AddMinute;
