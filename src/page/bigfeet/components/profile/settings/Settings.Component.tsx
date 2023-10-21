import { useState } from 'react';
import { Language } from '../../../../../models/enums';
import { useUserContext } from '../../../BigFeet.Page';
import ToggleSwitch from './ToggleSwitch.Commponent';
import { useNavigate } from 'react-router-dom';
import SaveButton from '../../miscallaneous/SaveButton.Component';
import { updateProfile } from '../../../../../service/profile.service';
import EditableDropDown from '../../miscallaneous/EditableDropDown.Component';
import { languageDropDownItems } from '../../../../../constants/drop-down.constants';

interface SettingsProp {
	editable: boolean;
	language: Language;
	darkMode: boolean;
}

export default function Settings(prop: SettingsProp) {
	const navigate = useNavigate();

	const [saving, setSaving] = useState(false);
	const [error, setError] = useState('');
	const [success, setSuccess] = useState('');

	const [language, setLanguage] = useState<Language | null>(prop.language);

	const { user, setUser } = useUserContext();

	const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
		event.preventDefault();
		setError('');
		setSuccess('');
		const dark_mode: boolean | undefined =
			event.currentTarget.dark_mode?.checked;

		if (!language || dark_mode == undefined) {
			setError('Missing Required Field');
		} else if (language == prop.language && dark_mode == prop.darkMode) {
			setError('No changes were made');
		} else {
			const updateProfileRequest = {
				...(language != prop.language && { language }),
				...(dark_mode != prop.darkMode && { dark_mode }),
			};
			const updatedUser = {
				...user,
				...updateProfileRequest,
			};
			setSaving(true);
			updateProfile(navigate, updateProfileRequest)
				.then(() => {
					sessionStorage.setItem('user', JSON.stringify(updatedUser));
					setUser(updatedUser);
					setSuccess('Profile successfully updated.');
				})
				.catch((error) => setError(error.message))
				.finally(() => setSaving(false));
		}
	};

	return (
		<form onSubmit={handleSubmit}>
			<EditableDropDown
				default={
					languageDropDownItems.find(
						(option) => option.id == prop.language
					) || languageDropDownItems[0]
				}
				options={languageDropDownItems}
				onSelect={(option) => {
					if (option.id == null) setLanguage(null);
					else setLanguage(option.id as Language);
				}}
				label='Language'
				required={true}
				editable={prop.editable}
				missingPermissionMessage='You do not have permission to change employee details.'
				requiredMessage='A language must be selected.'
			/>

			<ToggleSwitch
				name='dark_mode'
				checked={prop.darkMode}
				falseText='Light'
				trueText='Dark'
			/>

			<div className='flex border-t-2 border-gray-400 py-4'>
				<SaveButton
					loading={saving}
					disabled={!prop.editable}
					saveBtnTitle='Save Changes'
					savingBtnTitle='Saving...'
					missingPermissionMessage='You do not have permission to change employee details.'
					error={error}
					success={success}
				/>
			</div>
		</form>
	);
}
