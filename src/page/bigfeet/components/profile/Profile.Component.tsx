import { FC, useState } from 'react';
import Tabs from '../miscallaneous/Tabs.Component.tsx';
import Personal from './personal/Personal.Component.tsx';
import Professional from './professional/Professional.Component.tsx';
import Settings from './settings/Settings.Component.tsx';
import DatesDisplay from '../miscallaneous/DatesDisplay.Component.tsx';
import { Permissions } from '../../../../models/enums.ts';
import { deleteEmployee } from '../../../../service/employee.service.ts';
import { useNavigate } from 'react-router-dom';
import { logout } from '../../../../service/auth.service.ts';
import { useAuthenticationContext } from '../../../../App.tsx';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import ERRORS from '../../../../constants/error.constants.ts';
import DeleteProfileModal from '../miscallaneous/modals/profile/DeleteProfileModal.Component.tsx';
import { useTranslation } from 'react-i18next';
import {
	createLoadingToast,
	errorToast,
	successToast,
} from '../../../../utils/toast.utils.tsx';
import { useUserQuery } from '../../../../service/query/get-items.query.ts';
import User from '../../../../models/User.Model.ts';
import { useQueryClient } from '@tanstack/react-query';

const Profile: FC = () => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();
	const navigate = useNavigate();

	const [selectedTab, setSelectedTab] = useState(0);
	const tabs = [t('Personal'), t('Professional'), t('Settings')];

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const userQuery = useUserQuery({ gettable: true });
	const user: User = userQuery.data;

	const { setAuthentication } = useAuthenticationContext();

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_EMPLOYEE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

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

	return (
		<div className="w-11/12 mx-auto h-full flex-col">
			<div className="h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between">
				<h1 className="my-auto text-gray-600 text-3xl">
					{t('Edit Your Profile')}
				</h1>
				<div className="h-fit my-auto">
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
					<DeleteProfileModal
						open={openDeleteModal}
						setOpen={setOpenDeleteModal}
						userId={user.employee_id}
						username={user.username}
						deletable={deletable}
						onDeleteUser={onDelete}
					/>
				</div>
			</div>
			<Tabs
				tabs={tabs}
				selectedTab={selectedTab}
				onTabSelected={(tab: number) => setSelectedTab(tab)}
			/>
			<div className="mt-8">
				{selectedTab === 0 ? (
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
				)}
			</div>
			<DatesDisplay updatedAt={user.updated_at} createdAt={user.created_at} />
		</div>
	);
};

export default Profile;
