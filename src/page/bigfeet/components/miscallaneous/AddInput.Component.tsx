import { useState } from 'react';

interface AddInputProp {
	defaultText: string;
	label: string;
	name: string;
	type: string;
	pattern: string;
	maxLength: number;
	placeholder: string;
	required: boolean;
	invalidMessage: string;
	requiredMessage: string;
}

export default function AddInput(prop: AddInputProp) {
	const [invalid, setInvalid] = useState(false);
	const [text, setText] = useState(prop.defaultText);

	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.name}>
				{prop.label}
			</label>
			<div className='flex rounded-md shadow-sm'>
				<input
					className='add-input'
					value={text}
					id={prop.name}
					name={prop.name}
					type={prop.type}
					pattern={prop.pattern}
					maxLength={prop.maxLength}
					placeholder={prop.placeholder}
					required={prop.required}
					onChange={(event) => {
						setText(event.target.value.trimStart());
						setInvalid(!event.target.validity.valid);
					}}
				/>
			</div>
			{prop.required && text.length === 0 ? (
				<p className='error-label'>{prop.requiredMessage}</p>
			) : (
				invalid && <p className='error-label'>{prop.invalidMessage}</p>
			)}
		</div>
	);
}
