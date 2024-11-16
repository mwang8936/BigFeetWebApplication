import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PlusCircleIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddToggleSwitch, {
	ToggleColor,
} from '../../add/AddToggleSwitch.Component';

import { useUserQuery } from '../../../../../hooks/profile.hooks';
import { useRecoverServiceMutation } from '../../../../../hooks/service.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';

import { Permissions } from '../../../../../../models/enums';
import { Service } from '../../../../../../models/Service.Model';
import User from '../../../../../../models/User.Model';

import { RecoverServiceParam } from '../../../../../../models/params/Service.Param';

interface RecoverServiceProp {
	setOpen(open: boolean): void;
	service: Service;
}

const RecoverService: FC<RecoverServiceProp> = ({ setOpen, service }) => {
	const { t } = useTranslation();

	const [continueServiceInput, setContinueServiceInput] = useState(true);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SERVICE
	);

	const recoverServiceMutation = useRecoverServiceMutation({
		onSuccess: () => setOpen(false),
	});
	const onRecoverService = async (serviceId: number) => {
		const params: RecoverServiceParam = {
			continue_service: continueServiceInput,
		};

		recoverServiceMutation.mutate({ serviceId, params });
	};

	const onRecover = async () => {
		onRecoverService(service.service_id);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<PlusCircleIcon
							className="h-6 w-6 text-green-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Recover Service', { service: service.service_name })}
						</Dialog.Title>

						<div className="mt-2">
							{t('Are you sure you want to recover this service?')}

							<div className="mt-2">
								<AddToggleSwitch
									checked={continueServiceInput}
									setChecked={setContinueServiceInput}
									falseText=""
									trueText="Continue"
									toggleColour={ToggleColor.GREEN}
									label={LABELS.service.continue}
									name={NAMES.service.continue}
									disabled={false}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!deletable}
				addMissingPermissionMessage={ERRORS.service.permissions.recover}
				onAdd={onRecover}
			/>
		</>
	);
};

export default RecoverService;
