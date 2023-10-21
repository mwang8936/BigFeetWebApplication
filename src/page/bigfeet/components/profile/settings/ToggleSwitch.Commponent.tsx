import { useState } from 'react';

interface ToggleSwitchProp {
	name: string;
	checked: boolean;
	falseText: string;
	trueText: string;
}

export default function ToggleSwitch(prop: ToggleSwitchProp) {
	const [isChecked, setIsChecked] = useState(prop.checked);

	return (
		<>
			<label className='themeSwitcherTwo relative inline-flex cursor-pointer select-none items-center mb-3'>
				<input
					type='checkbox'
					name={prop.name}
					checked={isChecked}
					onChange={() => setIsChecked(!isChecked)}
					className='sr-only'
				/>
				<span className='label flex items-center text-sm font-medium text-black'>
					{prop.falseText}
				</span>
				<span
					className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
						isChecked ? 'bg-[#212b36]' : 'bg-[#CCCCCE]'
					}`}
				>
					<span
						className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
							isChecked ? 'translate-x-[28px]' : ''
						}`}
					></span>
				</span>
				<span className='label flex items-center text-sm font-medium text-black'>
					{prop.trueText}
				</span>
			</label>
		</>
	);
}
