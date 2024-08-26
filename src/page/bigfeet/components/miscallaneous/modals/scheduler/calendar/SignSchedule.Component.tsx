import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../../EditBottom.Component';

import AddInput from '../../../add/AddInput.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useSignScheduleMutation } from '../../../../../../hooks/schedule.hooks';

import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../../constants/name.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';

import Employee from '../../../../../../../models/Employee.Model';
import { Language, Permissions } from '../../../../../../../models/enums';
import User from '../../../../../../../models/User.Model';

import { SignScheduleRequest } from '../../../../../../../models/requests/Schedule.Request.Model';

interface SignScheduleProp {
	setOpen(open: boolean): void;
	employee: Employee;
}

const SignSchedule: FC<SignScheduleProp> = ({ setOpen, employee }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [passwordInput, setPasswordInput] = useState<string | null>(null);

	const [invalidPassword, setInvalidPassword] = useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const signable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SCHEDULE
	);

	useEffect(() => {
		const missingRequiredInput = passwordInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [passwordInput]);

	useEffect(() => {
		const invalidInput = invalidPassword;

		setInvalidInput(invalidInput);
	}, [invalidPassword]);

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

	const signProfileScheduleMutation = useSignScheduleMutation({
		onSuccess: () => setOpen(false),
	});
	const onScheduleSigned = async (
		date: Date,
		employeeId: number,
		request: SignScheduleRequest
	) => {
		signProfileScheduleMutation.mutate({ date, employeeId, request });
	};

	const onSign = () => {
		const password = (passwordInput as string).trim();

		const signScheduleRequest: SignScheduleRequest = {
			password,
		};

		onScheduleSigned(date, employee.employee_id, signScheduleRequest);
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
							{t('Sign Schedule')}: {employee.username}
						</Dialog.Title>

						<div className="mt-2">
							{signable
								? t('Sign Off Message', { date: dateString })
								: t(ERRORS.schedule.permissions.signed)}

							<div className="mt-4">
								<AddInput
									text={passwordInput}
									setText={setPasswordInput}
									label={LABELS.employee.password}
									name={NAMES.employee.password}
									type="password"
									validationProp={{
										pattern: PATTERNS.employee.password,
										maxLength: LENGTHS.employee.password,
										required: true,
										requiredMessage: ERRORS.employee.password.required,
										invalid: invalidPassword,
										setInvalid: setInvalidPassword,
										invalidMessage: ERRORS.employee.password.invalid,
									}}
									placeholder={PLACEHOLDERS.employee.password}
								/>
							</div>
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				editText={'Sign'}
				disabledEdit={!signable || missingRequiredInput || invalidInput}
				editMissingPermissionMessage={
					!signable
						? ERRORS.schedule.permissions.signed
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onSign}
			/>
		</>
	);
};

export default SignSchedule;
