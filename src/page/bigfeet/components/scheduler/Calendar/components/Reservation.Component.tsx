import { FC, useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import Draggable from 'react-draggable';

import {
	useCalendarScaleContext,
	useScheduleDateContext,
} from '../../Scheduler.Component';

import EditReservationModal from '../../../miscallaneous/modals/scheduler/calendar/EditReservationModal.Component';
import MoveReservationModal from '../../../miscallaneous/modals/scheduler/calendar/MoveReservationModal.Component';

import { useEmployeesQuery } from '../../../../../hooks/employee.hooks';
import { useUserQuery } from '../../../../../hooks/profile.hooks';
import { useSchedulesQuery } from '../../../../../hooks/schedule.hooks';

import STORES from '../../../../../../constants/store.constants';

import Employee from '../../../../../../models/Employee.Model';
import {
	Gender,
	Language,
	Permissions,
	Role,
	ServiceColor,
	TipMethod,
} from '../../../../../../models/enums';
import Reservation from '../../../../../../models/Reservation.Model';
import Schedule from '../../../../../../models/Schedule.Model';
import User from '../../../../../../models/User.Model';

import { sortEmployees } from '../../../../../../utils/employee.utils';
import { moneyToString } from '../../../../../../utils/number.utils';
import { getReservationOverlappingOrder } from '../../../../../../utils/reservation.utils';
import { formatPhoneNumber } from '../../../../../../utils/string.utils';

interface ReservationTagProp {
	reservation: Reservation;
	colNum: number;
}

const ReservationTag: FC<ReservationTagProp> = ({ reservation, colNum }) => {
	const { t } = useTranslation();

	const { date } = useScheduleDateContext();
	const { scale } = useCalendarScaleContext();

	const [openEdit, setOpenEdit] = useState(false);
	const [openMove, setOpenMove] = useState(false);

	const [position, setPosition] = useState<{ x: number; y: number }>({
		x: 0,
		y: 0,
	});

	const userQuery = useUserQuery({ gettable: true, staleTime: Infinity });
	const user: User = userQuery.data;

	const editable = user.permissions.includes(
		Permissions.PERMISSION_UPDATE_RESERVATION
	);

	const employeeGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_EMPLOYEE
	);
	const scheduleGettable = user.permissions.includes(
		Permissions.PERMISSION_GET_SCHEDULE
	);

	const employeeQuery = useEmployeesQuery({
		gettable: employeeGettable,
		staleTime: Infinity,
	});
	const employees: Employee[] = (
		(employeeQuery.data as Employee[]) || [user]
	).filter((employee) => employee.role !== Role.DEVELOPER);

	const scheduleQuery = useSchedulesQuery({
		date,
		gettable: scheduleGettable,
		staleTime: Infinity,
	});
	const schedules: Schedule[] = (
		(scheduleQuery.data as Schedule[]) || []
	).filter((schedule) => schedule.employee.role !== Role.DEVELOPER);

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
		timeOffset === 0
			? undefined
			: new Date(reservation.reserved_date.getTime() + timeOffset * 300000);

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

	const time = reservation.time ?? reservation.service.time;
	const height = ((time / 60) * 100).toString() + '%';

	const left = `${
		30 *
		getReservationOverlappingOrder(
			reservation,
			schedules.flatMap((schedule) => schedule.reservations)
		)
	}px`;

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

	const endDate = new Date(
		reservation.reserved_date.getTime() + time * (1000 * 60)
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

	const cashOutText = reservation.cash_out && (
		<span className="font-medium">
			{t('Cash Out: ') + `\$${moneyToString(reservation.cash_out)}`}
		</span>
	);

	let tipString = t('Tips: ');
	switch (reservation.tip_method) {
		case TipMethod.CASH:
			tipString += '自';
			break;
		case TipMethod.MACHINE:
			if (reservation.tips) {
				tipString += `\$${reservation.tips.toFixed(2)}`;
			} else {
				tipString += t('No Tips');
			}
			break;
		case TipMethod.HALF:
			if (reservation.tips) {
				tipString += `\$${reservation.tips.toFixed(2)} / 自`;
			} else {
				tipString += '自';
			}
			break;
	}

	const tipText = reservation.tip_method && (
		<span className="font-medium">{tipString}</span>
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
			{new Date(reservation.reserved_date.getTime() + time * (1000 * 60))
				.toLocaleTimeString()
				.replace(/(.*)\D\d+/, '$1')}
		</span>
	);

	const language = user.language;

	let localeDateFormat;
	if (language === Language.SIMPLIFIED_CHINESE) {
		localeDateFormat = 'zh-CN';
	} else if (language === Language.TRADITIONAL_CHINESE) {
		localeDateFormat = 'zh-TW';
	} else {
		localeDateFormat = undefined;
	}

	const updatedAtString = reservation.updated_at.toLocaleDateString(
		localeDateFormat,
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
	);
	const lastUpdatedText = (
		<span className="font-medium italic">
			{t('Last Updated: ') + updatedAtString}
		</span>
	);

	const updatedByText = (
		<span className="font-medium italic">
			{t('Updated By: ') + reservation.updated_by}
		</span>
	);

	const createdAtString = reservation.created_at.toLocaleDateString(
		localeDateFormat,
		{
			year: 'numeric',
			month: 'long',
			day: 'numeric',
		}
	);
	const createdAtText = (
		<span className="font-medium italic">
			{t('Created: ') + createdAtString}
		</span>
	);

	const createdByText = (
		<span className="font-medium italic">
			{t('Created By: ') + reservation.created_by}
		</span>
	);

	return (
		<Draggable
			grid={[200 * scale, (100 / 6) * scale]}
			scale={scale}
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
					left: left,
				}}
				className={`row-span-2 ${completionColour} border-4 rounded-lg mx-1 p-1 flex flex-row cursor-move overflow-visible z-[2] transition-colors ease-in-out duration-200 hover:z-[3] group relative`}>
				<span className={tipLocation}>
					{serviceText}
					<br />

					{moneyText}
					{cashOutText}
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
				/>

				<MoveReservationModal
					open={openMove}
					setOpen={setOpenMove}
					reservation={reservation}
					newEmployeeId={newEmployeeId}
					newTime={newTime}
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
