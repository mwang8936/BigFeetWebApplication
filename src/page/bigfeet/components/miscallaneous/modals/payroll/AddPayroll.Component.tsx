import { FC, useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';

import { PlusCircleIcon } from '@heroicons/react/20/solid';

import AddBottom from '../AddBottom.Component';

import AddDropDown from '../../add/AddDropDown.Component';
import AddPayRate from '../../add/AddPayRate.Component';

import { usePayrollDateContext } from '../../../payroll/PayRoll.Component';

import { useAddPayrollMutation } from '../../../../../hooks/payroll.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

import { payrollOptionDropDownItems } from '../../../../../../constants/drop-down.constants';
import ERRORS from '../../../../../../constants/error.constants';
import LABELS from '../../../../../../constants/label.constants';
import NAMES from '../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../constants/numbers.constants';
import PLACEHOLDERS from '../../../../../../constants/placeholder.constants';

import Employee from '../../../../../../models/Employee.Model';
import {
	Language,
	PayrollOption,
	PayrollPart,
	Permissions,
	Role,
} from '../../../../../../models/enums';
import User from '../../../../../../models/User.Model';

import { AddPayrollRequest } from '../../../../../../models/requests/Payroll.Request.Model';

import { getYearMonthString } from '../../../../../../utils/date.utils';

interface AddPayrollProp {
	setOpen(open: boolean): void;
	payrollPart: PayrollPart;
	employee: Employee;
}

const AddPayroll: FC<AddPayrollProp> = ({ setOpen, payrollPart, employee }) => {
	const { t } = useTranslation();

	const { date } = usePayrollDateContext();

	let defaultOption = PayrollOption.STORE_EMPLOYEE;

	switch (employee.role) {
		case Role.RECEPTIONIST:
			defaultOption = PayrollOption.RECEPTIONIST;
			break;
		case Role.ACUPUNCTURIST:
			defaultOption = PayrollOption.ACUPUNCTURIST;
			break;
	}

	const [optionInput, setOptionInput] = useState<PayrollOption | null>(
		defaultOption || null
	);
	const [chequeAmountInput, setChequeAmountInput] = useState<number | null>(
		null
	);

	const [invalidChequeAmount, setInvalidChequeAmount] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const language = user.language;

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_PAYROLL
	);

	useEffect(() => {
		const missingRequiredInput = optionInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [optionInput]);

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

	const addPayrollMutation = useAddPayrollMutation({
		onSuccess: () => setOpen(false),
	});
	const onAddPayroll = async (request: AddPayrollRequest) => {
		addPayrollMutation.mutate({ request });
	};

	const onAdd = async () => {
		const year = date.year;
		const month = date.month;
		const part = payrollPart;
		const employee_id = employee.employee_id;
		const option = optionInput as PayrollOption;
		const cheque_amount = chequeAmountInput;

		const addPayrollRequest: AddPayrollRequest = {
			year,
			month,
			part,
			employee_id,
			option,
			cheque_amount,
		};

		onAddPayroll(addPayrollRequest);
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
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
						<PlusCircleIcon
							className="h-6 w-6 text-green-600"
							aria-hidden="true"
						/>
					</div>

					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Add Payroll')}
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
									{employee.username}
								</span>
							</h1>

							<h1 className="text-xl font-bold text-gray-900 mb-4">
								{t('Half')}:{' '}
								<span className="text-gray-500 font-extrabold underline">
									{payrollPart === PayrollPart.PART_1
										? t('First')
										: t('Second')}
								</span>
							</h1>

							<AddDropDown
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
							/>

							{optionInput ===
								PayrollOption.STORE_EMPLOYEE_WITH_TIPS_AND_CASH && (
								<AddPayRate
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
								/>
							)}
						</div>
					</div>
				</div>
			</div>

			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || invalidInput}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.employee.permissions.add
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onAdd={onAdd}
			/>
		</>
	);
};

export default AddPayroll;
