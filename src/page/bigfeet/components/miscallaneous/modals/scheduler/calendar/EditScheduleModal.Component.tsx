import { FC } from 'react';

import EditSchedule from './EditSchedule.Component';

import BaseModal from '../../BaseModal.Component';

import Schedule from '../../../../../../../models/Schedule.Model';

interface EditScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	schedule: Schedule;
}

const EditScheduleModal: FC<EditScheduleModalProp> = ({
	open,
	setOpen,
	schedule,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={<EditSchedule setOpen={setOpen} schedule={schedule} />}
		/>
	);
};

export default EditScheduleModal;
