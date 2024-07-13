import { FC } from 'react';
import { useTranslation } from 'react-i18next';

export enum ToggleColor {
	GREEN = 'GREEN',
	BLUE = 'BLUE',
	RED = 'RED',
	BLACK = 'BLACK',
}

interface AddToggleSwitchProp {
	checked: boolean;
	setChecked(checked: boolean): void;
	falseText: string;
	trueText: string;
	toggleColour: ToggleColor;
	label: string;
	name: string;
	disabled: boolean;
}

const AddToggleSwitch: FC<AddToggleSwitchProp> = ({
	checked,
	setChecked,
	falseText,
	trueText,
	toggleColour,
	label,
	name,
	disabled,
}) => {
	const { t } = useTranslation();

	const textColour = disabled ? 'text-gray-500' : 'text-black';

	const greenColour = disabled ? 'bg-green-300' : 'bg-green-500';
	const blueColour = disabled ? 'bg-blue-300' : 'bg-blue-500';
	const redColour = disabled ? 'bg-red-300' : 'bg-red-500';
	const blackColour = disabled ? 'bg-gray-500' : 'bg-black';
	const colourCss =
		toggleColour === ToggleColor.GREEN
			? greenColour
			: toggleColour === ToggleColor.BLUE
			? blueColour
			: toggleColour === ToggleColor.RED
			? redColour
			: blackColour;
	return (
		<div className="mb-4">
			<label className="label" htmlFor={name}>
				{t(label)}
			</label>
			<div className="flex rounded-md shadow-sm">
				<label
					id={name}
					style={{ cursor: disabled ? 'default' : 'pointer' }}
					className="themeSwitcherTwo relative inline-flex select-none items-center mb-3">
					<input
						type="checkbox"
						checked={checked}
						onChange={() => setChecked(!checked)}
						disabled={disabled}
						className="sr-only"
					/>
					<span
						className={`label flex items-center text-sm font-medium ${textColour}`}>
						{t(falseText)}
					</span>
					<span
						className={`slider mx-4 flex h-8 w-[60px] items-center rounded-full p-1 duration-200 ${
							checked ? colourCss : 'bg-gray-300'
						}`}>
						<span
							className={`dot h-6 w-6 rounded-full bg-white duration-200 ${
								checked ? 'translate-x-[28px]' : ''
							}`}
						/>
					</span>
					<span
						className={`label flex items-center text-sm font-medium ${textColour}`}>
						{t(trueText)}
					</span>
				</label>
			</div>
		</div>
	);
};

export default AddToggleSwitch;
