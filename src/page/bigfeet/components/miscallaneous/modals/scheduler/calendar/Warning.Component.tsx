import { FC } from 'react';

import { Dialog } from '@headlessui/react';

import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';

import ModalPermissionsButton from '../../ModalPermissionsButton.Component';

import { ButtonType } from '../../../PermissionsButton.Component';

interface WarningProp {
	setOpen(open: boolean): void;
	title: string;
	message: string;
}

const Warning: FC<WarningProp> = ({ setOpen, title, message }) => {
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
							{title}
						</Dialog.Title>

						<div className="mt-2">{message}</div>
					</div>
				</div>
			</div>

			<div className="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
				<ModalPermissionsButton
					btnTitle="Okay"
					btnType={ButtonType.CANCEL}
					disabled={false}
					missingPermissionMessage=""
					onClick={() => setOpen(false)}
				/>
			</div>
		</>
	);
};

export default Warning;
