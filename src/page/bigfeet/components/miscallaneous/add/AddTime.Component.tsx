import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';

import { LocalizationProvider, DesktopTimePicker } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import {
	fromPickerDate,
	toPickerDate,
} from '../../../../../utils/date.utils';

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

interface AddTimeProp {
	time: Date | null;
	setTime(time: Date | null): void;
	label: string;
	validationProp: ValidationProp;
}

const AddTime: FC<AddTimeProp> = ({ time, setTime, label, validationProp }) => {
	const { t } = useTranslation();

	useEffect(() => {
		if (time) {
			const updatedTime = new Date(time);
			updatedTime.setSeconds(0);
			updatedTime.setMilliseconds(0);
			setTime(updatedTime);
		}
	}, []);

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
			<div className="div-input">
				<LocalizationProvider dateAdapter={AdapterDayjs}>
					<DesktopTimePicker
						className="add-input"
						label={t(label)}
						// The picker edits the browser's clock, so it is shown the BC wall clock
						// and what is picked is read back as BC time.
						value={time ? dayjs(toPickerDate(time)) : null}
						onChange={(time: dayjs.Dayjs | null) => {
							if (time === null) {
								setTime(null);
							} else {
								const selectedTime = time.second(0).millisecond(0);
								setTime(fromPickerDate(selectedTime.toDate()));
							}
						}}
						closeOnSelect={false}
						minTime={minTime}
						maxTime={maxTime}
						onError={(error) => {
							const invalid = error !== null && time !== null;
							validationProp.setInvalid(invalid);
						}}
					/>
				</LocalizationProvider>
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

export default AddTime;
