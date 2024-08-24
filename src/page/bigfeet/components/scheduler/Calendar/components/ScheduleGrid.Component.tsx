import { FC, useState } from 'react';
import { useTranslation } from 'react-i18next';

import AddScheduleModal from '../../../miscallaneous/modals/scheduler/calendar/AddScheduleModal.Component';
import EditScheduleModal from '../../../miscallaneous/modals/scheduler/calendar/EditScheduleModal.Component';

import Employee from '../../../../../../models/Employee.Model';
import Schedule from '../../../../../../models/Schedule.Model';

import { formatTimeFromDate } from '../../../../../../utils/string.utils';

interface ScheduleGridProp {
	colNum: number;
	employee: Employee;
	schedule?: Schedule;
}

const ScheduleGrid: FC<ScheduleGridProp> = ({ colNum, employee, schedule }) => {
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
				className="row-start-[1] flex flex-col sticky top-0 z-[5] bg-white border-slate-300 bg-clip-padding text-slate-900 border-b text-sm text-ellipsis font-medium py-2 text-center hover:border-r hover:border-l hover:border-black transition-colors ease-in-out duration-200 cursor-pointer">
				<h1 className={textColour}>
					{employee.username +
						(schedule?.priority ? `(${schedule.priority})` : '')}{' '}
				</h1>

				<h1>{underText}</h1>
			</div>
			{schedule ? (
				<EditScheduleModal open={open} setOpen={setOpen} schedule={schedule} />
			) : (
				<AddScheduleModal
					open={open}
					setOpen={setOpen}
					employeeId={employee.employee_id}
				/>
			)}
		</>
	);
};

export default ScheduleGrid;
