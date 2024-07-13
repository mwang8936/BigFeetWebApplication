import { FC, useEffect, useState } from 'react';
import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import dayjs from 'dayjs';
import PermissionsButton from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	min: number;
	max: number;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface EditableTimeProp {
	originalTime: Date | null;
	time: Date | null;
	setTime(time: Date | null): void;
	label: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableTime: FC<EditableTimeProp> = ({
	originalTime,
	time,
	setTime,
	label,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [originalTime]);

	useEffect(() => {
		if (time) {
			const updatedTime = new Date(time);
			updatedTime.setSeconds(0);
			updatedTime.setMilliseconds(0);
			setTime(updatedTime);
		}
	}, []);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setTime(originalTime);
			validationProp.setInvalid(false);
		}
		setDisabled(!disabled);
	};

	const minInteger = Math.floor(validationProp.min);
	const minDecimal = validationProp.min - minInteger;

	const maxInteger = Math.floor(validationProp.max);
	const maxDecimal = validationProp.max - maxInteger;

	const minTime = dayjs()
		.set('hour', minInteger)
		.set('minute', Math.floor(minDecimal * 60))
		.set('second', 0)
		.set('millisecond', 0);
	const maxTime = dayjs()
		.set('hour', maxInteger)
		.set('minute', Math.floor(maxDecimal * 60))
		.set('second', 0)
		.set('millisecond', 0);

	return (
		<div className="mb-4">
			<div className="flex relative rounded-md shadow-sm">
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DesktopTimePicker
						className="editable-input"
						label={t(label)}
						value={time ? dayjs(time) : null}
						onChange={(time: dayjs.Dayjs | null) => {
							if (time === null) {
								setTime(null);
							} else {
								const selectedTime = time;
								selectedTime.set('second', 0);
								selectedTime.set('millisecond', 0);
								setTime(selectedTime.toDate());
							}
						}}
						minTime={minTime}
						maxTime={maxTime}
						disabled={disabled}
						onError={(error) => {
							const invalid = error !== null && time !== null;
							validationProp.setInvalid(invalid);
						}}
					/>
				</LocalizationProvider>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? t('Change') : t('Cancel')}
						disabled={!editable}
						missingPermissionMessage={t(missingPermissionMessage)}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>

			{validationProp.required && time === null ? (
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

export default EditableTime;
