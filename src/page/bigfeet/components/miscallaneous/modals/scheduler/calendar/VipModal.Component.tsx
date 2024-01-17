import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import VipPackage from '../../../../../../../models/Vip-Package.Model';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';
import Vip from './Vip.Component';

interface VipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	vipPackages: VipPackage[];
	date: Date;
	creatable: boolean;
	onAddVipPackage(request: AddVipPackageRequest): Promise<void>;
	editable: boolean;
	onEditVipPakcage(
		serial: number,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: number): Promise<void>;
}

const VipModal: FC<VipModalProp> = ({
	open,
	setOpen,
	vipPackages,
	date,
	creatable,
	onAddVipPackage,
	editable,
	onEditVipPakcage,
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
					date={date}
					creatable={creatable}
					onAddVipPackage={onAddVipPackage}
					editable={editable}
					onEditVipPakcage={onEditVipPakcage}
					deletable={deletable}
					onDeleteVipPackage={onDeleteVipPackage}
				/>
			}
		/>
	);
};

export default VipModal;
