import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';

import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';

import { ToggleColor } from '../../miscallaneous/add/AddToggleSwitch.Component';

import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';
import EditableToggleSwitch from '../../miscallaneous/editable/EditableToggleSwitch.Component';

import { languageDropDownItems } from '../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';
import NAMES from '../../../../../constants/name.constants';

import { Language } from '../../../../../models/enums';

import { UpdateProfileRequest } from '../../../../../models/requests/Profile.Request.Model';

import { updateProfile } from '../../../../../service/profile.service';

import { getLanguageFile } from '../../../../../utils/i18n.utils';
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
	const queryClient = useQueryClient();

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

	const editProfileMutation = useMutation({
		mutationFn: (data: { request: UpdateProfileRequest }) =>
			updateProfile(navigate, data.request),
		onMutate: async () => {
			const toastId = createLoadingToast(t('Updating Profile...'));
			return { toastId };
		},
		onSuccess: (_data, variables, context) => {
			queryClient.invalidateQueries({ queryKey: ['employees'] });
			queryClient.invalidateQueries({ queryKey: ['user'] });

			const updatedLanguage = variables.request.language;

			if (updatedLanguage)
				i18n.changeLanguage(getLanguageFile(updatedLanguage));

			successToast(context.toastId, t('Profile Updated Successfully'));
		},
		onError: (error, _variables, context) => {
			if (context)
				errorToast(
					context.toastId,
					t('Failed to Update Profile'),
					error.message
				);
		},
	});

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

		editProfileMutation.mutate({ request });
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

			<div className="bottom-bar">
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
