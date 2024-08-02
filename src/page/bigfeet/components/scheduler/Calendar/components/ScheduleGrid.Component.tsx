import { FC, useState } from 'react';
import Employee from '../../../../../../models/Employee.Model';
import Schedule from '../../../../../../models/Schedule.Model';
import {
	AddScheduleRequest,
	UpdateScheduleRequest,
} from '../../../../../../models/requests/Schedule.Request.Model';
import { formatTimeFromDate } from '../../../../../../utils/string.utils';
import EditScheduleModal from '../../../miscallaneous/modals/scheduler/calendar/EditScheduleModal.Component';
import AddScheduleModal from '../../../miscallaneous/modals/scheduler/calendar/AddScheduleModal.Component';
import { useTranslation } from 'react-i18next';

interface ScheduleGridProp {
	colNum: number;
	employee: Employee;
	date: Date;
	schedule?: Schedule;
	creatable: boolean;
	onAddSchedule(request: AddScheduleRequest): Promise<void>;
	editable: boolean;
	onEditSchedule(
		date: Date,
		employeeId: number,
		request: UpdateScheduleRequest
	): Promise<void>;
}

const ScheduleGrid: FC<ScheduleGridProp> = ({
	colNum,
	employee,
	date,
	schedule,
	creatable,
	onAddSchedule,
	editable,
	onEditSchedule,
}) => {
	const { t } = useTranslation();

	const [open, setOpen] = useState(false);

	const textColour = schedule?.on_call
		? 'text-blue-600 text-xl'
		: schedule?.is_working
		? 'text-slate-900 text-xl'
		: 'text-red-600 text-xl';

	const startText = schedule?.start ? formatTimeFromDate(schedule.start) : '';
	const endText = schedule?.end ? formatTimeFromDate(schedule.end) : '';

	const underText = schedule?.on_call
		? t('On Call')
		: `${startText} - ${endText}`;

	return (
		<>
			<div
				style={{
					gridColumnStart: colNum,
				}}
				onClick={() => {
					setOpen(true);
				}}
				className="row-start-[1] flex flex-col sticky top-0 z-[5] bg-white border-slate-300 bg-clip-padding text-slate-900 border-b text-sm text-ellipsis font-medium py-2 text-center hover:border-r hover:border-l hover:border-black cursor-pointer">
				<h1 className={textColour}>
					{employee.username +
						(schedule?.priority ? `(${schedule.priority})` : '')}{' '}
				</h1>
				<h1>{underText}</h1>
			</div>
			{schedule ? (
				<EditScheduleModal
					open={open}
					setOpen={setOpen}
					schedule={schedule}
					editable={editable}
					onEditSchedule={onEditSchedule}
				/>
			) : (
				<AddScheduleModal
					open={open}
					setOpen={setOpen}
					employeeId={employee.employee_id}
					date={date}
					creatable={creatable}
					onAddSchedule={onAddSchedule}
				/>
			)}
		</>
	);
};

export default ScheduleGrid;
