import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import DeleteReservation from './DeleteReservation.Component';
import DeleteVip from './DeleteVip.Component';
import VipPackage from '../../../../../../../models/Vip-Package.Model';

interface DeleteVipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
	deletable: boolean;
	onDeleteVipPackage(serial: string): Promise<void>;
}

const DeleteVipModal: FC<DeleteVipModalProp> = ({
	open,
	setOpen,
	vipPackage,
	deletable,
	onDeleteVipPackage,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<DeleteVip
					setOpen={setOpen}
					vipPackage={vipPackage}
					deletable={deletable}
					onDeleteVipPackage={onDeleteVipPackage}
				/>
			}
		/>
	);
};

export default DeleteVipModal;
