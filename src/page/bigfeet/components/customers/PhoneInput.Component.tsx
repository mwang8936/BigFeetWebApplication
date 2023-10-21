import { useState } from 'react';
import PATTERNS from '../../../../constants/patterns.constants';
import LENGTHS from '../../../../constants/lengths.constants';

export default function PhoneInput() {
	const [invalid, setInvalid] = useState(false);
	const [text, setText] = useState('');

	return (
		<div className='mb-4'>
			<label className='label' htmlFor='phone_number'>
				Phone Number
			</label>
			<div className='flex rounded-md shadow-sm'>
				<input
					className='add-input'
					value={text}
					id='phone_number'
					name='phone_number'
					type='tel'
					pattern={PATTERNS.phone_number}
					maxLength={LENGTHS.phone_number}
					placeholder={'(123) 456-7890'}
					required={true}
					onChange={(event) => {
						//const phone
						//setText(event.target.value.trimStart());
						setInvalid(!event.target.validity.valid);
					}}
				/>
			</div>
			{text.length === 0 ? (
				<p className='error-label'>Phone Number cannot be empty.</p>
			) : (
				invalid && (
					<p className='error-label'>
						Phone number must be in format.
					</p>
				)
			)}
		</div>
	);
}
