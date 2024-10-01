import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';

import { Dialog } from '@headlessui/react';
import { PencilSquareIcon } from '@heroicons/react/24/outline';

import DeleteVipModal from './DeleteVipModal.Component';

import EditBottom from '../../EditBottom.Component';

import EditableInput from '../../../editable/EditableInput.Component';
import EditableMultiSelect from '../../../editable/EditableMultiSelect.Component';
import EditablePayRate from '../../../editable/EditablePayRate.Component';

import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';

import { useEmployeesQuery } from '../../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../../hooks/profile.hooks';
import { useUpdateVipPackageMutation } from '../../../../../../hooks/vip-package.hooks';

import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import NAMES from '../../../../../../../constants/name.constants';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';

import Employee from '../../../../../../../models/Employee.Model';
import { Permissions, Role } from '../../../../../../../models/enums';
import User from '../../../../../../../models/User.Model';
import VipPackage from '../../../../../../../models/Vip-Package.Model';

import { UpdateVipPackageRequest } from '../../../../../../../models/requests/Vip-Package.Request.Model';

import { arraysHaveSameContent } from '../../../../../../../utils/array.utils';

interface EditVipProp {
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
}

const EditVip: FC<EditVipProp> = ({ setOpen, vipPackage }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [serialInput, setSerialInput] = useState<string | null>(
		vipPackage.serial
	);
	const [soldAmountInput, setSoldAmountInput] = useState<number | null>(
		vipPackage.sold_amount
	);
	const [employeesInput, setEmployeesInput] = useState<number[]>(
		vipPackage.employee_ids
	);
	const [commissionAmountInput, setCommissionAmountInput] = useState<
		number | null
	>(vipPackage.commission_amount);

	const [invalidSerial, setInvalidSerial] = useState<boolean>(false);
	const [invalidSoldAmount, setInvalidSoldAmount] = useState<boolean>(false);
	const [invalidCommissionAmount, setInvalidCommissionAmount] =
		useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_VIP_PACKAGE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_VIP_PACKAGE
	);

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	useEffect(() => {
		const serial: string | null | undefined =
			serialInput === vipPackage.serial ? undefined : serialInput;
		const sold_amount: number | null | undefined =
			soldAmountInput === vipPackage.sold_amount ? undefined : soldAmountInput;
		const employee_ids: number[] | undefined = arraysHaveSameContent(
			employeesInput,
			vipPackage.employee_ids
		)
			? undefined
			: (employeesInput as number[]);
		const commission_amount: number | null | undefined =
			commissionAmountInput === vipPackage.commission_amount
				? undefined
				: commissionAmountInput;

		const changesMade =
			serial !== undefined ||
			sold_amount !== undefined ||
			employee_ids !== undefined ||
			commission_amount !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			serialInput === null ||
			soldAmountInput === null ||
			employeesInput.length === 0 ||
			commissionAmountInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [
		serialInput,
		employeesInput.length,
		soldAmountInput,
		commissionAmountInput,
	]);

	useEffect(() => {
		const invalidInput =
			invalidSerial || invalidSoldAmount || invalidCommissionAmount;
		setInvalidInput(invalidInput);
	}, [invalidSerial, invalidSoldAmount, invalidCommissionAmount]);

	const updateVipPackageMutation = useUpdateVipPackageMutation({
		onSuccess: () => setOpen(false),
	});
	const onEditVipPackage = async (
		vipPackageId: number,
		request: UpdateVipPackageRequest,
		originalDate: Date,
		newDate?: Date
	) => {
		updateVipPackageMutation.mutate({
			vipPackageId,
			request,
			originalDate,
			newDate,
		});
	};

	const onEdit = () => {
		const serial: string | undefined =
			serialInput === vipPackage.serial ? undefined : (serialInput as string);
		const sold_amount: number | undefined =
			soldAmountInput === vipPackage.sold_amount
				? undefined
				: (soldAmountInput as number);
		const employee_ids: number[] | undefined = arraysHaveSameContent(
			employeesInput,
			vipPackage.employee_ids
		)
			? undefined
			: (employeesInput as number[]);
		const commission_amount: number | undefined =
			commissionAmountInput === vipPackage.commission_amount
				? undefined
				: (commissionAmountInput as number);

		const editVipPackageRequest: UpdateVipPackageRequest = {
			...(serial !== undefined && { serial }),
			...(sold_amount !== undefined && { sold_amount }),
			...(employee_ids !== undefined && { date }),
			...(employee_ids !== undefined && { employee_ids }),
			...(commission_amount !== undefined && { commission_amount }),
		};

		onEditVipPackage(
			vipPackage.vip_package_id,
			editVipPackageRequest,
			date,
			undefined
		);
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
							{t('Edit Serial')}
						</Dialog.Title>

						<div className="mt-2">
							<EditableInput
								originalText={vipPackage.serial}
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
								editable={editable}
								missingPermissionMessage={ERRORS.vip_package.permissions.edit}
							/>

							<EditablePayRate
								originalAmount={vipPackage.sold_amount}
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
								editable={editable}
								missingPermissionMessage={ERRORS.vip_package.permissions.edit}
							/>

							<EditableMultiSelect
								originalValues={vipPackage.employee_ids.map((value) => ({
									value: value,
									label:
										employees.find((employee) => employee.employee_id === value)
											?.username || '',
								}))}
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
								editable={editable}
								missingPermissionMessage={ERRORS.vip_package.permissions.edit}
							/>

							<EditablePayRate
								originalAmount={vipPackage.commission_amount}
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
								editable={editable}
								missingPermissionMessage={ERRORS.vip_package.permissions.edit}
							/>
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
						? ERRORS.vip_package.permissions.edit
						: !changesMade
						? ERRORS.no_changes
						: missingRequiredInput
						? ERRORS.required
						: invalidInput
						? ERRORS.invalid
						: ''
				}
				onEdit={onEdit}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.vip_package.permissions.delete}
				onDelete={() => setOpenDeleteModal(true)}
			/>

			<DeleteVipModal
				open={openDeleteModal}
				setOpen={setOpenDeleteModal}
				vipPackage={vipPackage}
			/>
		</>
	);
};

export default EditVip;
