import { FC } from 'react';

import DeleteVip from './DeleteVip.Component';

import BaseModal from '../../BaseModal.Component';

import VipPackage from '../../../../../../../models/Vip-Package.Model';

interface DeleteVipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
}

const DeleteVipModal: FC<DeleteVipModalProp> = ({
	open,
	setOpen,
	vipPackage,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<DeleteVip setOpen={setOpen} vipPackage={vipPackage} />}
		/>
	);
};

export default DeleteVipModal;
