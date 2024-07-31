import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { useQueryClient } from '@tanstack/react-query';

import Personal from './personal/Personal.Component.tsx';
import Professional from './professional/Professional.Component.tsx';
import Settings from './settings/Settings.Component.tsx';

import DatesDisplay from '../miscallaneous/DatesDisplay.Component.tsx';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';

import DeleteProfileModal from '../miscallaneous/modals/profile/DeleteProfileModal.Component.tsx';

import { useAuthenticationContext } from '../../../../App.tsx';

import ERRORS from '../../../../constants/error.constants.ts';

import { Permissions } from '../../../../models/enums.ts';
import User from '../../../../models/User.Model.ts';

import { logout } from '../../../../service/auth.service.ts';
import { deleteEmployee } from '../../../../service/employee.service.ts';

import { useUserQuery } from '../../../../service/query/get-items.query.ts';

import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../utils/toast.utils.tsx';

const Profile: FC = () => {
	const { t } = useTranslation();
	const navigate = useNavigate();
	const queryClient = useQueryClient();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const { setAuthentication } = useAuthenticationContext();

	const userQuery = useUserQuery({ gettable: true });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

	const tabs = [t('Personal'), t('Professional'), t('Settings')];

	const onDelete = async (userId: number) => {
		const toastId = createLoadingToast(t('Deleting Profile...'));

		deleteEmployee(navigate, userId)
			.then(() => {
				successToast(toastId, t('Profile Deleted Successfully'));

				queryClient.clear();
				logout(setAuthentication);
			})
			.catch((error) => {
				errorToast(toastId, t('Failed to Delete Profile'), error.message);
			});
	};

	const profileElement =
		selectedTab === 0 ? (
			<Personal
				editable={editable}
				originalUsername={user.username}
				originalFirstName={user.first_name}
				originalLastName={user.last_name}
				originalGender={user.gender}
			/>
		) : selectedTab === 1 ? (
			<Professional
				editable={editable}
				originalRole={user.role}
				originalFeetRate={user.feet_rate}
				originalBodyRate={user.body_rate}
				originalAcupunctureRate={user.acupuncture_rate}
				originalPerHour={user.per_hour}
			/>
		) : (
			<Settings
				originalLanguage={user.language}
				originalDarkMode={user.dark_mode}
			/>
		);

	return (
		<div className="non-sidebar">
			<div className="title-bar">
				<h1 className="centered-title-text">{t('Edit Your Profile')}</h1>

				<div className="vertical-center">
					<PermissionsButton
						btnTitle={t('Delete')}
						btnType={ButtonType.DELETE}
						top={false}
						disabled={!deletable}
						missingPermissionMessage={ERRORS.employee.permissions.delete}
						onClick={() => {
							setOpenDeleteModal(true);
						}}
					/>
				</div>
			</div>

			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={(tab: number) => setSelectedTab(tab)}
			/>

			<div className="content-div">{profileElement}</div>

			<DatesDisplay updatedAt={user.updated_at} createdAt={user.created_at} />

			<DeleteProfileModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				userId={user.employee_id}
				username={user.username}
				deletable={deletable}
				onDeleteUser={onDelete}
			/>
		</div>
	);
};

export default Profile;
