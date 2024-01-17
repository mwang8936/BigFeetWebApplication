import { FC } from 'react';
import VipPackage from '../../../../../../models/Vip-Package.Model';

interface VipGridProp {
	row: number;
	colNum: number;
	vipPackages: VipPackage[];
}

const VipGrid: FC<VipGridProp> = ({ row, colNum, vipPackages }) => {
	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: row,
				}}
				className="border-slate-500 border-b border-r border-t-2 flex flex-row group"></div>
		</>
	);
};

export default VipGrid;
