import { useEffect, useState } from 'react';

interface BodyFeetServiceProp {
	editable: boolean;
	body: number;
	feet: number;
}

export default function BodyFeetService(prop: BodyFeetServiceProp) {
	const [disabledBody, setDisabledBody] = useState(true);
	const [invalidBody, setInvalidBody] = useState(false);
	const [body, setBody] = useState(prop.body);

	const [disabledFeet, setDisabledFeet] = useState(true);
	const [invalidFeet, setInvalidFeet] = useState(false);
	const [feet, setFeet] = useState(prop.feet);

	useEffect(() => {
		setBody(prop.body);
		setInvalidBody(false);
		setDisabledBody(true);

		setFeet(prop.feet);
		setInvalidFeet(false);
		setDisabledBody(true);
	}, [prop.body, prop.feet]);

	return (
		<div className='w-full grid grid-flow-row grid-cols-2 mb-4'>
			<div>
				<label className='label' htmlFor='body'>
					Body
				</label>
				<div className='flex relative rounded-md shadow-sm'>
					<input
						className='editable-input pl-9'
						value={body}
						id='body'
						name='body'
						type='number'
						min={0}
						max={9.99}
						step={0.5}
						placeholder='1.5'
						required={true}
						disabled={disabledBody}
						onChange={(event) => {
							setBody(event.target.valueAsNumber);
							setInvalidBody(!event.target.validity.valid);
						}}
					/>
					<div className='absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4'>
						<span className='text-gray-500'>B</span>
					</div>
					<button
						type='button'
						className='button ms-3 group'
						disabled={!prop.editable}
						onClick={() => {
							if (!disabledBody) {
								setBody(prop.body);
								setInvalidBody(false);
							} else {
								setFeet(0);
								setInvalidFeet(false);
								setDisabledFeet(true);
							}
							setDisabledBody(!disabledBody);
						}}
					>
						{disabledBody ? 'Change' : 'Cancel'}
						<span className='button-tip group-hover:group-disabled:scale-100'>
							You do not have permission to change service
							details.
						</span>
					</button>
				</div>
				{body.toString().length === 0 ? (
					<p className='error-label'>Body cannot be empty.</p>
				) : (
					invalidBody && (
						<p className='error-label'>
							Body must be between 0-9.95 and limited to 2 decimal
							places.
						</p>
					)
				)}
			</div>

			<div>
				<label className='label' htmlFor='feet'>
					Feet
				</label>
				<div className='flex relative rounded-md shadow-sm'>
					<input
						className='editable-input pl-9'
						value={feet}
						id='feet'
						name='feet'
						type='number'
						min={0}
						max={9.99}
						step={0.5}
						placeholder='0.5'
						required={true}
						disabled={disabledFeet}
						onChange={(event) => {
							setFeet(event.target.valueAsNumber);
							setInvalidFeet(!event.target.validity.valid);
						}}
					/>
					<div className='absolute inset-y-0 left-0 flex items-center pointer-events-none pl-4'>
						<span className='text-gray-500'>R</span>
					</div>
					<button
						type='button'
						className='button ms-3 group'
						disabled={!prop.editable}
						onClick={() => {
							if (!disabledFeet) {
								setFeet(prop.feet);
								setInvalidFeet(false);
							} else {
								setBody(0);
								setInvalidBody(false);
								setDisabledBody(true);
							}
							setDisabledFeet(!disabledFeet);
						}}
					>
						{disabledFeet ? 'Change' : 'Cancel'}
						<span className='button-tip group-hover:group-disabled:scale-100'>
							You do not have permission to change service
							details.
						</span>
					</button>
				</div>
				{feet.toString().length === 0 ? (
					<p className='error-label'>Feet cannot be empty.</p>
				) : (
					invalidFeet && (
						<p className='error-label'>
							Feet must be between 0-9.95 and limited to 2 decimal
							places.
						</p>
					)
				)}
			</div>
		</div>
	);
}
