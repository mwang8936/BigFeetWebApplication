import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { LocalizationProvider, DesktopDatePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import dayjs from 'dayjs';

import PermissionsButton from '../PermissionsButton.Component';

interface InvalidMessage {
	key: string;
	value: Record<string, string | number>;
}

interface ValidationProp {
	minDate?: Date;
	maxDate?: Date;
	required: boolean;
	requiredMessage?: string;
	invalid: boolean;
	setInvalid(invalid: boolean): void;
	invalidMessage: InvalidMessage;
}

interface EditableDateProp {
	originalDate: Date | null;
	date: Date | null;
	setDate(date: Date | null): void;
	label: string;
	validationProp: ValidationProp;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableDate: FC<EditableDateProp> = ({
	originalDate,
	date,
	setDate,
	label,
	validationProp,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(originalDate !== null);

	useEffect(() => {
		setDisabled(originalDate !== null);
	}, [originalDate]);

	useEffect(() => {
		if (date) {
			const updatedDate = new Date(date);
			updatedDate.setSeconds(0);
			updatedDate.setMilliseconds(0);
			setDate(updatedDate);
		}
	}, []);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setDate(originalDate);
			validationProp.setInvalid(false);
		}
		setDisabled(!disabled);
	};

	const minDay = validationProp.minDate
		? dayjs(validationProp.minDate)
		: undefined;
	minDay?.set('second', 0);
	minDay?.set('millisecond', 0);

	const maxDay = validationProp.maxDate
		? dayjs(validationProp.maxDate)
		: undefined;
	maxDay?.set('second', 0);
	maxDay?.set('millisecond', 0);

	return (
		<div className="mb-4">
			<div className="div-input">
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DesktopDatePicker
						className="editable-input"
						label={t(label)}
						value={date ? dayjs(date) : null}
						onChange={(date: dayjs.Dayjs | null) => {
							if (date === null) {
								setDate(null);
							} else {
								const selectedDate = date;
								selectedDate.set('second', 0);
								selectedDate.set('millisecond', 0);
								setDate(selectedDate.toDate());
							}
						}}
						minDate={minDay}
						maxDate={maxDay}
						disabled={disabled}
						onError={(error) => validationProp.setInvalid(error !== null)}
					/>
				</LocalizationProvider>

				<div className="ms-3">
					<PermissionsButton
						btnTitle={disabled ? 'Change' : 'Cancel'}
						disabled={!editable}
						missingPermissionMessage={missingPermissionMessage}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>

			{validationProp.required && date === null ? (
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

export default EditableDate;
