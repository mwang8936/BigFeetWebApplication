import { FC, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import dayjs from 'dayjs';

import { DesktopDatePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

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

interface AddDateProp {
	date: Date | null;
	setDate(date: Date | null): void;
	label: string;
	validationProp: ValidationProp;
}

const AddDate: FC<AddDateProp> = ({ date, setDate, label, validationProp }) => {
	const { t } = useTranslation();

	useEffect(() => {
		if (date) {
			const updatedDate = new Date(date);
			updatedDate.setSeconds(0);
			updatedDate.setMilliseconds(0);
			setDate(updatedDate);
		}
	}, []);

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
						className="add-input"
						label={t(label)}
						value={dayjs(date)}
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
						onError={(error) => validationProp.setInvalid(error !== null)}
					/>
				</LocalizationProvider>
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

export default AddDate;
