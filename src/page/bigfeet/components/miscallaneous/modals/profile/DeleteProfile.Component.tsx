import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import DeleteBottom from '../DeleteBottom.Component';

import ERRORS from '../../../../../../constants/error.constants';

interface DeleteProfileProp {
	setOpen(open: boolean): void;
	userId: number;
	username: string;
	deletable: boolean;
	onDeleteUser(userId: number): Promise<void>;
}

const DeleteProfile: FC<DeleteProfileProp> = ({
	setOpen,
	userId,
	username,
	deletable,
	onDeleteUser,
}) => {
	const { t } = useTranslation();

	const onDelete = () => {
		onDeleteUser(userId);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
						<ExclamationTriangleIcon
							className="h-6 w-6 text-red-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Delete Profile', { username: username })}
						</Dialog.Title>

						<div className="mt-2">
							{t(
								'Are you sure you want to delete your profile? This action cannot be reversed.'
							)}
						</div>
					</div>
				</div>
			</div>

			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.employee.permissions.delete}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DeleteProfile;
