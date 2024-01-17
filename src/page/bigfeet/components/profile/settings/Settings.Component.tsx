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
import { ToastContainer, toast } from 'react-toastify';
import { UpdateProfileRequest } from '../../../../../models/requests/Profile.Request.Model';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';
import EditableToggleSwitch from '../../miscallaneous/editable/EditableToggleSwitch.Component';
import { useTranslation } from 'react-i18next';
import { getLanguageFile } from '../../../../../constants/language.constants';

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

		const toastId = toast.loading(t('Updating Profile...'));

		updateProfile(navigate, updateProfileRequest)
			.then(() => {
				const updatedUser = {
					...user,
					...updateProfileRequest,
				};
				sessionStorage.setItem('user', JSON.stringify(updatedUser));
				setUser(updatedUser);
				i18n.changeLanguage(getLanguageFile(user.language));

				toast.update(toastId, {
					render: t('Profile Updated Successfully'),
					type: 'success',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
			})
			.catch((error) => {
				toast.update(toastId, {
					render: (
						<h1>
							{t('Failed to Update Profile')} <br />
							{error.message}
						</h1>
					),
					type: 'error',
					isLoading: false,
					position: 'top-right',
					autoClose: 5000,
					hideProgressBar: false,
					closeOnClick: true,
					pauseOnHover: true,
					pauseOnFocusLoss: true,
					draggable: true,
					theme: 'light',
				});
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
				falseText={t('Light')}
				trueText={t('Dark')}
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
			<ToastContainer limit={5} />
		</>
	);
};

export default Settings;
