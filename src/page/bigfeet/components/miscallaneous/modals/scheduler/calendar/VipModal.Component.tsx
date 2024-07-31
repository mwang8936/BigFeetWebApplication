import { FC } from 'react';

import Vip from './Vip.Component';

import BaseModal from '../../BaseModal.Component';

import VipPackage from '../../../../../../../models/Vip-Package.Model';

import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';

interface VipModalProp {
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

const VipModal: FC<VipModalProp> = ({
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
				<Vip
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

export default VipModal;
