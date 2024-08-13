import { FC } from 'react';
import BaseModal from '../../BaseModal.Component';
import EditSchedule from './EditSchedule.Component';
import Schedule from '../../../../../../../models/Schedule.Model';
import { UpdateScheduleRequest } from '../../../../../../../models/requests/Schedule.Request.Model';

interface EditScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	schedule: Schedule;
	editable: boolean;
	onEditSchedule(
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	): Promise<void>;
}

const EditScheduleModal: FC<EditScheduleModalProp> = ({
	open,
	setOpen,
	schedule,
	editable,
	onEditSchedule,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<EditSchedule
					setOpen={setOpen}
					schedule={schedule}
					editable={editable}
					onEditSchedule={onEditSchedule}
				/>
			}
		/>
	);
};

export default EditScheduleModal;
