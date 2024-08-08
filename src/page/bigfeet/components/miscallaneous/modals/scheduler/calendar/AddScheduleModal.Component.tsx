import { FC } from 'react';

import AddSchedule from './AddSchedule.Component';

import BaseModal from '../../BaseModal.Component';

import { AddScheduleRequest } from '../../../../../../../models/requests/Schedule.Request.Model';

interface AddScheduleModalProp {
	open: boolean;
	setOpen(open: boolean): void;
	employeeId: number;
	date: Date;
	creatable: boolean;
	onAddSchedule(request: AddScheduleRequest): Promise<void>;
}

const AddScheduleModal: FC<AddScheduleModalProp> = ({
	open,
	setOpen,
	employeeId,
	date,
	creatable,
	onAddSchedule,
}) => {
	return (
		<BaseModal
			open={open}
			setOpen={setOpen}
			contentElement={
				<AddSchedule
					setOpen={setOpen}
					employeeId={employeeId}
					date={date}
					creatable={creatable}
					onAddSchedule={onAddSchedule}
				/>
			}
		/>
	);
};

export default AddScheduleModal;
