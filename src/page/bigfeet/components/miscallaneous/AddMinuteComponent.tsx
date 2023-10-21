import { useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface AddMinuteProp {
	defaultText: string;
	label: string;
	name: string;
	max: number;
	required: boolean;
	invalidMessage: string;
	requiredMessage?: string;
}

export default function AddMinute(prop: AddMinuteProp) {
	const [invalid, setInvalid] = useState(false);
	const [text, setText] = useState(prop.defaultText);

	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.name}>
				{prop.label}
			</label>
			<div className='flex relative rounded-md shadow-sm'>
				<input
					className='add-input pl-11'
					value={text}
					id={prop.name}
					name={prop.name}
					type='number'
					min={0}
					max={prop.max}
					step={1}
					placeholder='60'
					required={prop.required}
					onChange={(event) => {
						setText(event.target.value);
						setInvalid(!event.target.validity.valid);
					}}
				/>
				<div className='absolute inset-y-0 left-0 flex items-center pointer-events-none pl-3'>
					<ClockIcon
						className='h-6 w-6 text-gray-500'
						aria-hidden='true'
					/>
				</div>
			</div>
			{prop.required && text.length === 0 ? (
				<p className='error-label'>{prop.requiredMessage}</p>
			) : (
				invalid && <p className='error-label'>{prop.invalidMessage}</p>
			)}
		</div>
	);
}
