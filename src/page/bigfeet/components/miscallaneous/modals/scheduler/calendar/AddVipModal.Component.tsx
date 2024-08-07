import { FC } from 'react';

import AddVip from './AddVip.Component';

import BaseModal from '../../BaseModal.Component';

import { AddVipPackageRequest } from '../../../../../../../models/requests/Vip-Package.Request.Model';

interface AddVipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	creatable: boolean;
	onAddVipPackage(request: AddVipPackageRequest): Promise<void>;
}

const AddVipModal: FC<AddVipModalProp> = ({
	open,
	setOpen,
	creatable,
	onAddVipPackage,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddVip
					setOpen={setOpen}
					creatable={creatable}
					onAddVipPackage={onAddVipPackage}
				/>
			}
		/>
	);
};

export default AddVipModal;
