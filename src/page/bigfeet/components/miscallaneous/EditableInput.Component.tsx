import { useEffect, useState } from 'react';

interface EditableInputProp {
	text: string;
	label: string;
	name: string;
	type: string;
	pattern: string;
	maxLength: number;
	placeholder: string;
	required: boolean;
	editable: boolean;
	missingPermissionMessage: string;
	invalidMessage: string;
	requiredMessage?: string;
}

export default function EditableInput(prop: EditableInputProp) {
	const [disabled, setDisabled] = useState(true);
	const [invalid, setInvalid] = useState(false);
	const [text, setText] = useState(prop.text);

	useEffect(() => {
		setDisabled(true);
		setInvalid(false);
		setText(prop.text);
	}, [prop.text]);

	return (
		<div className='mb-4'>
			<label className='label' htmlFor={prop.name}>
				{prop.label}
			</label>
			<div className='flex rounded-md shadow-sm'>
				<input
					className='editable-input'
					value={text}
					id={prop.name}
					name={prop.name}
					type={prop.type}
					pattern={prop.pattern}
					maxLength={prop.maxLength}
					placeholder={prop.placeholder}
					required={prop.required}
					disabled={disabled}
					onChange={(event) => {
						setText(event.target.value.trimStart());
						setInvalid(!event.target.validity.valid);
					}}
				/>
				<button
					type='button'
					className='button ms-3 group'
					disabled={!prop.editable}
					onClick={() => {
						if (!disabled) {
							setText(prop.text);
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
