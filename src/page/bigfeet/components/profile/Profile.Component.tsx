import { useState } from 'react';
import Tabs from '../miscallaneous/Tabs.Component.tsx';
import Personal from './personal/Personal.Component.tsx';
import Professional from './professional/Professional.Component.tsx';
import Settings from './settings/Settings.Component.tsx';
import DatesDisplay from '../miscallaneous/DatesDisplay.Component.tsx';
import { useUserContext } from '../../BigFeet.Page';
import { Permissions } from '../../../../models/enums.ts';
import DeleteButton from '../miscallaneous/DeleteButton.Component.tsx';
import { deleteEmployee } from '../../../../service/employee.service.ts';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../service/auth.service.ts';
import { useAuthenticationContext } from '../../../../App.tsx';

export default function Profile() {
	const navigate = useNavigate();
	const [selectedTab, setSelectedTab] = useState(0);
	const tabs = ['Personal', 'Professional', 'Settings'];

	const [deleting, setDeleting] = useState(false);
	const [deleteError, setDeleteError] = useState('');

	const { user } = useUserContext();
	const { setAuthentication } = useAuthenticationContext();

	const {
		username,
		first_name,
		last_name,
		gender,
		role,
		feet_rate,
		body_rate,
		per_hour,
		permissions,
		language,
		dark_mode,
		updated_at,
		created_at,
	} = user;

	const editable = permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);
	const deletable = permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

	const deleteAccount = () => {
		setDeleteError('');
		setDeleting(true);
		deleteEmployee(navigate, user.employee_id)
			.then(() => logout(setAuthentication))
			.catch((error) => setDeleteError(error.message))
			.finally(() => setDeleting(false));
	};

	return (
		<div className='w-11/12 mx-auto h-full flex-col'>
			<div className='h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between'>
				<h1 className='my-auto text-gray-600 text-3xl'>
					Edit Your Profile
				</h1>
				<div className='h-fit my-auto'>
					<DeleteButton
						loading={deleting}
						disabled={!deletable}
						missingPermissionMessage='You do not have permission to delete employees'
						onDelete={deleteAccount}
						deleteBtnTitle='Delete Profile'
						deletingBtnTitle='Deleting Profile...'
						deleteTitle={`Delete Profile: ${username}`}
						deleteMsg='Are you sure you want to
                    delete your account? This
                    action cannot be reversed.'
						error={deleteError}
						success=''
					/>
				</div>
			</div>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={(tab: number) => setSelectedTab(tab)}
			/>
			<div className='mt-8'>
				{selectedTab === 0 ? (
					<Personal
						editable={editable}
						username={username}
						firstName={first_name}
						lastName={last_name}
						gender={gender}
					/>
				) : selectedTab === 1 ? (
					<Professional
						editable={editable}
						role={role}
						feetRate={feet_rate}
						bodyRate={body_rate}
						perHour={per_hour}
					/>
				) : (
					<Settings
						editable={editable}
						language={language}
						darkMode={dark_mode}
					/>
				)}
			</div>
			<DatesDisplay updatedAt={updated_at} createdAt={created_at} />
		</div>
	);
}
