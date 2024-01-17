import { FC, useEffect, useState } from 'react';
import { ToggleColor } from '../add/AddToggleSwitch.Component';
import PermissionsButton from '../PermissionsButton.Component';
import { useTranslation } from 'react-i18next';

interface EditableToggleSwitchProp {
	originalChecked: boolean;
	checked: boolean;
	setChecked(checked: boolean): void;
	falseText: string;
	trueText: string;
	toggleColour: ToggleColor;
	label: string;
	name: string;
	editable: boolean;
	missingPermissionMessage: string;
}

const EditableToggleSwitch: FC<EditableToggleSwitchProp> = ({
	originalChecked,
	checked,
	setChecked,
	falseText,
	trueText,
	toggleColour,
	label,
	name,
	editable,
	missingPermissionMessage,
}) => {
	const { t } = useTranslation();

	const [disabled, setDisabled] = useState(true);

	useEffect(() => {
		setDisabled(true);
	}, [originalChecked]);

	const handleDisableBtnClick = () => {
		if (!disabled) {
			setChecked(originalChecked);
		}
		setDisabled(!disabled);
	};

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
				{label}
			</label>
			<div className="flex rounded-md shadow-sm">
				<label
					id={name}
					style={{ cursor: disabled ? 'default' : 'pointer' }}
					className="themeSwitcherTwo relative inline-flex select-none items-center my-auto">
					<input
						type="checkbox"
						checked={checked}
						onChange={() => setChecked(!checked)}
						disabled={disabled}
						className="sr-only"
					/>
					<span
						className={`label flex items-center text-sm font-medium ${textColour}`}>
						{falseText}
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
						{trueText}
					</span>
				</label>
				<div className="ms-auto">
					<PermissionsButton
						btnTitle={disabled ? t('Change') : t('Cancel')}
						disabled={!editable}
						missingPermissionMessage={missingPermissionMessage}
						onClick={handleDisableBtnClick}
					/>
				</div>
			</div>
		</div>
	);
};

export default EditableToggleSwitch;
