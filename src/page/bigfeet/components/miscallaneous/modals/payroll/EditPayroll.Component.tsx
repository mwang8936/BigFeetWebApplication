import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PencilSquareIcon } from '@heroicons/react/24/outline';

import EditBottom from '../EditBottom.Component';

import EditableDropDown from '../../editable/EditableDropDown.Component';
import EditablePayRate from '../../editable/EditablePayRate.Component';

import { usePayrollDateContext } from '../../../payroll/PayRoll.Component';

import { useUpdatePayrollMutation } from '../../../../../hooks/payroll.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import { payrollOptionDropDownItems } from '../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import {
	Language,
	PayrollOption,
	PayrollPart,
	Permissions,
} from '../../../../../../models/enums';
import Payroll from '../../../../../../models/Payroll.Model';
import User from '../../../../../../models/User.Model';

import { UpdatePayrollRequest } from '../../../../../../models/requests/Payroll.Request.Model';

import { getYearMonthString } from '../../../../../../utils/date.utils';

interface EditPayrollProp {
	setOpen(open: boolean): void;
	payroll: Payroll;
}

const EditPayroll: FC<EditPayrollProp> = ({ setOpen, payroll }) => {
	const { t } = useTranslation();

	const { date } = usePayrollDateContext();

	const [optionInput, setOptionInput] = useState<PayrollOption | null>(
		payroll.option
	);
	const [chequeAmountInput, setChequeAmountInput] = useState<number | null>(
		payroll.cheque_amount
	);

	const [invalidChequeAmount, setInvalidChequeAmount] =
		useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_PAYROLL
	);

	useEffect(() => {
		const option: PayrollOption | null | undefined =
			optionInput === payroll.option ? undefined : optionInput;
		const cheque_amount: number | null | undefined =
			chequeAmountInput === payroll.cheque_amount
				? undefined
				: chequeAmountInput;

		const changesMade = option !== undefined || cheque_amount !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput = optionInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [optionInput, chequeAmountInput]);

	useEffect(() => {
		const invalidInput = invalidChequeAmount;

		setInvalidInput(invalidInput);
	}, [invalidChequeAmount]);

	useEffect(() => {
		if (optionInput) {
			if (optionInput !== PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH) {
				setChequeAmountInput(null);
				setInvalidChequeAmount(false);
			}
		} else {
			setChequeAmountInput(null);
			setInvalidChequeAmount(false);
		}
	}, [optionInput]);

	const updatePayrollMutation = useUpdatePayrollMutation({
		onSuccess: () => setOpen(false),
	});
	const onEditPayroll = async (
		year: number,
		month: number,
		part: PayrollPart,
		employeeId: number,
		request: UpdatePayrollRequest
	) => {
		updatePayrollMutation.mutate({ year, month, part, employeeId, request });
	};

	const onEdit = async () => {
		const option: PayrollOption | undefined =
			optionInput === payroll.option
				? undefined
				: (optionInput as PayrollOption);
		const cheque_amount: number | null | undefined =
			chequeAmountInput === payroll.cheque_amount
				? undefined
				: chequeAmountInput;

		const updatePayrollRequest: UpdatePayrollRequest = {
			...(option !== undefined && { option }),
			...(cheque_amount !== undefined && { cheque_amount }),
		};

		onEditPayroll(
			payroll.year,
			payroll.month,
			payroll.part,
			payroll.employee.employee_id,
			updatePayrollRequest
		);
	};

	const displayDate = () => {
		let localeDateFormat;
		if (language === Language.SIMPLIFIED_CHINESE) {
			localeDateFormat = 'zh-CN';
		} else if (language === Language.TRADITIONAL_CHINESE) {
			localeDateFormat = 'zh-TW';
		} else {
			localeDateFormat = undefined;
		}

		return getYearMonthString(date.year, date.month, localeDateFormat);
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
							{t('Edit Payroll')}
						</Dialog.Title>

						<div className="mt-2">
							<h1 className="text-xl font-bold text-gray-900 mt-4">
								{t('Date')}:{' '}
								<span className="text-gray-500 font-extrabold underline">
									{displayDate()}
								</span>
							</h1>

							<h1 className="text-xl font-bold text-gray-900 my-2">
								{t('Employee')}:{' '}
								<span className="text-gray-500 font-extrabold underline">
									{payroll.employee.username}
								</span>
							</h1>

							<h1 className="text-xl font-bold text-gray-900 mb-4">
								{t('Half')}:{' '}
								<span className="text-gray-500 font-extrabold underline">
									{payroll.part === PayrollPart.PART_1
										? t('First')
										: t('Second')}
								</span>
							</h1>

							<EditableDropDown
								originalOption={
									payrollOptionDropDownItems[
										payrollOptionDropDownItems.findIndex(
											(option) => option.id === payroll.option
										) || 0
									]
								}
								option={
									payrollOptionDropDownItems[
										payrollOptionDropDownItems.findIndex(
											(option) => option.id === optionInput
										) || 0
									]
								}
								options={payrollOptionDropDownItems}
								setOption={(option) => {
									setOptionInput(option.id as PayrollOption | null);
								}}
								label={LABELS.payroll.option}
								validationProp={{
									required: true,
									requiredMessage: ERRORS.payroll.option.required,
								}}
								editable={editable}
								missingPermissionMessage={ERRORS.payroll.permissions.edit}
							/>

							{optionInput ===
								PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH && (
								<EditablePayRate
									originalAmount={payroll.cheque_amount}
									amount={chequeAmountInput}
									setAmount={setChequeAmountInput}
									label={LABELS.payroll.cheque_amount}
									name={NAMES.payroll.cheque_amount}
									validationProp={{
										max: NUMBERS.payroll.cheque_amount,
										required: false,
										invalid: invalidChequeAmount,
										setInvalid: setInvalidChequeAmount,
										invalidMessage: ERRORS.payroll.cheque_amount.invalid,
									}}
									placeholder={PLACEHOLDERS.payroll.cheque_amount}
									editable={editable}
									missingPermissionMessage={ERRORS.payroll.permissions.edit}
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			<EditBottom
				onCancel={() => setOpen(false)}
				disabledEdit={
					!editable || !changesMade || missingRequiredInput || invalidInput
				}
				editMissingPermissionMessage={
					!editable
						? ERRORS.payroll.permissions.edit
						: !changesMade
						? ERRORS.no_changes
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onEdit}
			/>
		</>
	);
};

export default EditPayroll;
