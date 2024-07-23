import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import { UpdateVipPackageRequest } from '../../../../../../models/requests/Vip-Package.Request.Model';
import EditVipModal from '../../../miscallaneous/modals/scheduler/calendar/EditVipModal.Component';

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
	// const { employees } = useEmployeesContext();

	const [open, setOpen] = useState(false);

	return (
		<div
			className="w-full h-fit p-2 border-2 border-black flex flex-col hover:bg-slate-300 cursor-pointer"
			onClick={() => setOpen(true)}>
			<span>
				<span className="font-bold me-1">{t('Serial')}:</span>
				{vipPackage.serial}
			</span>
			<span>
				<span className="font-bold me-1">{t('Total')}:</span>$
				{vipPackage.amount}
			</span>
			{/* <span className="grid grid-flow-col">
				{vipPackage.schedules.map((schedule) => (
					<strong key={schedule.employee_audit_id}>
						{employees.find(
							(employee) => employee.employee_id === schedule.employee_audit_id
						)?.username +
							' - $' +
							vipPackage.amount / vipPackage.schedules.length}
					</strong>
				))}
			</span> */}
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
