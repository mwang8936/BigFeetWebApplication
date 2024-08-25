import { FC } from 'react';

import AddSchedule from './AddSchedule.Component';

import BaseModal from '../../BaseModal.Component';

interface AddScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employeeId: number;
}

const AddScheduleModal: FC<AddScheduleModalProp> = ({
	open,
	setOpen,
	employeeId,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<AddSchedule setOpen={setOpen} employeeId={employeeId} />}
		/>
	);
};

export default AddScheduleModal;
