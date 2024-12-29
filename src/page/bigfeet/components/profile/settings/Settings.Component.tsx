import { FC, useEffect, useState } from 'react';

import PermissionsButton from '../../miscallaneous/PermissionsButton.Component';

import EditableDropDown from '../../miscallaneous/editable/EditableDropDown.Component';

import { useUpdateProfileSettingsMutation } from '../../../../hooks/profile.hooks';

import { languageDropDownItems } from '../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../constants/error.constants';
import LABELS from '../../../../../constants/label.constants';

import { Language } from '../../../../../models/enums';

import { UpdateProfileRequest } from '../../../../../models/requests/Profile.Request.Model';

interface SettingsProp {
	originalLanguage: Language;
}

const Settings: FC<SettingsProp> = ({ originalLanguage }) => {
	const [languageInput, setLanguageInput] = useState<Language | null>(
		originalLanguage
	);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);

	useEffect(() => {
		setLanguageInput(originalLanguage);

		setChangesMade(false);

		setMissingRequiredInput(false);
	}, [originalLanguage]);

	useEffect(() => {
		const language: Language | null | undefined =
			languageInput === originalLanguage ? undefined : languageInput;

		const changesMade = language !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput = language === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [languageInput]);

	const updateProfileSettingsMutation = useUpdateProfileSettingsMutation({});
	const onSave = async () => {
		const language: Language | undefined =
			languageInput === originalLanguage
				? undefined
				: (languageInput as Language);

		const request: UpdateProfileRequest = {
			...(language !== undefined && { language }),
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
