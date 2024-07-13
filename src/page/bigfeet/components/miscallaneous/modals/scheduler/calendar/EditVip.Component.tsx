import { FC, useState, useEffect } from 'react';
import { PencilSquareIcon, PlusCircleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import {
	useEmployeesContext,
	useUserContext,
} from '../../../../../BigFeet.Page';
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

	const [openDeleteModal, setOpenDeleteModal] = useState(false);

	const [amountInput, setAmountInput] = useState<number | null>(
		vipPackage.amount
	);
	const [employeesInput, setEmployeesInput] = useState<number[]>(
		vipPackage.schedules.map((schedule) => schedule.employee_audit_id)
	);

	const [invalidAmount, setInvalidAmount] = useState<boolean>(false);

	const [changesMade, setChangesMade] = useState<boolean>(false);
	const [missingRequiredInput, setMissingRequiredInput] =
		useState<boolean>(false);
	const [invalidInput, setInvalidInput] = useState<boolean>(false);

	const { employees } = useEmployeesContext();

	const { date } = useScheduleDateContext();

	useEffect(() => {
		const amount: number | null | undefined =
			amountInput === vipPackage.amount ? undefined : amountInput;
		const employee_ids: number[] | undefined = arraysHaveSameContent(
			employeesInput,
			vipPackage.schedules.map((schedule) => schedule.employee_audit_id)
		)
			? undefined
			: (employeesInput as number[]);

		const changesMade = amount !== undefined || employee_ids !== undefined;

		setChangesMade(changesMade);

		const missingRequiredInput =
			amountInput === null || employeesInput.length === 0;

		setMissingRequiredInput(missingRequiredInput);
	}, [employeesInput.length, amountInput]);

	useEffect(() => {
		setInvalidInput(invalidAmount);
	}, [invalidInput]);

	const onEdit = () => {
		const amount: number | undefined =
			amountInput === vipPackage.amount ? undefined : (amountInput as number);
		const employee_ids: number[] | undefined = arraysHaveSameContent(
			employeesInput,
			vipPackage.schedules.map((schedule) => schedule.employee_audit_id)
		)
			? undefined
			: (employeesInput as number[]);

		const editVipPackageRequest: UpdateVipPackageRequest = {
			...(amount && { amount }),
			...(employee_ids && { date }),
			...(employee_ids && { employee_ids }),
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
								originalAmount={vipPackage.amount}
								amount={amountInput}
								setAmount={setAmountInput}
								label={LABELS.vip_package.amount}
								name={NAMES.vip_package.amount}
								validationProp={{
									max: NUMBERS.vip_package.amount,
									required: true,
									requiredMessage: ERRORS.vip_package.amount.required,
									invalid: invalidAmount,
									setInvalid: setInvalidAmount,
									invalidMessage: ERRORS.vip_package.amount.invalid,
								}}
								placeholder={PLACEHOLDERS.employee.body_rate}
								editable={editable}
								missingPermissionMessage={ERRORS.vip_package.permissions.edit}
							/>

							<EditableMultiSelect
								originalValues={vipPackage.schedules
									.map((schedule) => schedule.employee_audit_id)
									.map((value) => ({
										value: value,
										label:
											employees.find(
												(employee) => employee.employee_id === value
											)?.username || '',
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
