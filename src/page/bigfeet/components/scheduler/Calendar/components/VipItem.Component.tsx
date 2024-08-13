import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { UpdateVipPackageRequest } from '../../../../../../models/requests/Vip-Package.Request.Model';
import EditVipModal from '../../../miscallaneous/modals/scheduler/calendar/EditVipModal.Component';
import { moneyToString } from '../../../../../../utils/number.utils';
import { Permissions, Role } from '../../../../../../models/enums';
import Employee from '../../../../../../models/Employee.Model';
import User from '../../../../../../models/User.Model';
import { useEmployeesQuery } from '../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

interface VipItemProp {
	vipPackage: VipPackage;
	editable: boolean;
	onEditVipPackage(
		serial: string,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const VipItem: FC<VipItemProp> = ({
	vipPackage,
	editable,
	onEditVipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

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
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	return (
		<div className="list-item-div" onClick={() => setOpen(true)}>
			<span>
				<span className="list-item-field">{t('Serial')}:</span>
				{vipPackage.serial}
			</span>
			<span>
				<span className="list-item-field">{t('Sold Amount')}:</span>$
				{moneyToString(vipPackage.sold_amount)}
			</span>
			<span>
				<span className="list-item-field">{t('Commission Amount')}:</span>$
				{moneyToString(vipPackage.commission_amount)}
			</span>
			<span className="grid grid-flow-col">
				{vipPackage.employee_ids.map((employeeId) => (
					<strong key={employeeId}>
						{employees.find((employee) => employee.employee_id === employeeId)
							?.username +
							' - $' +
							moneyToString(
								vipPackage.commission_amount / vipPackage.employee_ids.length
							)}
					</strong>
				))}
			</span>
			<EditVipModal
				open={open}
				setOpen={setOpen}
				vipPackage={vipPackage}
				editable={editable}
				onEditVipPackage={onEditVipPackage}
				deletable={deletable}
				onDeleteVipPackage={onDeleteVipPackage}
			/>
		</div>
	);
};

export default VipItem;
