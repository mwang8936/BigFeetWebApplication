import { FC } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import DeleteBottom from '../DeleteBottom.Component';
import ERRORS from '../../../../../../constants/error.constants';
import { useTranslation } from 'react-i18next';

interface DeleteServiceProp {
	setOpen(open: boolean): void;
	serviceId: number;
	serviceName: string;
	deletable: boolean;
	onDeleteService(serviceId: number): Promise<void>;
}

const DeleteService: FC<DeleteServiceProp> = ({
	setOpen,
	serviceId,
	serviceName,
	deletable,
	onDeleteService,
}) => {
	const { t } = useTranslation();

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
							{t('Delete Service', { service: serviceName })}
						</Dialog.Title>
						<div className="mt-2">
							{t(
								'Are you sure you want to delete this service? This action cannot be reversed.'
							)}
						</div>
					</div>
				</div>
			</div>
			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.service.permissions.delete}
				onDelete={() => {
					onDeleteService(serviceId);
					setOpen(false);
				}}
			/>
		</>
	);
};

export default DeleteService;
