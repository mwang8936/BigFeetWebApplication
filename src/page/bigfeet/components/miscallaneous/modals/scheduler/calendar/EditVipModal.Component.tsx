import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import VipPackage from '../../../../../../../models/Vip-Package.Model';
import {
	AddVipPackageRequest,
	UpdateVipPackageRequest,
} from '../../../../../../../models/requests/Vip-Package.Request.Model';
import Vip from './Vip.Component';
import EditVip from './EditVip.Component';

interface EditVipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
	editable: boolean;
	onEditVipPackage(
		serial: string,
		request: UpdateVipPackageRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const EditVipModal: FC<EditVipModalProp> = ({
	open,
	setOpen,
	vipPackage,
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
				<EditVip
					setOpen={setOpen}
					vipPackage={vipPackage}
					editable={editable}
					onEditVipPackage={onEditVipPackage}
					deletable={deletable}
					onDeleteVipPackage={onDeleteVipPackage}
				/>
			}
		/>
	);
};

export default EditVipModal;
