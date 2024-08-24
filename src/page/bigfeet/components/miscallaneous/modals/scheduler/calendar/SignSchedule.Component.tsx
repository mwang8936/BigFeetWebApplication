import { FC } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../../EditBottom.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useSignProfileScheduleMutation } from '../../../../../../hooks/schedule.hooks';

import ERRORS from '../../../../../../../constants/error.constants';

import { Language, Role } from '../../../../../../../models/enums';
import User from '../../../../../../../models/User.Model';

interface SignScheduleProp {
	setOpen(open: boolean): void;
	employeeId: number;
}

const SignSchedule: FC<SignScheduleProp> = ({ setOpen, employeeId }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const signable =
		user.employee_id === employeeId ||
		[Role.DEVELOPER, Role.MANAGER, Role.RECEPTIONIST].includes(user.role);

	const language = user.language;

	let localeDateFormat;
	if (language === Language.SIMPLIFIED_CHINESE) {
		localeDateFormat = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		localeDateFormat = 'zh-TW';
	} else {
		localeDateFormat = undefined;
	}

	const dateString = date.toLocaleDateString(localeDateFormat, {
		year: 'numeric',
		month: 'long',
		day: 'numeric',
		weekday: 'short',
	});

	const signProfileScheduleMutation = useSignProfileScheduleMutation({
		onSuccess: () => setOpen(false),
	});
	const onScheduleSigned = async (date: Date) => {
		signProfileScheduleMutation.mutate({ date });
	};

	const onSign = () => {
		onScheduleSigned(date);
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
								? t('Sign Off Message', { date: dateString })
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
