import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddDate from '../../add/AddDate.Component';

import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';

import { sameDate } from '../../../../../../utils/date.utils';

interface FilterDateProp {
	setOpen(open: boolean): void;
	date: Date;
	onDateSelected(date: Date): void;
	editable: boolean;
	selectPast: boolean;
	selectFuture: boolean;
}

const FilterDate: FC<FilterDateProp> = ({
	setOpen,
	date,
	onDateSelected,
	editable,
	selectPast,
	selectFuture,
}) => {
	const { t } = useTranslation();

	const [selectedDate, setSelectedDate] = useState<Date | null>(date);

	const [invalidDate, setInvalidDate] = useState<boolean>(false);

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
									minDate: selectPast ? undefined : new Date(),
									maxDate: selectFuture ? undefined : new Date(),
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
					!editable ||
					(selectedDate && sameDate(date, selectedDate)) ||
					date === null ||
					invalidDate
				}
				addMissingPermissionMessage={
					!editable
						? ERRORS.schedule.permissions.get
						: selectedDate && sameDate(date, selectedDate)
						? ERRORS.no_changes
						: date === null
						? ERRORS.required
						: invalidDate
						? ERRORS.invalid
						: ''
				}
				onAdd={() => {
					onDateSelected(selectedDate as Date);
					setOpen(false);
				}}
				editText={'Reset Filter'}
				disabledEdit={
					!editable ||
					(selectedDate !== null && sameDate(selectedDate, new Date()))
				}
				editMissingPermissionMessage={
					!editable
						? ERRORS.schedule.permissions.get
						: 'Current date already selected.'
				}
				onEdit={() => {
					onDateSelected(selectedDate as Date);
					setOpen(false);
				}}
			/>
		</>
	);
};

export default FilterDate;
