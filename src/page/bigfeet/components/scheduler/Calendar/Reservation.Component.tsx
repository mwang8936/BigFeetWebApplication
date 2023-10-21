import Reservation from '../../../../../models/Reservation.Model';
import { ServiceColor, TipMethod } from '../../../../../models/enums';

interface ReservationTagProp {
	reservation: Reservation;
	colNum: number;
}

interface ReservationColour {
	background: string;
	border: string;
	text: string;
}

export default function ReservationTag(prop: ReservationTagProp) {
	// mt-[x%] where x=1/3 to move down one square
	// row-span-1 is 30 min, row-span-2 is 1 hour

	const startHour = prop.reservation.reserved_time.getHours();
	const startMinute = prop.reservation.reserved_time.getMinutes();

	const rowStart = (startHour - 10) * 2 + 2 + Math.floor(startMinute / 30);
	const topMargin = (((startMinute % 30) / 90) * 100).toString() + '%';

	const time = prop.reservation.service.time;

	const height = ((time / 60) * 100).toString() + '%';

	const colourMap = new Map([[ServiceColor.BLACK, 'bg-black']]);

	/*const bgColour = prop.reservation.is_completed
		? 'rgb(74 222 128 / 0.6)'
		: 'rgb(248 113 113 / 0.6)';*/

	const bgColour = prop.reservation.is_completed
		? 'bg-green-400/60 hover:bg-green-400 border-green-700/10 hover:border-green-700'
		: 'bg-red-400/60 hover:bg-red-400 border-red-700/10 hover:border-red-700';

	return (
		<div
			style={{
				gridColumnStart: prop.colNum,
				gridRowStart: rowStart,
				marginTop: topMargin,
				height: height,
			}}
			className={`row-span-2 ${bgColour} border-2 rounded-lg mx-1 p-1 flex flex-row cursor-pointer group`}
		>
			<span className='reservation-tip group-hover:scale-100'>
				Profile afsdl;f dl;sad fal; fjadls flakjs a;l fjakld akjlf alkf;
				ajsjkldfa;fjaks fdalkfjasjkl;
			</span>
			<div className='py-1 bg-blue-500 border-blue-600 h-full w-[6px] me-3 rounded-2xl border-2 '></div>
			<div className='flex flex-col'>
				<span className='text-xs text-black'>
					• {prop.reservation.service.shorthand}
				</span>

				<span className='text-xs text-black'>
					{prop.reservation.cash && `C${prop.reservation.cash} `}
					{prop.reservation.machine &&
						`M${prop.reservation.machine} `}
					{prop.reservation.vip && `V${prop.reservation.vip}`}
				</span>

				<span className='text-xs text-black'>
					Tips:{' '}
					{prop.reservation.tip_method == TipMethod.CASH
						? '自'
						: prop.reservation.tips || '-----'}
				</span>

				<span className='text-xs font-medium text-black mt-auto'>
					{prop.reservation.reserved_time
						.toLocaleTimeString()
						.replace(/(.*)\D\d+/, '$1')}{' '}
					-{' '}
					{new Date(
						prop.reservation.reserved_time.getTime() +
							prop.reservation.service.time * 60000
					)
						.toLocaleTimeString()
						.replace(/(.*)\D\d+/, '$1')}
				</span>
			</div>
		</div>
	);
}
