import { FC } from 'react';

import AddVip from './AddVip.Component';

import BaseModal from '../../BaseModal.Component';

interface AddVipModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	defaultEmployeeId?: number;
}

const AddVipModal: FC<AddVipModalProp> = ({
	open,
	setOpen,
	defaultEmployeeId,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddVip setOpen={setOpen} defaultEmployeeId={defaultEmployeeId} />
			}
		/>
	);
};

export default AddVipModal;
