import { FC } from 'react';

import Vips from './Vip.Component';

import BaseModal from '../../BaseModal.Component';

import VipPackage from '../../../../../../../models/Vip-Package.Model';

import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';

interface VipsModalProp {
	open: boolean;
	setOpen(open: boolean): void;
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

const VipsModal: FC<VipsModalProp> = ({
	open,
	setOpen,
	vipPackages,
	creatable,
	onAddVipPackage,
	editable,
	onEditVipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<Vips
					setOpen={setOpen}
					vipPackages={vipPackages}
					creatable={creatable}
					onAddVipPackage={onAddVipPackage}
					editable={editable}
					onEditVipPackage={onEditVipPackage}
					deletable={deletable}
					onDeleteVipPackage={onDeleteVipPackage}
				/>
			}
		/>
	);
};

export default VipsModal;
