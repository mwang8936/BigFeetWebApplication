import { FC, useEffect, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';
import PermissionsButton from '../PermissionsButton.Component';
import PLACEHOLDERS from '../../../../../constants/placeholder.constants';
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

interface EditableMinuteProp {
	originalMinutes: number | null;
	minutes: number | null;
	setMinutes(minutes: number | null): void;
	label: string;
	name: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableMinute: FC<EditableMinuteProp> = ({
	originalMinutes,
	minutes,
	setMinutes,
	label,
	name,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [originalMinutes]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setMinutes(originalMinutes);
			validationProp.setInvalid(false);
		}
		setDisabled(!disabled);
	};

	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>
			<div className="flex relative rounded-md shadow-sm">
				<input
					className="editable-input pl-11"
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
					disabled={disabled}
					placeholder={PLACEHOLDERS.service.time}
				/>
				<div className="absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3">
					<ClockIcon className="h-6 w-6 text-gray-500" aria-hidden="true" />
				</div>
				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? t('Change') : t('Cancel')}
						disabled={!editable}
						missingPermissionMessage={t(missingPermissionMessage)}
						onClick={handleDisableBtnClick}
					/>
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

export default EditableMinute;
