import { useState } from 'react';
import { AdjustmentsHorizontalIcon } from '@heroicons/react/24/outline';
import AddButton from '../miscallaneous/AddButton.Component';
import Calendar from './Calendar/Calendar.Component';
import FilterDialog from './FilterDialog.Component';
import { useSchedulesContext, useUserContext } from '../../BigFeet.Page';
import AddReservation from './AddReservation.Component';
import { Permissions } from '../../../../models/enums';
import Schedule from '../../../../models/Schedule.Model';
import { sameDate } from '../../../../utils/date.utils';

export default function Scheduler() {
	const [adding, setAdding] = useState(false);
	const [addError, setAddError] = useState('');
	const [addSuccess, setAddSuccess] = useState('');

	const [date, setDate] = useState(new Date());
	const [filtered, setFiltered] = useState(false);
	const [openFilterDialog, setOpenFilterDialog] = useState(false);

	const { schedules } = useSchedulesContext();

	const { user } = useUserContext();

	const creatable = user.permissions.includes(
		Permissions.PERMISSION_ADD_SCHEDULE
	);
	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_SCHEDULE
	);
	const deletable = user.permissions.includes(
		Permissions.PERMISSION_DELETE_SCHEDULE
	);

	console.log(date.toLocaleDateString(undefined, { timeZone: 'UTC' }));
	const displayDate = () => {
		return sameDate(new Date(), date)
			? `Today - ${date.toDateString()}`
			: date.toDateString();
	};

	const sortArray = (a: Schedule, b: Schedule): number => {
		if (a.employee != null && b.employee != null) {
			return a.employee.username.localeCompare(b.employee.username);
		} else if (a.employee == null && b.employee == null) {
			return 0;
		} else if (a.employee == null && b.employee != null) {
			return 1;
		} else {
			return -1;
		}
	};

	return (
		<>
			<div className='h-28 bg-blue border-b-2 border-gray-400 flex flex-row justify-between'>
				<div className='h-fit my-auto flex ms-10'>
					<AddButton
						element={<AddReservation />}
						elementTitle='Add Reservation'
						loading={adding}
						disabled={!creatable}
						missingPermissionMessage='You do not have permission to create schedules.'
						onAdd={() => {}}
						addBtnTitle='Add Reservation'
						addingBtnTitle='Adding Reservation...'
						addTitle='Create Reservation'
						error={addError}
						success={addSuccess}
					/>
				</div>
				<div className='h-fit my-auto flex flex-col'>
					<h1 className='my-auto mx-auto text-gray-600 text-3xl'>
						Scheduler
					</h1>
					<h1 className='mx-auto text-gray-600 text-xl'>
						{displayDate()}
					</h1>
				</div>
				<AdjustmentsHorizontalIcon
					className={`h-16 w-16 ${
						filtered ? 'text-blue-600' : 'text-gray-600'
					} my-auto me-10 cursor-pointer`}
					onClick={() => setOpenFilterDialog(true)}
				/>
				<FilterDialog
					open={openFilterDialog}
					setOpen={setOpenFilterDialog}
					date={date}
					onFilterButtonClicked={(newDate: Date) => {
						const currentDate = new Date();
						setDate(newDate);
						setFiltered(
							newDate.getFullYear != currentDate.getFullYear ||
								newDate.getMonth() != currentDate.getMonth() ||
								newDate.getDate() != currentDate.getDate()
						);
					}}
				/>
			</div>
			<div className='bg-white overflow-hidden h-full'>
				<Calendar
					schedules={schedules
						.filter((schedule) => sameDate(schedule.date, date))
						.sort(sortArray)}
				/>
			</div>
		</>
	);
}
