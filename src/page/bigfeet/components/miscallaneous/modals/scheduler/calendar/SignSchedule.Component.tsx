import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../../EditBottom.Component';

import ERRORS from '../../../../../../../constants/error.constants';

interface SignScheduleProp {
	setOpen(open: boolean): void;
	date: Date;
	signable: boolean;
	onScheduleSigned(date: Date): Promise<void>;
}

const SignSchedule: FC<SignScheduleProp> = ({
	setOpen,
	date,
	signable,
	onScheduleSigned,
}) => {
	const { t } = useTranslation();

	const onSign = () => {
		onScheduleSigned(date);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-blue-100 sm:mx-0 sm:h-10 sm:w-10">
						<PencilSquareIcon
							className="h-6 w-6 text-blue-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Sign Schedule')}
						</Dialog.Title>

						<div className="mt-2">
							{signable
								? t('Sign Off Message', { date: date.toDateString() })
								: t(ERRORS.schedule.permissions.signed)}
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				editText={'Sign'}
				disabledEdit={!signable}
				editMissingPermissionMessage={ERRORS.schedule.permissions.signed}
				onEdit={onSign}
			/>
		</>
	);
};

export default SignSchedule;
