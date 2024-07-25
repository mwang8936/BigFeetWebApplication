import { FC, useState, useEffect } from 'react';
import { PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import { useUserContext } from '../../../../../BigFeet.Page';
import Employee from '../../../../../../../models/Employee.Model';
import AddInput from '../../../add/AddInput.Component';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import NAMES from '../../../../../../../constants/name.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';
import AddBottom from '../../AddBottom.Component';
import { useTranslation } from 'react-i18next';
import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';
import { AddVipPackageRequest } from '../../../../../../../models/requests/Vip-Package.Request.Model';
import AddMultiSelect from '../../../add/AddMultiSelect.Component';
import AddPayRate from '../../../add/AddPayRate.Component';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import { Permissions, Role } from '../../../../../../../models/enums';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../../../../../../../service/employee.service';
import { useNavigate } from 'react-router-dom';

interface AddVipProp {
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddVipPackage(request: AddVipPackageRequest): Promise<void>;
}

const AddVip: FC<AddVipProp> = ({ setOpen, creatable, onAddVipPackage }) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [serialInput, setSerialInput] = useState<string | null>(null);
	const [soldAmountInput, setSoldAmountInput] = useState<number | null>(null);
	const [employeesInput, setEmployeesInput] = useState<number[]>([]);
	const [commissionAmountInput, setCommissionAmountInput] = useState<
		number | null
	>(null);

	const [invalidSerial, setInvalidSerial] = useState<boolean>(false);
	const [invalidSoldAmount, setInvalidSoldAmount] = useState<boolean>(false);
	const [invalidCommissionAmount, setInvalidCommissionAmount] =
		useState<boolean>(false);

	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(true);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const { user } = useUserContext();
	const { date } = useScheduleDateContext();

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);

	const employeeQuery = useQuery({
		queryKey: ['employees'],
		queryFn: () => getEmployees(navigate),
		enabled: employeeGettable,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || []
	).filter((employee) => employee.role !== Role.DEVELOPER);

	useEffect(() => {
		const missingRequiredInput =
			serialInput === null ||
			soldAmountInput === null ||
			employeesInput.length === 0 ||
			commissionAmountInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		serialInput,
		soldAmountInput,
		employeesInput.length,
		commissionAmountInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidSerial || invalidSoldAmount || invalidCommissionAmount;

		setInvalidInput(invalidInput);
	}, [invalidSerial, invalidInput]);

	const onAdd = () => {
		const serial = serialInput as string;
		const sold_amount = soldAmountInput as number;
		const employee_ids = employeesInput;
		const commission_amount = commissionAmountInput as number;

		const addVipPackageRequest: AddVipPackageRequest = {
			serial,
			sold_amount,
			commission_amount,
			date,
			employee_ids,
		};

		onAddVipPackage(addVipPackageRequest);
		setOpen(false);
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
							{t('Add Vip Package')}
						</Dialog.Title>
						<div className="mt-2">
							<AddInput
								text={serialInput}
								setText={setSerialInput}
								label={LABELS.vip_package.serial}
								name={NAMES.vip_package.serial}
								type="text"
								validationProp={{
									maxLength: LENGTHS.vip_package.serial,
									pattern: PATTERNS.vip_package.serial,
									required: true,
									requiredMessage: ERRORS.vip_package.serial.required,
									invalid: invalidSerial,
									setInvalid: setInvalidSerial,
									invalidMessage: ERRORS.vip_package.serial.invalid,
								}}
								placeholder={PLACEHOLDERS.vip_package.serial}
							/>

							<AddPayRate
								amount={soldAmountInput}
								setAmount={setSoldAmountInput}
								label={LABELS.vip_package.sold_amount}
								name={NAMES.vip_package.sold_amount}
								validationProp={{
									max: NUMBERS.vip_package.sold_amount,
									required: true,
									requiredMessage: ERRORS.vip_package.sold_amount.required,
									invalid: invalidSoldAmount,
									setInvalid: setInvalidSoldAmount,
									invalidMessage: ERRORS.vip_package.sold_amount.invalid,
								}}
								placeholder={PLACEHOLDERS.vip_package.sold_amount}
							/>

							<AddMultiSelect
								options={employees.map((employee) => ({
									value: employee.employee_id,
									label: employee.username,
								}))}
								values={employeesInput.map((value) => ({
									value: value,
									label:
										employees.find((employee) => employee.employee_id === value)
											?.username || '',
								}))}
								setValues={(selectedValues) =>
									setEmployeesInput(
										selectedValues.map((item) => item.value as number)
									)
								}
								label={LABELS.vip_package.employee_ids}
								name={NAMES.vip_package.employee_ids}
								placeholder={PLACEHOLDERS.vip_package.employee_ids}
							/>

							<AddPayRate
								amount={commissionAmountInput}
								setAmount={setCommissionAmountInput}
								label={LABELS.vip_package.commission_amount}
								name={NAMES.vip_package.commission_amount}
								validationProp={{
									max: NUMBERS.vip_package.commission_amount,
									required: true,
									requiredMessage:
										ERRORS.vip_package.commission_amount.required,
									invalid: invalidCommissionAmount,
									setInvalid: setInvalidCommissionAmount,
									invalidMessage: ERRORS.vip_package.commission_amount.invalid,
								}}
								placeholder={PLACEHOLDERS.vip_package.commission_amount}
							/>
						</div>
					</div>
				</div>
			</div>
			<AddBottom
				onCancel={() => setOpen(false)}
				disabledAdd={!creatable || missingRequiredInput || invalidInput}
				addMissingPermissionMessage={
					!creatable
						? ERRORS.reservation.permissions.add
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

export default AddVip;
