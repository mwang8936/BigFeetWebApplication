import { useEffect, useState } from 'react';
import { ClockIcon } from '@heroicons/react/24/outline';

interface EditableMinuteProp {
	text?: string;
	label: string;
	name: string;
	max: number;
	required: boolean;
	editable: boolean;
	missingPermissionMessage: string;
	invalidMessage: string;
	requiredMessage?: string;
}

export default function EditableMinute(prop: EditableMinuteProp) {
	const [disabled, setDisabled] = useState(true);
	const [invalid, setInvalid] = useState(false);
	const [text, setText] = useState(prop.text || '');

	useEffect(() => {
		setText(prop.text || '');
		setInvalid(false);
		setDisabled(true);
	}, [prop.text]);

	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.name}>
				{prop.label}
			</label>
			<div className='flex relative rounded-md shadow-sm'>
				<input
					className='editable-input pl-11'
					value={text}
					id={prop.name}
					name={prop.name}
					type='number'
					min={0}
					max={prop.max}
					step={1}
					placeholder='60'
					required={prop.required}
					disabled={disabled}
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
				<button
					type='button'
					className='button ms-3 group'
					disabled={!prop.editable}
					onClick={() => {
						if (!disabled) {
							setText(prop?.text || '');
							setInvalid(false);
						}
						setDisabled(!disabled);
					}}
				>
					{disabled ? 'Change' : 'Cancel'}
					<span className='button-tip group-hover:group-disabled:scale-100'>
						{prop.missingPermissionMessage}
					</span>
				</button>
			</div>
			{prop.required && text.length === 0 ? (
				<p className='error-label'>{prop.requiredMessage}</p>
			) : (
				invalid && <p className='error-label'>{prop.invalidMessage}</p>
			)}
		</div>
	);
}
