import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import VipsModal from '../../../miscallaneous/modals/scheduler/calendar/VipModal.Component';

import VipPackage from '../../../../../../models/Vip-Package.Model';

import { moneyToString } from '../../../../../../utils/number.utils';

interface VipGridProp {
	row: number;
	colNum: number;
	defaultEmployeeId?: number;
	vipPackages: VipPackage[];
}

const VipGrid: FC<VipGridProp> = ({
	row,
	colNum,
	defaultEmployeeId,
	vipPackages,
}) => {
	const { t } = useTranslation();

	const [open, setOpen] = useState<boolean>(false);

	const vipPackagesCommissionTotal = vipPackages
		.map(
			(vipPackage) =>
				vipPackage.commission_amount / vipPackage.employee_ids.length
		)
		.reduce((acc, curr) => acc + parseFloat(curr.toString()), 0);
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="relative border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 transition-colors ease-in-out duration-200 overflow-visible cursor-pointer group"
				onClick={() => setOpen(true)}>
				<div className="grid grid-cols-2 gap-1 text-xs truncate">
					{vipPackages.map((vipPackage) => (
						<strong key={vipPackage.serial}>
							{vipPackage.serial}
							<span className="font-normal">{`($${moneyToString(
								vipPackage.commission_amount / vipPackage.employee_ids.length
							)})`}</span>
						</strong>
					))}
				</div>

				{vipPackages.length > 0 && (
					<span className="grid-tip group-hover:scale-100 z-[3]">
						{vipPackages.map((vipPackage) => (
							<strong key={vipPackage.serial}>
								{vipPackage.serial}
								<span className="font-normal">{`(\$${moneyToString(
									vipPackage.commission_amount / vipPackage.employee_ids.length
								)}) - \$${moneyToString(vipPackage.sold_amount)}`}</span>
							</strong>
						))}
					</span>
				)}

				<span>
					{t('Total')}{' '}
					<span className="font-bold">{`= \$${moneyToString(
						vipPackagesCommissionTotal
					)}`}</span>
				</span>
			</div>

			<VipsModal
				open={open}
				setOpen={setOpen}
				defaultEmployeeId={defaultEmployeeId}
				vipPackages={vipPackages}
			/>
		</>
	);
};

export default VipGrid;
