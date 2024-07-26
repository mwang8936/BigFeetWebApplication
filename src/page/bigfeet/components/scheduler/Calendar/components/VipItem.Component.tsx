import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { UpdateVipPackageRequest } from '../../../../../../models/requests/Vip-Package.Request.Model';
import EditVipModal from '../../../miscallaneous/modals/scheduler/calendar/EditVipModal.Component';
import { moneyToString } from '../../../../../../utils/number.utils';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../../../BigFeet.Page';
import { Permissions, Role } from '../../../../../../models/enums';
import { useQuery } from '@tanstack/react-query';
import { getEmployees } from '../../../../../../service/employee.service';
import Employee from '../../../../../../models/Employee.Model';

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
	const navigate = useNavigate();

	const [open, setOpen] = useState(false);

	const { user } = useUserContext();

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

	return (
		<div
			className="w-full h-fit p-2 border-2 border-black flex flex-col hover:bg-slate-300 cursor-pointer"
			onClick={() => setOpen(true)}>
			<span>
				<span className="font-bold me-1">{t('Serial')}:</span>
				{vipPackage.serial}
			</span>
			<span>
				<span className="font-bold me-1">{t('Sold Amount')}:</span>$
				{moneyToString(vipPackage.sold_amount)}
			</span>
			<span>
				<span className="font-bold me-1">{t('Commission Amount')}:</span>$
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
