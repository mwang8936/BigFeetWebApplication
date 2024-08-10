import { FC, useState, useEffect } from 'react';
import Reservation from '../../../../../../models/Reservation.Model';
import {
	Gender,
	Permissions,
	Role,
	ServiceColor,
	TipMethod,
} from '../../../../../../models/enums';
import { formatPhoneNumber } from '../../../../../../utils/string.utils';
import { UpdateReservationRequest } from '../../../../../../models/requests/Reservation.Request.Model';
import EditReservationModal from '../../../miscallaneous/modals/scheduler/calendar/EditReservationModal.Component';
import Employee from '../../../../../../models/Employee.Model';
import Draggable from 'react-draggable';
import MoveReservationModal from '../../../miscallaneous/modals/scheduler/calendar/MoveReservationModal.Component';
import STORES from '../../../../../../constants/store.constants';
import { sortEmployees } from '../../../../../../utils/employee.utils';
import { useScheduleDateContext } from '../../Scheduler.Component';
import { useTranslation } from 'react-i18next';
import Schedule from '../../../../../../models/Schedule.Model';
import User from '../../../../../../models/User.Model';
import { useEmployeesQuery } from '../../../../../hooks/employee.hooks';
import { useSchedulesQuery } from '../../../../../hooks/schedule.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';

interface ReservationTagProp {
	reservation: Reservation;
	colNum: number;
	editable: boolean;
	onEditReservation(
		reservationId: number,
		request: UpdateReservationRequest
	): Promise<void>;
	deletable: boolean;
	onDeleteReservation(reservationId: number): Promise<void>;
}

