import { useState } from 'react';
import TimePickerMaterialUI from './TimePickerMaterialUI.Component';

interface AddTimeProp {
	defaultTime: Date | null;
	onTimeSelected(time: Date | null): void;
	label: string;
	required: boolean;
	requiredMessage?: string;
	invalidMessage?: string;
}

export default function AddTime(prop: AddTimeProp) {
	const [invalid, setInvalid] = useState(false);
	const [time, setTime] = useState<Date | null>(prop.defaultTime);

	const onTimeSelected = (time: Date | null) => {
		if (time != null) {
		}
		setTime(time);
		onTimeSelected(time);
	};
	return (
		<div className='mb-4'>
			<div className='flex relative rounded-md shadow-sm'>
				<TimePickerMaterialUI
					label={prop.label}
					defaultTime={time}
					onTimeSelected={onTimeSelected}
				/>
			</div>

			{prop.required && time == null ? (
				<p className='error-label'>{prop.requiredMessage}</p>
			) : (
				invalid && <p className='error-label'>{prop.invalidMessage}</p>
			)}
		</div>
	);
}
