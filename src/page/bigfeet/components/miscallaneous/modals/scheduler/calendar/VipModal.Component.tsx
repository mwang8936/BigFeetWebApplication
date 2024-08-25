import { FC } from 'react';

import Vips from './Vip.Component';

import BaseModal from '../../BaseModal.Component';

import VipPackage from '../../../../../../../models/Vip-Package.Model';

interface VipsModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	defaultEmployeeId?: number;
	vipPackages: VipPackage[];
}

const VipsModal: FC<VipsModalProp> = ({
	open,
	setOpen,
	defaultEmployeeId,
	vipPackages,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<Vips
					setOpen={setOpen}
					defaultEmployeeId={defaultEmployeeId}
					vipPackages={vipPackages}
				/>
			}
		/>
	);
};

export default VipsModal;
