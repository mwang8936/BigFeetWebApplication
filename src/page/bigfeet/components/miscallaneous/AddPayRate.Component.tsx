import { useState } from 'react';

interface AddPayRateProp {
	defaultText: string;
	label: string;
	name: string;
	max: number;
	required: boolean;
	invalidMessage: string;
	requiredMessage?: string;
}

export default function AddPayRate(prop: AddPayRateProp) {
	const [invalid, setInvalid] = useState(false);
	const [text, setText] = useState(prop.defaultText);

	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.name}>
				{prop.label}
			</label>
			<div className='flex relative rounded-md shadow-sm'>
				<input
					className='add-input pl-9'
					value={text}
					id={prop.name}
					name={prop.name}
					type='number'
					min={0}
					max={prop.max}
					step={0.01}
					placeholder='0.00'
					required={prop.required}
					onChange={(event) => {
						setText(event.target.value);
						setInvalid(!event.target.validity.valid);
					}}
				/>
				<div className='absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4'>
					<span className='text-gray-500'>$</span>
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
