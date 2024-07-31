import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import LENGTHS from '../../../../../constants/lengths.constants';
import PATTERNS from '../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface AddPhoneNumberProp {
	phoneNumber: string | null;
	setPhoneNumber(phoneNumber: string | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
}

const AddPhoneNumber: FC<AddPhoneNumberProp> = ({
	phoneNumber,
	setPhoneNumber,
	label,
	name,
	validationProp,
}) => {
	const { t } = useTranslation();

	const formatPhoneNumber = (number: string): string => {
		const cleanedNumber = number.replace(/\D/g, ''); // Remove non-numeric characters
		if (cleanedNumber.length > 6) {
			return `(${cleanedNumber.slice(0, 3)}) ${cleanedNumber.slice(
				3,
				6
			)}-${cleanedNumber.slice(6, 10)}`;
		} else {
			return cleanedNumber;
		}
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="input-div">
				<input
					className="add-input"
					id={name}
					type="tel"
					value={formatPhoneNumber(phoneNumber || '')}
					onChange={(event) => {
						const text = event.target.value.replace(/\D/g, '');

						setPhoneNumber(text.length === 0 ? null : text);
						validationProp.setInvalid(!event.target.validity.valid);
					}}
					pattern={PATTERNS.customer.phone_number}
					maxLength={LENGTHS.customer.phone_number}
					required={validationProp.required}
					placeholder={PLACEHOLDERS.customer.phone_number}
				/>
			</div>

			{validationProp.required &&
			(phoneNumber === null || phoneNumber.length === 0) ? (
				<p className="error-label">
					{validationProp.requiredMessage && t(validationProp.requiredMessage)}
				</p>
			) : (
				validationProp.invalid &&
				!(phoneNumber === null || phoneNumber.length === 0) && (
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

export default AddPhoneNumber;
