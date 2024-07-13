import { FC, useState } from 'react';
import VipPackage from '../../../../../../models/Vip-Package.Model';
import VipModal from '../../../miscallaneous/modals/scheduler/calendar/VipModal.Component';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../models/requests/Vip-Package.Request.Model';
import VipItem from './VipItem.Component';

interface VipGridProp {
	row: number;
	colNum: number;
	vipPackages: VipPackage[];
	creatable: boolean;
	onAddVipPackage(request: AddVipPackageRequest): Promise<void>;
	editable: boolean;
	onEditVipPackage(
		serial: string,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const VipGrid: FC<VipGridProp> = ({
	row,
	colNum,
	vipPackages,
	creatable,
	onAddVipPackage,
	editable,
	onEditVipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	const [open, setOpen] = useState<boolean>(false);
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="border-slate-500 border-b border-r border-t-2 p-2 z-[2] bg-white hover:bg-slate-300 group overflow-visible cursor-pointer"
				onClick={() => setOpen(true)}>
				<div className="grid grid-cols-2 gap-1 text-xs truncate">
					{vipPackages.map((vipPackage) => (
						<strong key={vipPackage.serial}>
							{vipPackage.serial}
							<span className="font-normal">{`($${
								vipPackage.schedules.length > 0
									? vipPackage.amount / vipPackage.schedules.length
									: vipPackage.amount
							})`}</span>
						</strong>
					))}
				</div>
				{vipPackages.length > 0 && (
					<span className="vip-tip group-hover:scale-100 z-[3]">
						{vipPackages.map((vipPackage) => (
							<strong key={vipPackage.serial}>
								{vipPackage.serial}
								<span className="font-normal">{`($${
									vipPackage.schedules.length > 0
										? vipPackage.amount / vipPackage.schedules.length
										: vipPackage.amount
								})`}</span>
							</strong>
						))}
					</span>
				)}
			</div>
			<VipModal
				open={open}
				setOpen={setOpen}
				vipPackages={vipPackages}
				creatable={creatable}
				onAddVipPackage={onAddVipPackage}
				editable={editable}
				onEditVipPackage={onEditVipPackage}
				deletable={deletable}
				onDeleteVipPackage={onDeleteVipPackage}
			/>
		</>
	);
};

export default VipGrid;
