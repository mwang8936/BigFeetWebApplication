import Employee from '../../../../../models/Employee.Model';
import Schedule from '../../../../../models/Schedule.Model';
import { useEmployeesContext } from '../../../BigFeet.Page';
import CalendarEmployeeColumn from './CalendarEmployeeColumn.Component';
import CalendarFixedColumn from './CalendarFixedColumn.Component';

interface CalendarProp {
	schedules: Schedule[];
}

export default function Calendar(prop: CalendarProp) {
	let allEmployees: Employee[] = [];

	try {
		const { employees } = useEmployeesContext();
		allEmployees.push(...employees);
	} catch {}

	const timeArr = [
		'10:00AM',
		'10:30AM',
		'11:00AM',
		'11:30AM',
		'12:00PM',
		'12:30PM',
		'1:00PM',
		'1:30PM',
		'2:00PM',
		'2:30PM',
		'3:00PM',
		'3:30PM',
		'4:00PM',
		'4:30PM',
		'5:00PM',
		'5:30PM',
		'6:00PM',
		'6:30PM',
		'7:00PM',
		'7:30PM',
		'8:00PM',
		'8:30PM',
		'9:00PM',
		'9:30PM',
		'10:00PM',
		'10:30PM',
	];

	const startHour = new Date().getHours();
	const startMinute = new Date().getMinutes();

	const rowStart = (startHour - 10) * 2 + 2 + Math.floor(startMinute / 30);
	const topMargin = (((startMinute % 30) / 90) * 100).toString() + '%';
	const time = 50;
	const height = ((time / 60) * 100).toString() + '%';

	return (
		<div
			className='overflow-scroll grid max-h-[600px] w-[100%]'
			style={{
				gridTemplateRows: `auto repeat(${timeArr.length},100px)`,
				gridTemplateColumns: `70px repeat(${
					allEmployees.length + 2
				},200px)`,
			}}
		>
			<CalendarFixedColumn timeArr={timeArr} />
			{prop.schedules.map((schedule, index) => (
				<CalendarEmployeeColumn
					key={`${schedule.date.toDateString()} + ${
						schedule.employee?.employee_id
					} `}
					username={
						schedule.employee
							? schedule.employee.username
							: 'Unassigned'
					}
					schedule={schedule}
					colNum={index + 2}
					numRows={timeArr.length}
				/>
			))}

			<div
				style={{
					height: height,
					gridRowStart: rowStart,
					marginTop: topMargin,
				}}
				className={`col-start-[5] row-span-2 bg-blue-400/60 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg mx-1 p-1 flex flex-col`}
			>
				<span className='text-xs text-blue-600 dark:text-sky-100'></span>
				<span className='text-xs font-medium text-blue-600 dark:text-sky-100'>
					{rowStart}
				</span>
				<span className='text-xs text-blue-600 dark:text-sky-100'>
					{topMargin}
				</span>
			</div>
			<div
				style={{
					height: height,
					gridRowStart: 2,
					marginTop: topMargin,
				}}
				className={`row-start-4 col-start-[5] row-span-2 h-5/6 mt-[11%] bg-blue-400/20 dark:bg-sky-600/50 border border-blue-700/10 dark:border-sky-500 rounded-lg mx-1 p-1 flex flex-col`}
			>
				<span className='text-xs text-blue-600 dark:text-sky-100'>
					{startHour}
				</span>
				<span className='text-xs font-medium text-blue-600 dark:text-sky-100'>
					{startMinute}
				</span>
				<span className='text-xs text-blue-600 dark:text-sky-100'>
					{rowStart}
				</span>
			</div>
		</div>
	);
}
