import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import DeleteBottom from '../DeleteBottom.Component';

import AddToggleSwitch, {
	ToggleColor,
} from '../../add/AddToggleSwitch.Component';

import { useUserQuery } from '../../../../../hooks/profile.hooks';
import { useDeleteServiceMutation } from '../../../../../hooks/service.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';

import { Permissions } from '../../../../../../models/enums';
import { Service } from '../../../../../../models/Service.Model';
import User from '../../../../../../models/User.Model';

import { DeleteServiceParam } from '../../../../../../models/params/Service.Param';

interface DeleteServiceProp {
	setOpen(open: boolean): void;
	service: Service;
}

const DeleteService: FC<DeleteServiceProp> = ({ setOpen, service }) => {
	const { t } = useTranslation();

	const [discontinueServiceInput, setDiscontinueServiceInput] = useState(true);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	const deleteServiceMutation = useDeleteServiceMutation({
		onSuccess: () => setOpen(false),
	});
	const onDeleteService = async (serviceId: number) => {
		const params: DeleteServiceParam = {
			discontinue_service: discontinueServiceInput,
		};

		deleteServiceMutation.mutate({ serviceId, params });
	};

	const onDelete = async () => {
		onDeleteService(service.service_id);
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
							{t('Delete Service', { service: service.service_name })}
						</Dialog.Title>

						<div className="mt-2">
							{t(
								'Are you sure you want to delete this service? This will remove the service from the services list. You can reverse this action later.'
							)}

							<div className="mt-2">
								<AddToggleSwitch
									checked={discontinueServiceInput}
									setChecked={setDiscontinueServiceInput}
									falseText=""
									trueText="Discontinue"
									toggleColour={ToggleColor.RED}
									label={LABELS.service.discontinue}
									name={NAMES.service.discontinue}
									disabled={false}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.service.permissions.delete}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DeleteService;
