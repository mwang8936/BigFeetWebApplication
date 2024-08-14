import { FC, useEffect, useState } from 'react';

import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';

import { ToggleColor } from '../../miscallaneous/add/AddToggleSwitch.Component';

import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import EditableToggleSwitch from '../../miscallaneous/editable/EditableToggleSwitch.Component';

import { useUpdateProfileSettingsMutation } from '../../../../hooks/profile.hooks';

import { languageDropDownItems } from '../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';

import { Language } from '../../../../../models/enums';

import { UpdateProfileRequest } from '../../../../../models/requests/Profile.Request.Model';

interface SettingsProp {
	originalLanguage: Language;
	originalDarkMode: boolean;
}

const Settings: FC<SettingsProp> = ({ originalLanguage, originalDarkMode }) => {
	const [languageInput, setLanguageInput] = useState<Language | null>(
		originalLanguage
	);
	const [darkModeInput, setDarkModeInput] = useState<boolean>(originalDarkMode);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);

	useEffect(() => {
		setLanguageInput(originalLanguage);
		setDarkModeInput(originalDarkMode);

		setChangesMade(false);

		setMissingRequiredInput(false);
	}, [originalLanguage, originalDarkMode]);

	useEffect(() => {
		const language: Language | null | undefined =
			languageInput === originalLanguage ? undefined : languageInput;
		const dark_mode: boolean | undefined =
			darkModeInput === originalDarkMode ? undefined : darkModeInput;

		const changesMade = language !== undefined || dark_mode !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput = language === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [languageInput, darkModeInput]);

	const updateProfileSettingsMutation = useUpdateProfileSettingsMutation({});

	const onSave = async () => {
		const language: Language | undefined =
			languageInput === originalLanguage
				? undefined
				: (languageInput as Language);
		const dark_mode: boolean | undefined =
			darkModeInput === originalDarkMode ? undefined : darkModeInput;

		const request: UpdateProfileRequest = {
			...(language !== undefined && { language }),
			...(dark_mode !== undefined && { dark_mode }),
		};

		updateProfileSettingsMutation.mutate({ request });
	};

	return (
		<>
			<EditableDropDown
				originalOption={
					languageDropDownItems[
						languageDropDownItems.findIndex(
							(option) => option.id === originalLanguage
						) || 0
					]
				}
				options={languageDropDownItems}
				option={
					languageDropDownItems[
						languageDropDownItems.findIndex(
							(option) => option.id === languageInput
						) || 0
					]
				}
				setOption={(option) => setLanguageInput(option.id as Language | null)}
				label={LABELS.profile.language}
				validationProp={{
					required: true,
					requiredMessage: ERRORS.profile.language.required,
				}}
				editable={true}
				missingPermissionMessage=""
			/>

			<EditableToggleSwitch
				originalChecked={originalDarkMode}
				checked={darkModeInput}
				setChecked={setDarkModeInput}
				falseText={'Light'}
				trueText={'Dark'}
				toggleColour={ToggleColor.BLACK}
				label={LABELS.profile.dark_mode}
				name={NAMES.profile.dark_mode}
				editable={true}
				missingPermissionMessage=""
			/>

			<div className="bottom-bar">
				<PermissionsButton
					btnTitle={'Save Changes'}
					right={false}
					disabled={!changesMade || missingRequiredInput}
					missingPermissionMessage={
						!changesMade
							? ERRORS.no_changes
							: missingRequiredInput
							? ERRORS.required
							: ''
					}
					onClick={onSave}
				/>
			</div>
		</>
	);
};

export default Settings;
