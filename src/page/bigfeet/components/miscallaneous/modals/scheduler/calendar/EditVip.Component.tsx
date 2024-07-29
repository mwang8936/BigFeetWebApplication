import { FC, useState, useEffect } from 'react';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import Employee from '../../../../../../../models/Employee.Model';
import ERRORS from '../../../../../../../constants/error.constants';
import LABELS from '../../../../../../../constants/label.constants';
import NAMES from '../../../../../../../constants/name.constants';
import LENGTHS from '../../../../../../../constants/lengths.constants';
import PLACEHOLDERS from '../../../../../../../constants/placeholder.constants';
import AddBottom from '../../AddBottom.Component';
import { useTranslation } from 'react-i18next';
import { useScheduleDateContext } from '../../../../scheduler/Scheduler.Component';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';
import NUMBERS from '../../../../../../../constants/numbers.constants';
import PATTERNS from '../../../../../../../constants/patterns.constants';
import VipPackage from '../../../../../../../models/Vip-Package.Model';
import EditBottom from '../../EditBottom.Component';
import EditableMultiSelect from '../../../editable/EditableMultiSelect.Component';
import EditablePayRate from '../../../editable/EditablePayRate.Component';
import { arraysHaveSameContent } from '../../../../../../../utils/array.utils';
import DeleteVipModal from './DeleteVipModal.Component';
import { useNavigate } from 'react-router-dom';
import { Permissions, Role } from '../../../../../../../models/enums';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../../../../../../../service/employee.service';
import {
	useEmployeesQuery,
	useUserQuery,
} from '../../../../../../../service/query/get-items.query';
import User from '../../../../../../../models/User.Model';

interface EditVipProp {
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
	editable: boolean;
	onEditVipPackage(
		serial: string,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const EditVip: FC<EditVipProp> = ({
	setOpen,
	vipPackage,
	editable,
	onEditVipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [soldAmountInput, setSoldAmountInput] = useState<number | null>(
		vipPackage.sold_amount
	);
	const [employeesInput, setEmployeesInput] = useState<number[]>(
		vipPackage.employee_ids
	);
	const [commissionAmountInput, setCommissionAmountInput] = useState<
		number | null
	>(vipPackage.commission_amount);

	const [invalidSoldAmount, setInvalidSoldAmount] = useState<boolean>(false);
	const [invalidCommissionAmount, setInvalidCommissionAmount] =
		useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;
	const { date } = useScheduleDateContext();

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || []
	).filter((employee) => employee.role !== Role.DEVELOPER);

	useEffect(() => {
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
			sold_amount !== undefined ||
			employee_ids !== undefined ||
			commission_amount !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			soldAmountInput === null ||
			employeesInput.length === 0 ||
			commissionAmountInput === null;

		setMissingRequiredInput(missingRequiredInput);
	}, [employeesInput.length, soldAmountInput, commissionAmountInput]);

	useEffect(() => {
		const invalidInput = invalidSoldAmount || invalidCommissionAmount;
		setInvalidInput(invalidInput);
	}, [invalidSoldAmount, invalidCommissionAmount]);

	const onEdit = () => {
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
			...(sold_amount !== undefined && { sold_amount }),
			...(employee_ids !== undefined && { date }),
			...(employee_ids !== undefined && { employee_ids }),
			...(commission_amount !== undefined && { commission_amount }),
		};

		onEditVipPackage(vipPackage.serial, editVipPackageRequest);
		setOpen(false);
	};

	const onDelete = async (serial: string) => {
		onDeleteVipPackage(serial);
		setOpen(false);
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
				deletable={deletable}
				onDeleteVipPackage={onDelete}
			/>
		</>
	);
};

export default EditVip;
