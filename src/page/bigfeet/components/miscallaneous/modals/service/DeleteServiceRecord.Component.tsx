import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import DeleteBottom from '../DeleteBottom.Component';

import { useUserQuery } from '../../../../../hooks/profile.hooks';
import { useDeleteServiceRecordMutation } from '../../../../../hooks/service.hooks';

import ERRORS from '../../../../../../constants/error.constants';

import { Permissions } from '../../../../../../models/enums';
import { ServiceRecord } from '../../../../../../models/Service.Model';
import User from '../../../../../../models/User.Model';

interface DeleteServiceRecordProp {
	setOpen(open: boolean): void;
	record: ServiceRecord;
}

const DeleteServiceRecord: FC<DeleteServiceRecordProp> = ({
	setOpen,
	record,
}) => {
	const { t } = useTranslation();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SERVICE
	);

	const deleteServiceRecordMutation = useDeleteServiceRecordMutation({
		onSuccess: () => setOpen(false),
	});
	const onDeleteServiceRecord = async (serviceId: number, validFrom: Date) => {
		deleteServiceRecordMutation.mutate({ serviceId, validFrom });
	};

	const onDelete = async () => {
		onDeleteServiceRecord(record.service_id, record.valid_from);
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
							{t('Delete Record', {
								name: record.service_name,
								date: record.valid_from.toISOString(),
							})}
						</Dialog.Title>

						<div className="mt-2">
							{t(
								'Are you sure you want to delete this record? This action cannot be reversed.'
							)}
						</div>
					</div>
				</div>
			</div>

			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!editable}
				deleteMissingPermissionMessage={ERRORS.service.permissions.edit}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DeleteServiceRecord;