const ReservationTag: FC<ReservationTagProp> = ({
	reservation,
	colNum,
	editable,
	onEditReservation,
	deletable,
	onDeleteReservation,
}) => {
	const { t } = useTranslation();

	const [openEdit, setOpenEdit] = useState(false);
	const [openMove, setOpenMove] = useState(false);

	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const { date } = useScheduleDateContext();

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	sortEmployees(employees, schedules, date);

	useEffect(() => {
		setPosition({ x: 0, y: 0 });
	}, [reservation.employee_id, reservation.reserved_date.getTime()]);

	const employeeOffset = Math.round(position.x / 200);
	const timeOffset = Math.round(position.y / (100 / 6));

	const currEmployeeIndex = employees.findIndex(
		(employee) => employee.employee_id === reservation.employee_id
	);

	const newEmployeeId =
		employeeOffset === 0
			? undefined
			: employees[currEmployeeIndex + employeeOffset || 0].employee_id;

	const newTime =
		timeOffset === 0 ? undefined : new Date(reservation.reserved_date);
	newTime?.setTime(reservation.reserved_date.getTime() + timeOffset * 300000);

	// mt-[x%] where x=1/3 to move down one square
	// row-span-1 is 30 min, row-span-2 is 1 hour

	const startHour = reservation.reserved_date.getHours();
	const startMinute = reservation.reserved_date.getMinutes();

	const rowStart =
		(startHour - STORES.start) * 2 + 2 + Math.floor(startMinute / 30);
	const topMargin = (((startMinute % 30) / 60) * 100).toString() + '%';

	const leftBound = -200 * currEmployeeIndex;
	const rightBound = 200 * (employees.length - currEmployeeIndex - 1);
	const topBound =
		-100 * (rowStart - 2) - (100 / 6) * Math.floor((startMinute % 30) / 5);
	const bottomBound =
		100 * ((STORES.end + 1 - STORES.start) * 2 - rowStart) -
		(100 / 6) * (Math.floor(startMinute % 30) / 5);

	const time = reservation.service.time;
	const height = ((time / 60) * 100).toString() + '%';

	const tipLocation =
		startHour <= 12
			? 'reservation-tip-below group-hover:scale-100 z-[3]'
			: 'reservation-tip-above group-hover:scale-100 z-[3]';

	const colourMap = new Map([
		[ServiceColor.RED, 'bg-red-500 border-red-600'],
		[ServiceColor.BLUE, 'bg-blue-500 border-blue-600'],
		[ServiceColor.YELLOW, 'bg-yellow-500 border-yellow-600'],
		[ServiceColor.GREEN, 'bg-green-500 border-green-600'],
		[ServiceColor.ORANGE, 'bg-orange-500 border-orange-600'],
		[ServiceColor.PURPLE, 'bg-purple-500 border-purple-600'],
		[ServiceColor.GRAY, 'bg-gray-500 border-gray-600'],
		[ServiceColor.BLACK, 'bg-slate-700 border-slate-700'],
	]);

	const startDate = new Date(reservation.reserved_date);

	const endDate = new Date(reservation.reserved_date);
	endDate.setMinutes(
		reservation.reserved_date.getMinutes() + reservation.service.time
	);

	const isActive = new Date() >= startDate && new Date() < endDate;
	const isCompleted = new Date() >= endDate;
	const completionColour = isCompleted
		? 'bg-green-400/60 hover:bg-green-400 border-green-700/40 hover:border-green-700'
		: isActive
		? 'bg-blue-400/60 hover:bg-blue-400 border-blue-700/40 hover:border-blue-700'
		: 'bg-red-400/60 hover:bg-red-400 border-red-700/40 hover:border-red-700';

	const serviceColour =
		colourMap.get(reservation.service.color) || 'bg-slate-100 border-slate-200';

	const serviceText = (
		<span className="text-lg">
			{reservation.requested_employee && ' • '}
			{reservation.service.shorthand}
		</span>
	);

	const moneyText = (validAmount(reservation.cash) ||
		validAmount(reservation.machine) ||
		validAmount(reservation.vip) ||
		validAmount(reservation.gift_card) ||
		validAmount(reservation.insurance)) && (
		<span className="font-medium">
			{validAmount(reservation.cash) && `C${reservation.cash} `}
			{validAmount(reservation.machine) && `M${reservation.machine} `}
			{validAmount(reservation.vip) && `V${reservation.vip} `}
			{validAmount(reservation.gift_card) && `G${reservation.gift_card} `}
			{validAmount(reservation.insurance) && `A${reservation.insurance} `}
		</span>
	);

	const tipText = reservation.tip_method && (
		<span className="font-medium">
			{t('Tips: ') +
				(reservation.tip_method === TipMethod.CASH
					? '自'
					: reservation.tip_method === TipMethod.MACHINE
					? `\$${reservation.tips?.toFixed(2)}` || t('No Tips')
					: reservation.tip_method === TipMethod.HALF && reservation.tips
					? `\$${reservation.tips?.toFixed(2)} / 自`
					: reservation.tip_method === TipMethod.HALF
					? '自'
					: t('Invalid'))}
		</span>
	);

	const requestedGenderText = reservation.requested_gender && (
		<span className="font-medium">
			{t('Requested Gender: ') +
				(reservation.requested_gender === Gender.FEMALE ? 'F' : 'M')}
		</span>
	);

	const customerNameText = reservation.customer?.customer_name && (
		<span className="font-medium">
			{t('Customer')}: <br /> {reservation.customer.customer_name}
		</span>
	);

	const customerPhoneText = reservation.customer?.phone_number && (
		<span className="font-medium">
			{t('Customer Phone #')}: <br />
			{formatPhoneNumber(reservation.customer.phone_number)}
		</span>
	);

	const customerSerialText = reservation.customer?.vip_serial && (
		<span className="font-medium">
			{t('Customer VIP Serial')}: <br />
			{reservation.customer.vip_serial}
		</span>
	);

	const customerNoteText = reservation.customer?.notes && (
		<span className="font-medium">
			{t('Customer Notes')}: <br /> {reservation.customer.notes}
		</span>
	);

	const messageText = reservation.message && (
		<span className="font-medium">{'Notes: ' + reservation.message}</span>
	);

	const timeText = (
		<span className="mt-auto text-base">
			{reservation.reserved_date
				.toLocaleTimeString()
				.replace(/(.*)\D\d+/, '$1')}{' '}
			-{' '}
			{new Date(
				reservation.reserved_date.getTime() + reservation.service.time * 60000
			)
				.toLocaleTimeString()
				.replace(/(.*)\D\d+/, '$1')}
		</span>
	);

	const lastUpdatedText = (
		<span className="font-medium italic">
			{t('Last Updated: ') + reservation.updated_at.toLocaleDateString()}
		</span>
	);

	const updatedByText = (
		<span className="font-medium italic">
			{t('Updated By: ') + reservation.updated_by}
		</span>
	);

	const createdAtText = (
		<span className="font-medium italic">
			{t('Created: ') + reservation.created_at.toLocaleDateString()}
		</span>
	);

	const createdByText = (
		<span className="font-medium italic">
			{t('Created By: ') + reservation.created_by}
		</span>
	);

	return (
		<Draggable
			grid={[200, 100 / 6]}
			disabled={!editable || openEdit || openMove}
			position={position}
			bounds={{
				left: leftBound,
				right: rightBound,
				top: topBound,
				bottom: bottomBound,
			}}
			onDrag={(_, data) => {
				setPosition({ x: data.x, y: data.y });
			}}
			onStop={() => {
				if (timeOffset !== 0 || employeeOffset !== 0) {
					setOpenMove(true);
				} else {
					setOpenEdit(true);
				}
			}}>
			<div
				style={{
					gridColumnStart: colNum,
					gridRowStart: rowStart,
					marginTop: topMargin,
					height: height,
				}}
				className={`row-span-2 ${completionColour} border-4 rounded-lg mx-1 p-1 flex flex-row cursor-move overflow-visible z-[2] hover:z-[3] group`}>
				<span className={tipLocation}>
					{serviceText}
					<br />

					{moneyText}
					{tipText}
					{(moneyText || tipText) && <br />}

					{requestedGenderText}
					{requestedGenderText && <br />}

					{customerNameText}
					{customerNameText && <br />}
					{customerPhoneText}
					{customerPhoneText && <br />}
					{customerSerialText}
					{customerSerialText && <br />}
					{customerNoteText}
					{customerNoteText && <br />}

					{messageText}
					{messageText && <br />}

					{timeText}
					<br />

					{lastUpdatedText}
					{updatedByText}
					<br />

					{createdAtText}
					{createdByText}
				</span>

				<div
					className={`py-1 ${serviceColour} h-full w-[6px] me-3 rounded-2xl border-2`}
				/>

				<div className="flex flex-col text-sm text-black font-bold truncate">
					{serviceText}

					{isCompleted ? (
						<>
							{moneyText}
							{tipText}
						</>
					) : (
						<>
							{requestedGenderText}
							{customerNameText}
						</>
					)}

					{timeText}
				</div>
				<EditReservationModal
					open={openEdit}
					setOpen={setOpenEdit}
					reservation={reservation}
					employeeId={reservation.employee_id}
					editable={editable}
					onEditReservation={onEditReservation}
					deletable={deletable}
					onDeleteReservation={onDeleteReservation}
				/>
				<MoveReservationModal
					open={openMove}
					setOpen={setOpenMove}
					reservation={reservation}
					newEmployeeId={newEmployeeId}
					newTime={newTime}
					editable={editable}
					onEditReservation={onEditReservation}
					onCancel={() => {
						setPosition({ x: 0, y: 0 });
					}}
				/>
			</div>
		</Draggable>
	);
};

const validAmount = (amount: string | number | null) => {
	if (typeof amount === 'string') {
		return parseFloat(amount) !== 0;
	}

	return amount !== null && amount !== 0;
};

export default ReservationTag;
