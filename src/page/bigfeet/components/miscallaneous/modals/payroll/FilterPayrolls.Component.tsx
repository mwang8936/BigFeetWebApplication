import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useQueryClient } from '@tanstack/react-query';

import { Dialog } from '@headlessui/react';

import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';

import AddBottom from '../AddBottom.Component';

import AddNumber from '../../add/AddNumber.Component';
import AddDropDown from '../../add/AddDropDown.Component';

import { usePayrollDateContext } from '../../../payroll/PayRoll.Component';

import { payrollsQueryKey } from '../../../../../hooks/payroll.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import { monthDropDownItems } from '../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';

import { Permissions } from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

interface FilterPayrollsProp {
	setOpen(open: boolean): void;
}

const FilterPayrolls: FC<FilterPayrollsProp> = ({ setOpen }) => {
	const { t } = useTranslation();
	const queryClient = useQueryClient();

	const { date, setDate } = usePayrollDateContext();

	const [yearInput, setYearInput] = useState<number | null>(date.year);
	const [monthInput, setMonthInput] = useState<number | null>(date.month);

	const [invalidYear, setInvalidYear] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const payrollGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_PAYROLL
	);

	const onDateFiltered = (updatedDate: { year: number; month: number }) => {
		if (
			payrollGettable &&
			updatedDate.year !== yearInput &&
			updatedDate.month !== monthInput
		) {
			queryClient.invalidateQueries({
				queryKey: [payrollsQueryKey, updatedDate.year, updatedDate.month],
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
							{t('Filter Payrolls')}
						</Dialog.Title>

						<div className="mt-2">
							<AddNumber
								input={yearInput}
								setInput={setYearInput}
								label={LABELS.payroll.year}
								name={NAMES.payroll.year}
								placeholder={NAMES.payroll.year}
								validationProp={{
									min: NUMBERS.payroll.year.min,
									required: true,
									requiredMessage: ERRORS.payroll.year.required,
									invalid: invalidYear,
									setInvalid: setInvalidYear,
									invalidMessage: ERRORS.payroll.year.invalid,
								}}
							/>

							<AddDropDown
								option={
									monthDropDownItems[
										monthDropDownItems.findIndex(
											(option) => option.id === monthInput
										) || 0
									]
								}
								options={monthDropDownItems}
								setOption={(option) => {
									setMonthInput(option.id as number | null);
								}}
								label={LABELS.payroll.month}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.payroll.month.required,
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
					(yearInput === date.year && monthInput === date.month) ||
					yearInput === null ||
					monthInput === null ||
					invalidYear
				}
				addMissingPermissionMessage={
					yearInput === date.year && monthInput === date.month
						? ERRORS.no_changes
						: yearInput === null || monthInput === null
						? ERRORS.required
						: invalidYear
						? ERRORS.invalid
						: ''
				}
				onAdd={() =>
					onDateFiltered({
						year: yearInput as number,
						month: monthInput as number,
					})
				}
				editText={'Reset Filter'}
				disabledEdit={
					yearInput !== null &&
					monthInput !== null &&
					((yearInput === new Date().getFullYear() &&
						monthInput === new Date().getMonth() + 1) ||
						(date.year === new Date().getFullYear() &&
							date.month === new Date().getMonth() + 1))
				}
				editMissingPermissionMessage={'Current date already selected.'}
				onEdit={() =>
					onDateFiltered({
						year: new Date().getFullYear(),
						month: new Date().getMonth() + 1,
					})
				}
			/>
		</>
	);
};

export default FilterPayrolls;
