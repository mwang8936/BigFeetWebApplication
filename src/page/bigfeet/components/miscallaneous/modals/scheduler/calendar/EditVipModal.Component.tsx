import { FC } from 'react';

import EditVip from './EditVip.Component';

import BaseModal from '../../BaseModal.Component';

import VipPackage from '../../../../../../../models/Vip-Package.Model';

interface EditVipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	vipPackage: VipPackage;
}

const EditVipModal: FC<EditVipModalProp> = ({ open, setOpen, vipPackage }) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<EditVip setOpen={setOpen} vipPackage={vipPackage} />}
		/>
	);
};

export default EditVipModal;
