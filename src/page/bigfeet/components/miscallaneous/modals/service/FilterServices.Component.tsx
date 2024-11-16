import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { CalendarDaysIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddDate from '../../add/AddDate.Component';
import AddToggleSwitch, {
	ToggleColor,
} from '../../add/AddToggleSwitch.Component';

import {
	useServiceDateContext,
	useServiceShowDeletedContext,
} from '../../../services/Services.Component';

import { useUserQuery } from '../../../../../hooks/profile.hooks';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';

import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { sameDate } from '../../../../../../utils/date.utils';

interface FilterServicesProp {
	setOpen(open: boolean): void;
}

const FilterServices: FC<FilterServicesProp> = ({ setOpen }) => {
	const { t } = useTranslation();

	const { date, setDate } = useServiceDateContext();
	const { showDeleted, setShowDeleted } = useServiceShowDeletedContext();

	const [selectedDate, setSelectedDate] = useState<Date | null>(date);
	const [selectedShowDeleted, setSelectedShowDeleted] = useState(showDeleted);

	const [invalidDate, setInvalidDate] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const gettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SERVICE
	);

	const onDateFiltered = (updatedDate: Date, updatedShowDeleted: boolean) => {
		setDate(updatedDate);
		setShowDeleted(updatedShowDeleted);
		setOpen(false);
	};

	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<CalendarDaysIcon
							className="h-6 w-6 text-gray-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Filter Services')}
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

							<AddToggleSwitch
								checked={selectedShowDeleted}
								setChecked={setSelectedShowDeleted}
								falseText="Hide"
								trueText="Show"
								toggleColour={ToggleColor.BLUE}
								label={LABELS.service.show_deleted}
								name={NAMES.service.show_deleted}
								disabled={false}
							/>
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				addText={'Filter'}
				disabledAdd={
					!gettable ||
					(selectedDate &&
						sameDate(date, selectedDate) &&
						selectedShowDeleted === showDeleted) ||
					date === null ||
					invalidDate
				}
				addMissingPermissionMessage={
					!gettable
						? ERRORS.service.permissions.get
						: selectedDate &&
						  sameDate(date, selectedDate) &&
						  selectedShowDeleted === showDeleted
						? ERRORS.no_changes
						: date === null
						? ERRORS.required
						: invalidDate
						? ERRORS.invalid
						: ''
				}
				onAdd={() => onDateFiltered(selectedDate as Date, selectedShowDeleted)}
				editText={'Reset Date'}
				disabledEdit={
					selectedDate !== null &&
					(sameDate(selectedDate, new Date()) || sameDate(date, new Date()))
				}
				editMissingPermissionMessage={'Current date already selected.'}
				onEdit={() => onDateFiltered(new Date(), selectedShowDeleted)}
			/>
		</>
	);
};

export default FilterServices;
