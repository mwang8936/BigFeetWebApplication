import { FC, useEffect, useState } from 'react';
import { Language } from '../../../../../models/enums';
import { useUserContext } from '../../../BigFeet.Page';
import { ToggleColor } from '../../miscallaneous/add/AddToggleSwitch.Component';
import { useNavigate } from 'react-router-dom';
import { updateProfile } from '../../../../../service/profile.service';
import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import { languageDropDownItems } from '../../../../../constants/drop-down.constants';
import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';
import ERRORS from '../../../../../constants/error.constants';
import { UpdateProfileRequest } from '../../../../../models/requests/Profile.Request.Model';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import EditableToggleSwitch from '../../miscallaneous/editable/EditableToggleSwitch.Component';
import { useTranslation } from 'react-i18next';
import { getLanguageFile } from '../../../../../constants/language.constants';
import { userKey } from '../../../../../constants/api.constants';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../../utils/toast.utils';

interface SettingsProp {
	originalLanguage: Language;
	originalDarkMode: boolean;
}

const Settings: FC<SettingsProp> = ({ originalLanguage, originalDarkMode }) => {
	const { t, i18n } = useTranslation();
	const navigate = useNavigate();

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

	const { user, setUser } = useUserContext();

	const onSave = async () => {
		const language: Language | undefined =
			languageInput === originalLanguage
				? undefined
				: (languageInput as Language);
		const dark_mode: boolean | undefined =
			darkModeInput === originalDarkMode ? undefined : darkModeInput;

		const updateProfileRequest: UpdateProfileRequest = {
			...(language && { language }),
			...(dark_mode && { dark_mode }),
		};

		const toastId = createLoadingToast(t('Updating Profile...'));

		updateProfile(navigate, updateProfileRequest)
			.then(() => {
				const updatedUser = {
					...user,
					...updateProfileRequest,
				};
				sessionStorage.setItem(userKey, JSON.stringify(updatedUser));
				setUser(updatedUser);
				i18n.changeLanguage(getLanguageFile(updatedUser.language));

				successToast(toastId, t('Profile Updated Successfully'));
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Update Profile'), error.message);
			});
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

			<div className="flex border-t-2 border-gray-400 py-4">
				<PermissionsButton
					btnTitle={t('Save Changes')}
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
