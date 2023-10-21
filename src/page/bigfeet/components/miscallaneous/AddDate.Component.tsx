import { useState } from 'react';
import DatePickerMaterialUI from './DatePickerMaterialUI.Component';

interface AddDateProp {
	defaultDate: Date | null;
	onDateSelected(date: Date | null): void;
	label: string;
	required: boolean;
	requiredMessage?: string;
	invalidMessage?: string;
}

export default function AddDate(prop: AddDateProp) {
	const [invalid, setInvalid] = useState(false);
	const [date, setDate] = useState<Date | null>(prop.defaultDate);

	const onDateSelected = (date: Date | null) => {
		if (date != null) {
		}
		setDate(date);
		onDateSelected(date);
	};
	return (
		<div className='mb-4'>
			<div className='flex relative rounded-md shadow-sm'>
				<DatePickerMaterialUI
					label={prop.label}
					defaultDate={date}
					onDateSelected={onDateSelected}
				/>
			</div>

			{prop.required && date == null ? (
				<p className='error-label'>{prop.requiredMessage}</p>
			) : (
				invalid && <p className='error-label'>{prop.invalidMessage}</p>
			)}
		</div>
	);
}
