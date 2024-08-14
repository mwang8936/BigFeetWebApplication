import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import PermissionsButton from '../PermissionsButton.Component';

import LENGTHS from '../../../../../constants/lengths.constants';
import PATTERNS from '../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';

import { formatPhoneNumber } from '../../../../../utils/string.utils';

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

interface EditablePhoneNumberProp {
	originalPhoneNumber: string | null;
	phoneNumber: string | null;
	setPhoneNumber(phoneNumber: string | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditablePhoneNumber: FC<EditablePhoneNumberProp> = ({
	originalPhoneNumber,
	phoneNumber,
	setPhoneNumber,
	label,
	name,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(originalPhoneNumber !== null);

	useEffect(() => {
		setDisabled(originalPhoneNumber !== null);
	}, [originalPhoneNumber]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setPhoneNumber(originalPhoneNumber);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>

			<div className="input-div">
				<input
					className="editable-input"
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
					disabled={disabled}
					placeholder={PLACEHOLDERS.customer.phone_number}
				/>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? 'Change' : 'Cancel'}
						disabled={!editable}
						missingPermissionMessage={missingPermissionMessage}
						onClick={handleDisableBtnClick}
					/>
				</div>
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

export default EditablePhoneNumber;
