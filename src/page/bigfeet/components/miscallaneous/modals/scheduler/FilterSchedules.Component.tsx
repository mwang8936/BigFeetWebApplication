import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog } from '@headlessui/react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddDate from '../../add/AddDate.Component';

import { useScheduleDateContext } from '../../../scheduler/Scheduler.Component';

import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';

import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { sameDate } from '../../../../../../utils/date.utils';
import { formatDateToQueryKey } from '../../../../../../utils/string.utils';

interface FilterSchedulesProp {
	setOpen(open: boolean): void;
}

const FilterSchedules: FC<FilterSchedulesProp> = ({ setOpen }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { date, setDate } = useScheduleDateContext();

	const [selectedDate, setSelectedDate] = useState<Date | null>(date);

	const [invalidDate, setInvalidDate] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const onDateFiltered = (updatedDate: Date) => {
		if (scheduleGettable && !sameDate(date, updatedDate)) {
			queryClient.invalidateQueries({
				queryKey: ['schedules', formatDateToQueryKey(updatedDate)],
			});
		}

		setDate(updatedDate);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<AdjustmentsHorizontalIcon
							className="h-6 w-6 text-gray-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Filter Reservations')}
						</Dialog.Title>

						<div className="mt-2">
							<AddDate
								date={selectedDate}
								setDate={setSelectedDate}
								label={LABELS.schedule.filter}
								validationProp={{
									minDate: undefined,
									maxDate: undefined,
									required: true,
									requiredMessage: ERRORS.schedule.filter.required,
									invalid: invalidDate,
									setInvalid: setInvalidDate,
									invalidMessage: ERRORS.schedule.filter.invalid,
								}}
							/>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				addText={'Filter'}
				disabledAdd={
					(selectedDate && sameDate(date, selectedDate)) ||
					date === null ||
					invalidDate
				}
				addMissingPermissionMessage={
					selectedDate && sameDate(date, selectedDate)
						? ERRORS.no_changes
						: date === null
						? ERRORS.required
						: invalidDate
						? ERRORS.invalid
						: ''
				}
				onAdd={() => onDateFiltered(selectedDate as Date)}
				editText={'Reset Filter'}
				disabledEdit={
					selectedDate !== null &&
					(sameDate(selectedDate, new Date()) || sameDate(date, new Date()))
				}
				editMissingPermissionMessage={'Current date already selected.'}
				onEdit={() => onDateFiltered(new Date())}
			/>
		</>
	);
};

export default FilterSchedules;
