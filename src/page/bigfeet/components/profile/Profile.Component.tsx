import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import Personal from './personal/Personal.Component.tsx';
import Professional from './professional/Professional.Component.tsx';
import Settings from './settings/Settings.Component.tsx';

import DatesDisplay from '../miscallaneous/DatesDisplay.Component.tsx';
import PermissionsButton, {
	ButtonType,
} from '../miscallaneous/PermissionsButton.Component.tsx';
import Tabs from '../miscallaneous/Tabs.Component.tsx';

import DeleteProfileModal from '../miscallaneous/modals/profile/DeleteProfileModal.Component.tsx';

import { useUserQuery } from '../../../hooks/profile.hooks.ts';

import ERRORS from '../../../../constants/error.constants.ts';

import { Permissions } from '../../../../models/enums.ts';
import User from '../../../../models/User.Model.ts';

const Profile: FC = () => {
	const { t } = useTranslation();

	const [selectedTab, setSelectedTab] = useState(0);

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const userQuery = useUserQuery({ gettable: true });
	const user: User = userQuery.data;

	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_EMPLOYEE
	);

	const tabs = [t('Personal'), t('Professional'), t('Settings')];

	const profileElement =
		selectedTab === 0 ? (
			<Personal
				originalUsername={user.username}
				originalFirstName={user.first_name}
				originalLastName={user.last_name}
				originalGender={user.gender}
			/>
		) : selectedTab === 1 ? (
			<Professional
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
						btnTitle={'Delete'}
						btnType={ButtonType.DELETE}
						top={false}
						disabled={!deletable}
						missingPermissionMessage={ERRORS.employee.permissions.delete}
						onClick={() => setOpenDeleteModal(true)}
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

			<DeleteProfileModal open={openDeleteModal} setOpen={setOpenDeleteModal} />
		</div>
	);
};

export default Profile;
