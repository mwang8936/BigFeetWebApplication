import { FC } from 'react';
import { ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import { Dialog } from '@headlessui/react';
import ERRORS from '../../../../../../../constants/error.constants';
import DeleteBottom from '../../DeleteBottom.Component';
import { useTranslation } from 'react-i18next';
import VipPackage from '../../../../../../../models/Vip-Package.Model';
import Employee from '../../../../../../../models/Employee.Model';
import { Permissions, Role } from '../../../../../../../models/enums';
import { useNavigate } from 'react-router-dom';
import {
	useEmployeesQuery,
	useUserQuery,
} from '../../../../../../../service/query/get-items.query';
import User from '../../../../../../../models/User.Model';

interface DeleteVipProp {
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const DeleteVip: FC<DeleteVipProp> = ({
	setOpen,
	vipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	const { t } = useTranslation();
	const navigate = useNavigate();

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

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

	const onDelete = () => {
		onDeleteVipPackage(vipPackage.serial);
		setOpen(false);
	};
	return (
		<>
			<div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
				<div className="sm:flex sm:items-start">
					<div className="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-red-100 sm:mx-0 sm:h-10 sm:w-10">
						<ExclamationTriangleIcon
							className="h-6 w-6 text-red-600"
							aria-hidden="true"
						/>
					</div>
					<div className="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
						<Dialog.Title
							as="h3"
							className="text-base font-semibold leading-6 text-gray-900">
							{t('Delete Vip Package', { serial: vipPackage.serial })}
						</Dialog.Title>
						<div className="mt-2">
							{t(
								'Are you sure you want to delete this reservation? This action cannot be reversed.'
							)}
							<br />
							<br />
							<strong>
								{t(
									'Note this will also delete the VIP package for the following employees'
								)}
								:
							</strong>
							<br />
							<br />
							<strong>
								{vipPackage.employee_ids
									.map(
										(employee_id) =>
											employees.find(
												(employee) => employee.employee_id === employee_id
											)?.username || ''
									)
									.join(', ')}
							</strong>
						</div>
					</div>
				</div>
			</div>
			<DeleteBottom
				onCancel={() => setOpen(false)}
				disabledDelete={!deletable}
				deleteMissingPermissionMessage={ERRORS.vip_package.permissions.delete}
				onDelete={onDelete}
			/>
		</>
	);
};

export default DeleteVip;
